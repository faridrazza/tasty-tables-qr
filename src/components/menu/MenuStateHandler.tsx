import { Loader2 } from "lucide-react";

interface MenuStateHandlerProps {
  isLoading: boolean;
  itemsCount: number;
}

const MenuStateHandler = ({ isLoading, itemsCount }: MenuStateHandlerProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!itemsCount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Menu Items</h1>
          <p className="text-gray-600">This restaurant hasn't added any items yet.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default MenuStateHandler;