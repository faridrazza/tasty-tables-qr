export interface MenuItem {
  id: string;
  name: string;
  image: string;
  halfPrice: number;
  fullPrice: number;
  outOfStock: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  size: "half" | "full";
}