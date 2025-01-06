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
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { OrderItems } from "@/components/orders/OrderItems";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { OrderDocumentActions } from "@/components/orders/OrderDocumentActions";
import { KOTTemplate } from "@/components/orders/KOTTemplate";
import { BillTemplate } from "@/components/orders/BillTemplate";
import { printContent, downloadPDF } from "@/utils/printUtils";

const Orders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items (
              name,
              half_price,
              full_price
            )
          )
        `)
        .eq("restaurant_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: gstSettings } = useQuery({
    queryKey: ["gst-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gst_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: `Order ${data.status} successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update order status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculateSubtotal = (items: any[]) => {
    return items.reduce((total, item) => {
      const price = item.size === 'full' ? item.menu_item.full_price : item.menu_item.half_price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleKOTActions = (order: any) => {
    const kotContent = KOTTemplate({
      orderItems: order.order_items,
      tableNumber: order.table_number,
      orderTime: order.created_at,
    });

    return {
      view: () => printContent(kotContent),
      print: () => printContent(kotContent),
    };
  };

  const handleBillActions = (order: any) => {
    const subtotal = calculateSubtotal(order.order_items);
    const billContent = BillTemplate({
      orderItems: order.order_items,
      tableNumber: order.table_number,
      orderTime: order.created_at,
      gstSettings,
      subtotal,
    });

    return {
      view: () => printContent(billContent),
      print: () => printContent(billContent),
      download: () => downloadPDF(billContent, `bill-${order.id}.pdf`),
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>KOT</TableHead>
              <TableHead>Bill</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => {
              const kotActions = handleKOTActions(order);
              const billActions = handleBillActions(order);
              
              return (
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
                    <OrderDocumentActions
                      onView={kotActions.view}
                      onPrint={kotActions.print}
                    />
                  </TableCell>
                  <TableCell>
                    <OrderDocumentActions
                      onView={billActions.view}
                      onPrint={billActions.print}
                      onDownload={billActions.download}
                    />
                  </TableCell>
                  <TableCell>
                    {order.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() =>
                            updateOrderStatus.mutate({
                              orderId: order.id,
                              status: "confirmed",
                            })
                          }
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateOrderStatus.mutate({
                              orderId: order.id,
                              status: "cancelled",
                            })
                          }
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;