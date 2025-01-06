export interface OrderItemsTable {
  Row: {
    id: string
    menu_item_id: string | null
    order_id: string | null
    quantity: number
    size: string
  }
  Insert: {
    id?: string
    menu_item_id?: string | null
    order_id?: string | null
    quantity: number
    size: string
  }
  Update: {
    id?: string
    menu_item_id?: string | null
    order_id?: string | null
    quantity?: number
    size?: string
  }
  Relationships: [
    {
      foreignKeyName: "order_items_menu_item_id_fkey"
      columns: ["menu_item_id"]
      isOneToOne: false
      referencedRelation: "menu_items"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "order_items_order_id_fkey"
      columns: ["order_id"]
      isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    }
  ]
}