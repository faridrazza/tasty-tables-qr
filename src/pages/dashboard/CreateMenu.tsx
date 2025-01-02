import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MenuItemForm from "@/components/menu/MenuItemForm";
import MenuItemList from "@/components/menu/MenuItemList";
import { useNavigate } from "react-router-dom";
import { useMenuItems } from "./menu/useMenuItems";

const CreateMenu = () => {
  useRequireAuth();
  const navigate = useNavigate();
  const {
    menuItems,
    isCreating,
    setIsCreating,
    handleAddItem,
    handleSaveItem,
    handleDeleteItem,
    handleToggleOutOfStock,
  } = useMenuItems();

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

      {isCreating && (
        <MenuItemForm
          onSave={handleSaveItem}
          onCancel={() => setIsCreating(false)}
          showOutOfStock={false}
          isHalfPriceOptional={true}
        />
      )}

      <MenuItemList 
        items={menuItems} 
        onDelete={handleDeleteItem}
        onToggleOutOfStock={handleToggleOutOfStock}
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