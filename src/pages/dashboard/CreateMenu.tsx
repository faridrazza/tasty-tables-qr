import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MenuItemForm from "@/components/menu/MenuItemForm";
import MenuItemList from "@/components/menu/MenuItemList";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to access your menu",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", user.id);

      if (error) {
        console.error("Error fetching menu items:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
        return;
      }

      setMenuItems(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image_url || "",
          halfPrice: item.half_price,
          fullPrice: item.full_price,
          outOfStock: item.out_of_stock || false,
        }))
      );
    };

    fetchMenuItems();
  }, [navigate, toast]);

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create menu items",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: newItem.name,
          image_url: newItem.image,
          half_price: newItem.halfPrice,
          full_price: newItem.fullPrice,
          out_of_stock: newItem.outOfStock,
          restaurant_id: user.id,
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

      // If this is the first menu item, navigate to QR code page
      if (menuItems.length === 0) {
        toast({
          title: "Success",
          description: "First menu item added! Redirecting to QR code section...",
        });
        setTimeout(() => navigate("/dashboard/qr-code"), 2000);
      } else {
        toast({
          title: "Success",
          description: "Menu item added successfully",
        });
      }
    } catch (error: any) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

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
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNewItem = (
    field: keyof MenuItem,
    value: string | boolean | number
  ) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Menu Management</h1>
          <p className="text-gray-600 mt-1">
            {menuItems.length === 0
              ? "Start by creating your first menu item"
              : `${menuItems.length} item${menuItems.length === 1 ? "" : "s"} in your menu`}
          </p>
        </div>
        {!isCreating && (
          <Button onClick={handleAddItem} size="lg">
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

      {menuItems.length > 0 && !isCreating && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/qr-code")}
          >
            View QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateMenu;