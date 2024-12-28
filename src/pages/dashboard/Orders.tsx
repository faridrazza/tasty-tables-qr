import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Order {
  id: string;
  tableNumber: number;
  items: { name: string; quantity: number; size: "half" | "full" }[];
  status: "pending" | "completed";
  timestamp: Date;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      tableNumber: 5,
      items: [
        { name: "Margherita Pizza", quantity: 2, size: "full" },
        { name: "Garlic Bread", quantity: 1, size: "half" },
      ],
      status: "pending",
      timestamp: new Date(),
    },
  ]);

  const handleCompleteOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`bg-white p-6 rounded-lg shadow-sm ${
              order.status === "completed" ? "opacity-60" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Table {order.tableNumber}</h3>
                <p className="text-sm text-gray-500">
                  {order.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {order.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => handleCompleteOrder(order.id)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              )}
            </div>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item.quantity}x {item.name} ({item.size})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;