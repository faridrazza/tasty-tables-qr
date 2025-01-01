import { SimpleMetricCard } from "./SimpleMetricCard";
import { TopSellingCard } from "./TopSellingCard";
import { OrdersChart } from "./OrdersChart";
import { OrderAnalytics } from "@/types/analytics";

interface AnalyticsGridProps {
  analytics: OrderAnalytics;
}

export const AnalyticsGrid = ({ analytics }: AnalyticsGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SimpleMetricCard
          title="Today's Revenue"
          value={analytics?.todayRevenue ? `₹${analytics.todayRevenue.toFixed(2)}` : 'Not enough data available'}
        />
        <SimpleMetricCard
          title="This Month's Revenue"
          value={analytics?.monthlyRevenue ? `₹${analytics.monthlyRevenue.toFixed(2)}` : 'Not enough data available'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SimpleMetricCard
          title="Previous Month's Revenue"
          value={analytics?.previousMonthRevenue ? `₹${analytics.previousMonthRevenue.toFixed(2)}` : 'Not enough data available'}
        />
        <SimpleMetricCard
          title="This Month's Total Transactions"
          value={analytics?.monthlyTransactions || 'Not enough data available'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SimpleMetricCard
          title="This Month's Total Orders"
          value={analytics?.monthlyOrders || 'Not enough data available'}
        />
        <TopSellingCard
          title="Today's Top Selling Item"
          itemName={analytics?.topSellingItem || 'Not enough data available'}
          count={analytics?.topSellingItemCount || 0}
        />
      </div>

      <OrdersChart data={analytics?.hourlyOrders || []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SimpleMetricCard
          title="Today's Total Orders"
          value={analytics?.todayOrders || 'Not enough data available'}
        />
        <SimpleMetricCard
          title="Today's Total Transactions"
          value={analytics?.todayTransactions || 'Not enough data available'}
        />
      </div>
    </>
  );
};