import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { startOfToday, startOfMonth, format, parseISO } from "date-fns";

interface OrderAnalytics {
  todayRevenue: number;
  todayOrders: number;
  topSellingItem: string;
  monthlyRevenue: number;
  hourlyOrders: { hour: string; orders: number }[];
}

const fetchAnalytics = async (): Promise<OrderAnalytics> => {
  const today = startOfToday();
  const startOfCurrentMonth = startOfMonth(new Date());

  // Fetch today's orders
  const { data: todayOrders, error: todayError } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      order_items (
        quantity,
        size,
        menu_item_id,
        menu_item:menu_items (
          name,
          half_price,
          full_price
        )
      )
    `)
    .gte('created_at', today.toISOString())
    .neq('status', 'cancelled');

  if (todayError) throw todayError;

  // Fetch monthly orders for revenue calculation
  const { data: monthlyOrders, error: monthlyError } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      order_items (
        quantity,
        size,
        menu_item_id,
        menu_item:menu_items (
          name,
          half_price,
          full_price
        )
      )
    `)
    .gte('created_at', startOfCurrentMonth.toISOString())
    .neq('status', 'cancelled');

  if (monthlyError) throw monthlyError;

  // Calculate today's revenue and item sales
  const itemSales: { [key: string]: number } = {};
  let todayRevenue = 0;

  todayOrders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.menu_item) {
        // Add to item sales count
        const itemName = item.menu_item.name;
        itemSales[itemName] = (itemSales[itemName] || 0) + item.quantity;

        // Calculate revenue
        const price = item.size === 'half' ? item.menu_item.half_price : item.menu_item.full_price;
        todayRevenue += price * item.quantity;
      }
    });
  });

  // Calculate monthly revenue
  let monthlyRevenue = 0;
  monthlyOrders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.menu_item) {
        const price = item.size === 'half' ? item.menu_item.half_price : item.menu_item.full_price;
        monthlyRevenue += price * item.quantity;
      }
    });
  });

  // Find top selling item
  const topSellingItem = Object.entries(itemSales).reduce(
    (max, [item, count]) => (count > max[1] ? [item, count] : max),
    ['', 0]
  )[0];

  // Calculate hourly orders
  const hourlyOrders: { [key: string]: number } = {};
  todayOrders?.forEach(order => {
    const hour = format(parseISO(order.created_at), 'ha');
    hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
  });

  const hourlyOrdersArray = Object.entries(hourlyOrders).map(([hour, orders]) => ({
    hour,
    orders,
  }));

  return {
    todayRevenue,
    todayOrders: todayOrders?.length || 0,
    topSellingItem: topSellingItem || 'No orders today',
    monthlyRevenue,
    hourlyOrders: hourlyOrdersArray,
  };
};

const Analytics = () => {
  const navigate = useNavigate();

  // Check authentication status immediately
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Also use the hook for continuous auth monitoring
  useRequireAuth();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <Select defaultValue="today">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Most Ordered Today</h3>
          <p className="text-3xl font-bold text-primary">{analytics?.topSellingItem}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Revenue Overview</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-primary">₹{analytics?.todayRevenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month's Revenue</p>
              <p className="text-2xl font-bold text-primary">₹{analytics?.monthlyRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Orders by Hour</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={analytics?.hourlyOrders || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#1E3A8A" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;