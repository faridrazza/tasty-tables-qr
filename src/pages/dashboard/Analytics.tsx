import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfToday, startOfMonth, format, parseISO, subMonths } from "date-fns";
import { RevenueCard } from "@/components/analytics/RevenueCard";
import { MetricCard } from "@/components/analytics/MetricCard";
import { OrdersChart } from "@/components/analytics/OrdersChart";

interface OrderAnalytics {
  todayRevenue: number;
  previousMonthRevenue: number;
  monthlyRevenue: number;
  todayOrders: number;
  monthlyOrders: number;
  todayTransactions: number;
  monthlyTransactions: number;
  topSellingItem: string;
  monthlyTopSellingItem: string;
  hourlyOrders: { hour: string; orders: number }[];
}

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

  // Find top selling items
  const topSellingItem = Object.entries(itemSales).reduce(
    (max, [item, count]) => (count > max[1] ? [item, count] : max),
    ['', 0]
  )[0];

  const monthlyTopSellingItem = Object.entries(monthlyItemSales).reduce(
    (max, [item, count]) => (count > max[1] ? [item, count] : max),
    ['', 0]
  )[0];

  return {
    todayRevenue,
    previousMonthRevenue,
    monthlyRevenue,
    todayOrders: todayOrders?.length || 0,
    monthlyOrders: monthlyOrders?.length || 0,
    todayTransactions: todayOrders?.length || 0,
    monthlyTransactions: monthlyOrders?.length || 0,
    topSellingItem: topSellingItem || 'No orders today',
    monthlyTopSellingItem: monthlyTopSellingItem || 'No orders this month',
    hourlyOrders: hourlyOrdersArray,
  };
};

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedPeriods, setSelectedPeriods] = useState({
    revenue: 'today',
    transactions: 'today',
    orders: 'today',
    topSelling: 'today'
  });

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
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
  }

  const periods = {
    revenue: [
      { value: 'today', label: "Today's Revenue" },
      { value: 'month', label: "This Month's Revenue" }
    ],
    transactions: [
      { value: 'today', label: "Today's Transactions" },
      { value: 'month', label: "This Month's Transactions" }
    ],
    orders: [
      { value: 'today', label: "Today's Orders" },
      { value: 'month', label: "This Month's Orders" }
    ],
    topSelling: [
      { value: 'today', label: "Today's Top Seller" },
      { value: 'month', label: "This Month's Top Seller" }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RevenueCard
          title="Revenue"
          amount={selectedPeriods.revenue === 'today' ? analytics?.todayRevenue || 0 : analytics?.monthlyRevenue || 0}
          previousAmount={analytics?.previousMonthRevenue}
          showComparison={selectedPeriods.revenue === 'month'}
          onPeriodChange={(period) => setSelectedPeriods(prev => ({ ...prev, revenue: period }))}
          periods={periods.revenue}
        />
        <MetricCard
          title="Transactions"
          value={selectedPeriods.transactions === 'today' ? analytics?.todayTransactions || 0 : analytics?.monthlyTransactions || 0}
          previousValue={selectedPeriods.transactions === 'month' ? analytics?.todayTransactions : undefined}
          showComparison={selectedPeriods.transactions === 'month'}
          onPeriodChange={(period) => setSelectedPeriods(prev => ({ ...prev, transactions: period }))}
          periods={periods.transactions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MetricCard
          title="Orders"
          value={selectedPeriods.orders === 'today' ? analytics?.todayOrders || 0 : analytics?.monthlyOrders || 0}
          previousValue={selectedPeriods.orders === 'month' ? analytics?.todayOrders : undefined}
          showComparison={selectedPeriods.orders === 'month'}
          onPeriodChange={(period) => setSelectedPeriods(prev => ({ ...prev, orders: period }))}
          periods={periods.orders}
        />
        <MetricCard
          title="Top Selling Item"
          value={1}
          previousValue={undefined}
          showComparison={false}
          onPeriodChange={(period) => setSelectedPeriods(prev => ({ ...prev, topSelling: period }))}
          periods={periods.topSelling}
        />
      </div>

      <OrdersChart data={analytics?.hourlyOrders || []} />
    </div>
  );
};

export default Analytics;