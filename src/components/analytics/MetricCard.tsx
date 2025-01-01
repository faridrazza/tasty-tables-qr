import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  showComparison?: boolean;
  onPeriodChange?: (period: string) => void;
  periods?: { value: string; label: string }[];
}

export const MetricCard = ({ 
  title, 
  value, 
  previousValue, 
  showComparison,
  onPeriodChange,
  periods 
}: MetricCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {periods && onPeriodChange && (
          <Select onValueChange={onPeriodChange} defaultValue={periods[0].value}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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