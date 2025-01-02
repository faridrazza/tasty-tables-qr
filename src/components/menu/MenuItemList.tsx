import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MenuItemListProps {
  items: MenuItem[];
  onDelete: (id: string) => void;
  onToggleOutOfStock: (id: string, currentStatus: boolean) => void;
  onEdit: (item: MenuItem) => void;
}

const MenuItemList = ({ items, onDelete, onToggleOutOfStock, onEdit }: MenuItemListProps) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <div className="flex items-center space-x-2">
                {item.isVegetarian !== undefined && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.isVegetarian 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                  }`}>
                    {item.isVegetarian ? "Veg" : "Non-Veg"}
                  </span>
                )}
                {item.category && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Half Price
                  </label>
                  <div className="text-lg font-semibold text-primary">
                    {item.halfPrice ? `₹${item.halfPrice}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Price
                  </label>
                  <div className="text-lg font-semibold text-primary">
                    ₹{item.fullPrice}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-4">
                <div className="relative w-24 h-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={item.outOfStock} 
                  onCheckedChange={() => onToggleOutOfStock(item.id, item.outOfStock)}
                />
                <span className="text-sm text-gray-600">Out of Stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;