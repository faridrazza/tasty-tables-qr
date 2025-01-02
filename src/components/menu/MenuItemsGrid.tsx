import { MenuItem as MenuItemType } from "@/types/menu";
import MenuItemComponent from "./MenuItem";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface MenuItemsGridProps {
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType, size: "half" | "full") => void;
}

const MenuItemsGrid = ({ items, onAddToCart }: MenuItemsGridProps) => {
  const [vegFilter, setVegFilter] = useState(false);
  const [nonVegFilter, setNonVegFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    // Apply veg/non-veg filters
    if (vegFilter && !nonVegFilter) {
      if (!item.isVegetarian) return false;
    } else if (!vegFilter && nonVegFilter) {
      if (item.isVegetarian) return false;
    }

    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      (item.category?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Toggle
            pressed={vegFilter}
            onPressedChange={setVegFilter}
            className="data-[state=on]:bg-green-600"
          >
            Veg
          </Toggle>
          <Toggle
            pressed={nonVegFilter}
            onPressedChange={setNonVegFilter}
            className="data-[state=on]:bg-red-600"
          >
            Non-Veg
          </Toggle>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuItemsGrid;