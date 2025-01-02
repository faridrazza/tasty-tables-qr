import { MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import MenuStateHandler from "./MenuStateHandler";

interface MenuItemListProps {
  items: MenuItem[];
  onDelete: (id: string) => void;
  onToggleOutOfStock: (id: string, currentStatus: boolean) => void;
  isLoading?: boolean;
}

const MenuItemList = ({ items, onDelete, onToggleOutOfStock, isLoading = false }: MenuItemListProps) => {
  const stateHandler = <MenuStateHandler isLoading={isLoading} itemsCount={items.length} />;
  if (stateHandler) return stateHandler;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {item.halfPrice > 0 && (
                    <p>Half: ₹{item.halfPrice}</p>
                  )}
                  <p>Full: ₹{item.fullPrice}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Switch
                checked={item.outOfStock}
                onCheckedChange={(checked) =>
                  onToggleOutOfStock(item.id, item.outOfStock)
                }
              />
              <span className="text-sm text-gray-600">Out of Stock</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;