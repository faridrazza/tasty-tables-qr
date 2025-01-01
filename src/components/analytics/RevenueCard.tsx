import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RevenueCardProps {
  title: string;
  amount: number;
  previousAmount?: number;
  showComparison?: boolean;
  onPeriodChange?: (period: string) => void;
  periods?: { value: string; label: string }[];
}

export const RevenueCard = ({ 
  title, 
  amount, 
  previousAmount, 
  showComparison,
  onPeriodChange,
  periods 
}: RevenueCardProps) => {
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
        <div className="text-2xl font-bold text-primary">₹{amount.toFixed(2)}</div>
        {showComparison && previousAmount !== undefined && (
          <p className="text-xs text-muted-foreground">
            Previous: ₹{previousAmount.toFixed(2)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};