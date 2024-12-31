import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MenuItemListProps {
  items: MenuItem[];
  onDelete: (id: string) => void;
  onToggleOutOfStock: (id: string, currentStatus: boolean) => void;
}

const MenuItemList = ({ items, onDelete, onToggleOutOfStock }: MenuItemListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white p-6 rounded-lg shadow-sm space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Name
              </label>
              <div className="text-gray-700">{item.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Image
              </label>
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Half Price
              </label>
              <div className="text-gray-700">
                {item.halfPrice ? `$${item.halfPrice}` : 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Price
              </label>
              <div className="text-gray-700">${item.fullPrice}</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={item.outOfStock} 
                onCheckedChange={() => onToggleOutOfStock(item.id, item.outOfStock)}
              />
              <span className="text-sm text-gray-600">Out of Stock</span>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;