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