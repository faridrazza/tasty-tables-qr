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
  });

  const handleUpdate = (field: keyof MenuItem, value: string | boolean | number) => {
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Item Name *
          </label>
          <Input
            value={item.name}
            onChange={(e) => handleUpdate("name", e.target.value)}
            placeholder="Enter item name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Item Image *
          </label>
          <div className="flex items-center gap-4">
            {item.image ? (
              <div className="relative w-20 h-20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={() => handleUpdate("image", "")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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
          <label className="block text-sm font-medium mb-1">
            Half Price {!isHalfPriceOptional && '*'}
          </label>
          <Input
            type="number"
            value={item.halfPrice || ""}
            onChange={(e) => handleUpdate("halfPrice", Number(e.target.value))}
            placeholder="Enter half price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Price *
          </label>
          <Input
            type="number"
            value={item.fullPrice || ""}
            onChange={(e) => handleUpdate("fullPrice", Number(e.target.value))}
            placeholder="Enter full price"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        {showOutOfStock && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={item.outOfStock}
              onCheckedChange={(checked) => handleUpdate("outOfStock", checked)}
            />
            <span className="text-sm text-gray-600">Out of Stock</span>
          </div>
        )}
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(item)}>Save Item</Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;