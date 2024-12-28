import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MenuItemForm from "@/components/menu/MenuItemForm";
import MenuItemList from "@/components/menu/MenuItemList";

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
        <MenuItemForm
          item={newItem}
          onUpdate={handleUpdateNewItem}
          onSave={handleSaveItem}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <MenuItemList items={menuItems} onDelete={handleDeleteItem} />
    </div>
  );
};

export default CreateMenu;