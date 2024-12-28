import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

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
  const { toast } = useToast();

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "",
      image: "",
      halfPrice: 0,
      fullPrice: 0,
      outOfStock: false,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast({
        title: "Item deleted",
        description: "The menu item has been removed.",
      });
    }
  };

  const handleUpdateItem = (
    id: string,
    field: keyof MenuItem,
    value: string | boolean | number
  ) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Menu Management</h1>
        <Button onClick={handleAddItem}>
          {menuItems.length === 0 ? "Create Menu" : "Add Item"}
        </Button>
      </div>

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
                <Input
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "name", e.target.value)
                  }
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <Input
                  value={item.image}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "image", e.target.value)
                  }
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Half Price
                </label>
                <Input
                  type="number"
                  value={item.halfPrice}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "halfPrice", Number(e.target.value))
                  }
                  placeholder="Enter half price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Price
                </label>
                <Input
                  type="number"
                  value={item.fullPrice}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "fullPrice", Number(e.target.value))
                  }
                  placeholder="Enter full price"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={item.outOfStock}
                  onCheckedChange={(checked) =>
                    handleUpdateItem(item.id, "outOfStock", checked)
                  }
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