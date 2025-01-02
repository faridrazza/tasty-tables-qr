export interface MenuItem {
  id: string;
  name: string;
  image: string;
  halfPrice: number;
  fullPrice: number;
  outOfStock: boolean;
  isVegetarian?: boolean;
  category?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  size: "half" | "full";
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  size: string;
  price?: number;
  menu_item: {
    name: string;
    half_price?: number;
    full_price?: number;
  };
}