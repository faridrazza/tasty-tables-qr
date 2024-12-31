interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  size: string;
  menu_item: {
    name: string;
  };
}

interface OrderItemsProps {
  items: OrderItem[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          {item.quantity}x {item.menu_item.name} ({item.size})
        </li>
      ))}
    </ul>
  );
};