import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuHeaderProps {
  itemCount: number;
  onAddItem: () => void;
  isCreating: boolean;
}

const MenuHeader = ({ itemCount, onAddItem, isCreating }: MenuHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Menu Management</h1>
        <p className="text-gray-600 mt-1">
          {itemCount === 0
            ? "Start by creating your first menu item"
            : `${itemCount} item${itemCount === 1 ? "" : "s"} in your menu`}
        </p>
      </div>
      {!isCreating && (
        <Button onClick={onAddItem} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          {itemCount === 0 ? "Create Menu" : "Add Item"}
        </Button>
      )}
    </div>
  );
};

export default MenuHeader;