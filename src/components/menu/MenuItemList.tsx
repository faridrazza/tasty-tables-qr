
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit } from "lucide-react";
import { MenuItem } from "@/types/menu";
import MenuItemForm from "./MenuItemForm";
import { useState } from "react";

interface MenuItemListProps {
  items: MenuItem[];
  onDelete: (id: string) => void;
  onToggleOutOfStock: (id: string, currentStatus: boolean) => void;
  onEdit: (item: MenuItem) => void;
}

const MenuItemList = ({ items, onDelete, onToggleOutOfStock, onEdit }: MenuItemListProps) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEditClick = (item: MenuItem) => {
    setEditingItemId(item.id);
  };

  const handleSave = (updatedItem: MenuItem) => {
    onEdit(updatedItem);
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setEditingItemId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          {editingItemId === item.id ? (
            <MenuItemForm
              onSave={handleSave}
              onCancel={handleCancel}
              initialItem={item}
              showOutOfStock={true}
            />
          ) : (
            <>
              <div className="border-b border-gray-100 bg-gray-50/50 px-4 md:px-6 py-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
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
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Half Price
                      </label>
                      <div className="text-base md:text-lg font-semibold text-primary">
                        {item.halfPrice ? `₹${item.halfPrice}` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Full Price
                      </label>
                      <div className="text-base md:text-lg font-semibold text-primary">
                        ₹{item.fullPrice}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6 pt-4 border-t border-gray-100">
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
                      onClick={() => handleEditClick(item)}
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;
