import { MenuItem as MenuItemType } from "@/types/menu";
import MenuItemComponent from "./MenuItem";

interface MenuItemsGridProps {
  items: MenuItemType[];
  onAddToCart: (item: MenuItemType, size: "half" | "full") => void;
}

const MenuItemsGrid = ({ items, onAddToCart }: MenuItemsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
      {items.map((item) => (
        <MenuItemComponent
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default MenuItemsGrid;