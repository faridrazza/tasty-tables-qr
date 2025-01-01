import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueCardProps {
  title: string;
  amount: number;
  previousAmount?: number;
  showComparison?: boolean;
}

export const RevenueCard = ({ title, amount, previousAmount, showComparison }: RevenueCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DollarSign className="h-4 w-4 text-primary" />
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