
import { Button } from "@/components/ui/button";
import { MenuItem as MenuItemType } from "@/types/menu";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType, size: "half" | "full") => void;
}

const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 sm:h-48 object-cover"
      />
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base sm:text-lg font-semibold">{item.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ml-2 ${
            item.isVegetarian 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
          }`}>
            {item.isVegetarian ? "Veg" : "Non-Veg"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
          <div className="space-y-1">
            {item.halfPrice > 0 && (
              <p className="text-sm text-gray-600">Half: ₹{item.halfPrice}</p>
            )}
            <p className="text-sm text-gray-600">Full: ₹{item.fullPrice}</p>
          </div>
          {item.outOfStock ? (
            <span className="text-red-500 text-sm font-medium">Out of Stock</span>
          ) : (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {item.halfPrice > 0 && (
                <Button size="sm" className="flex-1 sm:flex-none" onClick={() => onAddToCart(item, "half")}>
                  Add Half
                </Button>
              )}
              <Button size="sm" className="flex-1 sm:flex-none" onClick={() => onAddToCart(item, "full")}>
                Add Full
              </Button>
            </div>
          )}
        </div>
        {item.category && (
          <p className="text-xs sm:text-sm text-gray-500">Category: {item.category}</p>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
