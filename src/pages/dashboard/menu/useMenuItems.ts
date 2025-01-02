import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/types/menu";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error: fetchError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", user.id);

      if (fetchError) {
        throw fetchError;
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
    } catch (err: any) {
      console.error("Error fetching menu items:", err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setIsCreating(true);
  };

  const handleSaveItem = async (newItem: MenuItem) => {
    if (!newItem.name || !newItem.image || newItem.fullPrice <= 0) {
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
          half_price: newItem.halfPrice || null,
          full_price: newItem.fullPrice,
          out_of_stock: false,
          restaurant_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setMenuItems([...menuItems, { ...newItem, id: data.id }]);
      setIsCreating(false);

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
    } catch (err: any) {
      console.error("Error saving menu item:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save menu item",
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
    } catch (err: any) {
      console.error("Error deleting menu item:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const handleToggleOutOfStock = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ out_of_stock: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, outOfStock: !currentStatus } : item
      ));

      toast({
        title: "Status Updated",
        description: `Item marked as ${!currentStatus ? 'out of stock' : 'in stock'}`,
      });
    } catch (err: any) {
      console.error("Error updating stock status:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update stock status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    isCreating,
    setIsCreating,
    handleAddItem,
    handleSaveItem,
    handleDeleteItem,
    handleToggleOutOfStock,
    isLoading,
    error,
  };
};