export interface MenuItemsTable {
  Row: {
    category: string | null
    created_at: string
    full_price: number
    half_price: number
    id: string
    image_url: string | null
    is_vegetarian: boolean | null
    name: string
    out_of_stock: boolean | null
    restaurant_id: string | null
  }
  Insert: {
    category?: string | null
    created_at?: string
    full_price: number
    half_price: number
    id?: string
    image_url?: string | null
    is_vegetarian?: boolean | null
    name: string
    out_of_stock?: boolean | null
    restaurant_id?: string | null
  }
  Update: {
    category?: string | null
    created_at?: string
    full_price?: number
    half_price?: number
    id?: string
    image_url?: string | null
    is_vegetarian?: boolean | null
    name?: string
    out_of_stock?: boolean | null
    restaurant_id?: string | null
  }
  Relationships: []
}