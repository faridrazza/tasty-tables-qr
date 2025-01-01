export interface OrderAnalytics {
  todayRevenue: number;
  previousMonthRevenue: number;
  monthlyRevenue: number;
  todayOrders: number;
  monthlyOrders: number;
  todayTransactions: number;
  monthlyTransactions: number;
  topSellingItem: string;
  topSellingItemCount: number;
  monthlyTopSellingItem: string;
  monthlyTopSellingItemCount: number;
  hourlyOrders: { hour: string; orders: number }[];
}