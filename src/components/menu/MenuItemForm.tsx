import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MenuItem {
  id: string;
  name: string;
  image: string;
  halfPrice: number;
  fullPrice: number;
  outOfStock: boolean;
}

interface MenuItemFormProps {
  item: MenuItem;
  onUpdate: (field: keyof MenuItem, value: string | boolean | number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const MenuItemForm = ({ item, onUpdate, onSave, onCancel }: MenuItemFormProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    if (!item.image) {
      toast({
        title: "Image Required",
        description: "Please upload an image for the menu item",
        variant: "destructive",
      });
      return;
    }
    onSave();
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
            onChange={(e) => onUpdate("name", e.target.value)}
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
                  onClick={() => onUpdate("image", "")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <ImageUpload
                onImageUploaded={(url) => onUpdate("image", url)}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Half Price *
          </label>
          <Input
            type="number"
            value={item.halfPrice || ""}
            onChange={(e) => onUpdate("halfPrice", Number(e.target.value))}
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
            onChange={(e) => onUpdate("fullPrice", Number(e.target.value))}
            placeholder="Enter full price"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            checked={item.outOfStock}
            onCheckedChange={(checked) => onUpdate("outOfStock", checked)}
          />
          <span className="text-sm text-gray-600">Out of Stock</span>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Item</Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;