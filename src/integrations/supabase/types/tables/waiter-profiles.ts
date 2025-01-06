export interface WaiterProfilesTable {
  Row: {
    id: string
    name: string
    email: string
    restaurant_id: string
    created_at: string
  }
  Insert: {
    id?: string
    name: string
    email: string
    restaurant_id: string
    created_at?: string
  }
  Update: {
    id?: string
    name?: string
    email?: string
    restaurant_id?: string
    created_at?: string
  }
  Relationships: []
}