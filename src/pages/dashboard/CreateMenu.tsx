import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import MenuItemForm from "@/components/menu/MenuItemForm";
import MenuItemList from "@/components/menu/MenuItemList";
import { useNavigate } from "react-router-dom";
import { useMenuItems } from "./menu/useMenuItems";
import { useState } from "react";
import { MenuItem } from "@/types/menu";

const CreateMenu = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const {
    menuItems,
    isCreating,
    setIsCreating,
    handleAddItem,
    handleSaveItem,
    handleDeleteItem,
    handleToggleOutOfStock,
  } = useMenuItems();

  const filteredItems = menuItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      (item.category?.toLowerCase().includes(searchLower))
    );
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleSave = async (item: MenuItem) => {
    await handleSaveItem(item);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingItem(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-gray-600 mt-2">
              {menuItems.length === 0
                ? "Start by creating your first menu item"
                : `${menuItems.length} item${menuItems.length === 1 ? "" : "s"} in your menu`}
            </p>
          </div>
          {!isCreating && (
            <Button 
              onClick={handleAddItem} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              {menuItems.length === 0 ? "Create Menu" : "Add Item"}
            </Button>
          )}
        </div>
      </div>

      {menuItems.length > 0 && !isCreating && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary"
          />
        </div>
      )}

      {isCreating && (
        <MenuItemForm
          onSave={handleSave}
          onCancel={handleCancel}
          showOutOfStock={false}
          isHalfPriceOptional={true}
          initialItem={editingItem || undefined}
        />
      )}

      <MenuItemList 
        items={filteredItems}
        onDelete={handleDeleteItem}
        onToggleOutOfStock={handleToggleOutOfStock}
        onEdit={handleEdit}
      />

      {menuItems.length > 0 && !isCreating && (
        <div className="mt-8 text-center pb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/qr-code")}
            className="hover:bg-primary hover:text-white transition-colors duration-200"
          >
            View QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateMenu;