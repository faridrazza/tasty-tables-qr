import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimpleMetricCardProps {
  title: string;
  value: number | string;
}

export const SimpleMetricCard = ({ title, value }: SimpleMetricCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
      </CardContent>
    </Card>
  );
};