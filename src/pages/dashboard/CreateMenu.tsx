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