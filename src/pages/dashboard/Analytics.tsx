import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfToday, startOfMonth, format, parseISO, subMonths } from "date-fns";
import { AnalyticsGrid } from "@/components/analytics/AnalyticsGrid";
import type { OrderAnalytics } from "@/types/analytics";

const fetchAnalytics = async (): Promise<OrderAnalytics> => {
  const today = startOfToday();
  const startOfCurrentMonth = startOfMonth(new Date());
  const startOfPreviousMonth = startOfMonth(subMonths(new Date(), 1));

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

  // Fetch monthly orders
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

  // Fetch previous month's orders
  const { data: previousMonthOrders, error: previousMonthError } = await supabase
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
    .gte('created_at', startOfPreviousMonth.toISOString())
    .lt('created_at', startOfCurrentMonth.toISOString())
    .neq('status', 'cancelled');

  if (previousMonthError) throw previousMonthError;

  // Calculate metrics
  let todayRevenue = 0;
  let monthlyRevenue = 0;
  let previousMonthRevenue = 0;
  const itemSales: { [key: string]: number } = {};
  const monthlyItemSales: { [key: string]: number } = {};

  // Calculate today's metrics
  todayOrders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.menu_item) {
        const itemName = item.menu_item.name;
        itemSales[itemName] = (itemSales[itemName] || 0) + item.quantity;
        const price = item.size === 'half' ? item.menu_item.half_price : item.menu_item.full_price;
        todayRevenue += price * item.quantity;
      }
    });
  });

  // Calculate monthly metrics
  monthlyOrders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.menu_item) {
        const itemName = item.menu_item.name;
        monthlyItemSales[itemName] = (monthlyItemSales[itemName] || 0) + item.quantity;
        const price = item.size === 'half' ? item.menu_item.half_price : item.menu_item.full_price;
        monthlyRevenue += price * item.quantity;
      }
    });
  });

  // Calculate previous month's revenue
  previousMonthOrders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.menu_item) {
        const price = item.size === 'half' ? item.menu_item.half_price : item.menu_item.full_price;
        previousMonthRevenue += price * item.quantity;
      }
    });
  });

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

  // Find top selling items with counts
  const topSellingItemData = Object.entries(itemSales).reduce(
    (max, [item, count]) => (count > max[1] ? [item, count] : max),
    ['', 0]
  );

  const monthlyTopSellingItemData = Object.entries(monthlyItemSales).reduce(
    (max, [item, count]) => (count > max[1] ? [item, count] : max),
    ['', 0]
  );

  return {
    todayRevenue,
    previousMonthRevenue,
    monthlyRevenue,
    todayOrders: todayOrders?.length || 0,
    monthlyOrders: monthlyOrders?.length || 0,
    todayTransactions: todayOrders?.length || 0,
    monthlyTransactions: monthlyOrders?.length || 0,
    topSellingItem: topSellingItemData[0] || 'No orders today',
    topSellingItemCount: topSellingItemData[1] as number,
    monthlyTopSellingItem: monthlyTopSellingItemData[0] || 'No orders this month',
    monthlyTopSellingItemCount: monthlyTopSellingItemData[1] as number,
    hourlyOrders: hourlyOrdersArray,
  };
};

const Analytics = () => {
  const navigate = useNavigate();

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

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
  }

  const hasData = analytics && Object.values(analytics).some(value => 
    typeof value === 'number' ? value > 0 : value !== null && value !== undefined
  );

  if (!hasData) {
    return <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Analytics</h1>
      <div className="text-center text-gray-500">Not enough data available.</div>
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Analytics</h1>
      <AnalyticsGrid analytics={analytics} />
    </div>
  );
};

export default Analytics;
