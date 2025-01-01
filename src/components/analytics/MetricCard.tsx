import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  showComparison?: boolean;
  Icon: LucideIcon;
}

export const MetricCard = ({ title, value, previousValue, showComparison, Icon }: MetricCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {showComparison && previousValue !== undefined && (
          <p className="text-xs text-muted-foreground">
            Previous: {previousValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
};