
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
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    menuItems,
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

  const handleEdit = async (item: MenuItem) => {
    await handleSaveItem(item);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleSave = async (item: MenuItem) => {
    await handleSaveItem(item);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              {menuItems.length === 0
                ? "Start by creating your first menu item"
                : `${menuItems.length} item${menuItems.length === 1 ? "" : "s"} in your menu`}
            </p>
          </div>
          {!showAddForm && (
            <Button 
              onClick={handleAdd} 
              size="lg"
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              {menuItems.length === 0 ? "Create Menu" : "Add Item"}
            </Button>
          )}
        </div>
      </div>

      {menuItems.length > 0 && !showAddForm && (
        <div className="relative px-4 md:px-0">
          <Search className="absolute left-6 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 md:pl-10 border-gray-200 focus:border-primary focus:ring-primary"
          />
        </div>
      )}

      <div className="px-4 md:px-0">
        {showAddForm && (
          <MenuItemForm
            onSave={handleSave}
            onCancel={handleCancel}
            showOutOfStock={false}
            isHalfPriceOptional={true}
          />
        )}

        <MenuItemList 
          items={filteredItems}
          onDelete={handleDeleteItem}
          onToggleOutOfStock={handleToggleOutOfStock}
          onEdit={handleEdit}
        />

        {menuItems.length > 0 && !showAddForm && (
          <div className="mt-8 text-center pb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/qr-code")}
              className="w-full md:w-auto hover:bg-primary hover:text-white transition-colors duration-200"
            >
              View QR Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMenu;
