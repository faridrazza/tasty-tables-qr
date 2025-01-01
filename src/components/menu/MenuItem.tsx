import { Button } from "@/components/ui/button";
import { MenuItem as MenuItemType } from "@/types/menu";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType, size: "half" | "full") => void;
}

const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            {item.halfPrice > 0 && (
              <p className="text-sm text-gray-600">Half: ₹{item.halfPrice}</p>
            )}
            <p className="text-sm text-gray-600">Full: ₹{item.fullPrice}</p>
          </div>
          {item.outOfStock ? (
            <span className="text-red-500 font-medium">Out of Stock</span>
          ) : (
            <div className="space-x-2">
              {item.halfPrice > 0 && (
                <Button size="sm" onClick={() => onAddToCart(item, "half")}>
                  Add Half
                </Button>
              )}
              <Button size="sm" onClick={() => onAddToCart(item, "full")}>
                Add Full
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;