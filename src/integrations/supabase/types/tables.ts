export type GSTSettings = {
  Row: {
    address: string;
    created_at: string;
    gst_number: string;
    gst_rate: number;
    id: string;
    restaurant_id: string;
    restaurant_name: string;
    updated_at: string;
  };
  Insert: {
    address: string;
    created_at?: string;
    gst_number: string;
    gst_rate: number;
    id?: string;
    restaurant_id: string;
    restaurant_name: string;
    updated_at?: string;
  };
  Update: {
    address?: string;
    created_at?: string;
    gst_number?: string;
    gst_rate?: number;
    id?: string;
    restaurant_id?: string;
    restaurant_name?: string;
    updated_at?: string;
  };
  Relationships: [];
};

export type MenuItem = {
  Row: {
    category: string | null;
    created_at: string;
    full_price: number;
    half_price: number;
    id: string;
    image_url: string | null;
    is_vegetarian: boolean | null;
    name: string;
    out_of_stock: boolean | null;
    restaurant_id: string | null;
  };
  Insert: {
    category?: string | null;
    created_at?: string;
    full_price: number;
    half_price: number;
    id?: string;
    image_url?: string | null;
    is_vegetarian?: boolean | null;
    name: string;
    out_of_stock?: boolean | null;
    restaurant_id?: string | null;
  };
  Update: {
    category?: string | null;
    created_at?: string;
    full_price?: number;
    half_price?: number;
    id?: string;
    image_url?: string | null;
    is_vegetarian?: boolean | null;
    name?: string;
    out_of_stock?: boolean | null;
    restaurant_id?: string | null;
  };
  Relationships: [];
};

export type OrderItem = {
  Row: {
    id: string;
    menu_item_id: string | null;
    order_id: string | null;
    quantity: number;
    size: string;
  };
  Insert: {
    id?: string;
    menu_item_id?: string | null;
    order_id?: string | null;
    quantity: number;
    size: string;
  };
  Update: {
    id?: string;
    menu_item_id?: string | null;
    order_id?: string | null;
    quantity?: number;
    size?: string;
  };
  Relationships: [
    {
      foreignKeyName: "order_items_menu_item_id_fkey";
      columns: ["menu_item_id"];
      isOneToOne: false;
      referencedRelation: "menu_items";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "order_items_order_id_fkey";
      columns: ["order_id"];
      isOneToOne: false;
      referencedRelation: "orders";
      referencedColumns: ["id"];
    }
  ];
};

export type Order = {
  Row: {
    created_at: string | null;
    id: string;
    restaurant_id: string | null;
    status: string;
    table_number: number;
  };
  Insert: {
    created_at?: string | null;
    id?: string;
    restaurant_id?: string | null;
    status?: string;
    table_number: number;
  };
  Update: {
    created_at?: string | null;
    id?: string;
    restaurant_id?: string | null;
    status?: string;
    table_number?: number;
  };
  Relationships: [];
};

export type WaiterProfile = {
  Row: {
    id: string;
    name: string;
    email: string;
    restaurant_id: string;
    created_at: string;
  };
  Insert: {
    id: string;
    name: string;
    email: string;
    restaurant_id: string;
    created_at?: string;
  };
  Update: {
    name?: string;
    email?: string;
    restaurant_id?: string;
    created_at?: string;
  };
  Relationships: [];
};