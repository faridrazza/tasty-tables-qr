import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MenuItemList from "@/components/menu/MenuItemList";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuCreationPanel from "@/components/menu/MenuCreationPanel";
import { useRequireAuth } from "@/hooks/useRequireAuth";

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
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Ensure user is authenticated
  useRequireAuth();

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
  }, [toast]);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <MenuHeader
        itemCount={menuItems.length}
        onAddItem={() => setIsCreating(true)}
        isCreating={isCreating}
      />

      <MenuCreationPanel
        menuItems={menuItems}
        onItemAdded={(item) => setMenuItems([...menuItems, item])}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
      />

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