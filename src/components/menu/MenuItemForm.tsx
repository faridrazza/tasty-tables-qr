import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "@/types/menu";

interface MenuItemFormProps {
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
  showOutOfStock?: boolean;
  isHalfPriceOptional?: boolean;
  initialItem?: MenuItem;
}

const MenuItemForm = ({ 
  onSave, 
  onCancel, 
  showOutOfStock = true,
  isHalfPriceOptional = false,
  initialItem 
}: MenuItemFormProps) => {
  const [item, setItem] = useState<MenuItem>(initialItem || {
    id: "",
    name: "",
    image: "",
    halfPrice: 0,
    fullPrice: 0,
    outOfStock: false,
    isVegetarian: false,
    category: "",
  });

  const handleUpdate = (field: keyof MenuItem, value: string | boolean | number) => {
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {initialItem ? "Edit Item" : "Add New Item"}
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <Input
              value={item.name}
              onChange={(e) => handleUpdate("name", e.target.value)}
              placeholder="Enter item name"
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Image *
            </label>
            <div className="flex items-center gap-4">
              {item.image ? (
                <div className="relative w-24 h-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => handleUpdate("image", "")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <ImageUpload
                  onImageUploaded={(url) => handleUpdate("image", url)}
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Half Price {!isHalfPriceOptional && '*'}
            </label>
            <Input
              type="number"
              value={item.halfPrice || ""}
              onChange={(e) => handleUpdate("halfPrice", Number(e.target.value))}
              placeholder="Enter half price"
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Price *
            </label>
            <Input
              type="number"
              value={item.fullPrice || ""}
              onChange={(e) => handleUpdate("fullPrice", Number(e.target.value))}
              placeholder="Enter full price"
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Input
              value={item.category || ""}
              onChange={(e) => handleUpdate("category", e.target.value)}
              placeholder="Enter category (e.g., ice cream, bread)"
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={item.isVegetarian}
                onCheckedChange={(checked) => handleUpdate("isVegetarian", checked)}
              />
              <span className="text-sm text-gray-600">Vegetarian</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={!item.isVegetarian}
                onCheckedChange={(checked) => handleUpdate("isVegetarian", !checked)}
              />
              <span className="text-sm text-gray-600">Non-Vegetarian</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          {showOutOfStock && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={item.outOfStock}
                onCheckedChange={(checked) => handleUpdate("outOfStock", checked)}
              />
              <span className="text-sm text-gray-600">Out of Stock</span>
            </div>
          )}
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => onSave(item)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;