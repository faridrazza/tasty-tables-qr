import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MenuItemForm from "./MenuItemForm";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  name: string;
  image: string;
  halfPrice: number;
  fullPrice: number;
  outOfStock: boolean;
}

interface MenuCreationPanelProps {
  menuItems: MenuItem[];
  onItemAdded: (item: MenuItem) => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
}

const MenuCreationPanel = ({ 
  menuItems, 
  onItemAdded, 
  isCreating, 
  setIsCreating 
}: MenuCreationPanelProps) => {
  const [newItem, setNewItem] = useState<MenuItem>({
    id: "",
    name: "",
    image: "",
    halfPrice: 0,
    fullPrice: 0,
    outOfStock: false,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveItem = async () => {
    if (!newItem.name || !newItem.halfPrice || !newItem.fullPrice) {
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

      const savedItem = {
        ...newItem,
        id: data.id,
      };

      onItemAdded(savedItem);
      setIsCreating(false);
      setNewItem({
        id: "",
        name: "",
        image: "",
        halfPrice: 0,
        fullPrice: 0,
        outOfStock: false,
      });

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

  const handleUpdateNewItem = (
    field: keyof MenuItem,
    value: string | boolean | number
  ) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  return isCreating ? (
    <MenuItemForm
      item={newItem}
      onUpdate={handleUpdateNewItem}
      onSave={handleSaveItem}
      onCancel={() => setIsCreating(false)}
    />
  ) : null;
};

export default MenuCreationPanel;