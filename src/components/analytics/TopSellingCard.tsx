import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopSellingCardProps {
  title: string;
  itemName: string;
  count: number;
}

export const TopSellingCard = ({ title, itemName, count }: TopSellingCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{itemName}</div>
        <p className="text-xs text-muted-foreground">
          Ordered {count} times
        </p>
      </CardContent>
    </Card>
  );
};