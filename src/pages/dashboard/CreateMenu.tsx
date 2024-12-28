import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  image: string;
  halfPrice: number;
  fullPrice: number;
  outOfStock: boolean;
}

const CreateMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<MenuItem>({
    id: "",
    name: "",
    image: "",
    halfPrice: 0,
    fullPrice: 0,
    outOfStock: false,
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    setIsCreating(true);
    setNewItem({
      id: Date.now().toString(),
      name: "",
      image: "",
      halfPrice: 0,
      fullPrice: 0,
      outOfStock: false,
    });
  };

  const handleSaveItem = async () => {
    if (!newItem.name || !newItem.image || newItem.halfPrice <= 0 || newItem.fullPrice <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: newItem.name,
          image_url: newItem.image,
          half_price: newItem.halfPrice,
          full_price: newItem.fullPrice,
          out_of_stock: newItem.outOfStock,
        })
        .select()
        .single();

      if (error) throw error;

      setMenuItems([...menuItems, { ...newItem, id: data.id }]);
      setIsCreating(false);
      setNewItem({
        id: "",
        name: "",
        image: "",
        halfPrice: 0,
        fullPrice: 0,
        outOfStock: false,
      });

      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase
          .from("menu_items")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setMenuItems(menuItems.filter((item) => item.id !== id));
        toast({
          title: "Item deleted",
          description: "The menu item has been removed.",
        });
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast({
          title: "Error",
          description: "Failed to delete menu item",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateNewItem = (
    field: keyof MenuItem,
    value: string | boolean | number
  ) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Menu Management</h1>
        {!isCreating && (
          <Button onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            {menuItems.length === 0 ? "Create Menu" : "Add Item"}
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Name *
              </label>
              <Input
                value={newItem.name}
                onChange={(e) =>
                  handleUpdateNewItem("name", e.target.value)
                }
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Image *
              </label>
              <div className="flex items-center gap-4">
                {newItem.image ? (
                  <div className="relative w-20 h-20">
                    <img
                      src={newItem.image}
                      alt={newItem.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      onClick={() => handleUpdateNewItem("image", "")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <ImageUpload
                    onImageUploaded={(url) =>
                      handleUpdateNewItem("image", url)
                    }
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
                value={newItem.halfPrice}
                onChange={(e) =>
                  handleUpdateNewItem("halfPrice", Number(e.target.value))
                }
                placeholder="Enter half price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Price *
              </label>
              <Input
                type="number"
                value={newItem.fullPrice}
                onChange={(e) =>
                  handleUpdateNewItem("fullPrice", Number(e.target.value))
                }
                placeholder="Enter full price"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Switch
                checked={newItem.outOfStock}
                onCheckedChange={(checked) =>
                  handleUpdateNewItem("outOfStock", checked)
                }
              />
              <span className="text-sm text-gray-600">Out of Stock</span>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveItem}>Save Item</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {menuItems.map((item) => (
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
                <div className="text-gray-700">${item.halfPrice}</div>
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
                  onCheckedChange={(checked) =>
                    handleUpdateNewItem("outOfStock", checked)
                  }
                  disabled
                />
                <span className="text-sm text-gray-600">Out of Stock</span>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateMenu;