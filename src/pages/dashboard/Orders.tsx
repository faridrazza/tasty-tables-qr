import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { OrderStatus } from "@/components/orders/OrderStatus";
import { OrderItems } from "@/components/orders/OrderItems";
import { StatusBadge } from "@/components/orders/StatusBadge";

interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  size: string;
  menu_item: {
    name: string;
  };
}

interface Order {
  id: string;
  table_number: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      console.log("Fetching orders...");
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      console.log("Orders fetched:", data);
      return data as Order[];
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      console.log("Updating order status:", { orderId, status });
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        console.error("Error updating order:", error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      const actionText = data.status === 'cancelled' ? 'cancelled' : 'completed';
      toast({
        title: `Order ${actionText} successfully`,
      });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Failed to update order status",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (orderId: string, status: string) => {
    console.log("Handle update status called:", { orderId, status });
    updateOrderStatus.mutate({ orderId, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Orders</h1>
          <p className="text-gray-600">There are no orders to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>Table {order.table_number}</TableCell>
                <TableCell>
                  <OrderItems items={order.order_items} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <OrderStatus
                    status={order.status}
                    orderId={order.id}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;