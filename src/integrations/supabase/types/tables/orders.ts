export interface OrdersTable {
  Row: {
    created_at: string | null
    id: string
    restaurant_id: string | null
    status: string
    table_number: number
  }
  Insert: {
    created_at?: string | null
    id?: string
    restaurant_id?: string | null
    status?: string
    table_number: number
  }
  Update: {
    created_at?: string | null
    id?: string
    restaurant_id?: string | null
    status?: string
    table_number?: number
  }
  Relationships: []
}