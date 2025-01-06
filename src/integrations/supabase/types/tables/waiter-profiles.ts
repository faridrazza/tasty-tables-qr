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
  Relationships: [
    {
      foreignKeyName: "waiter_profiles_id_fkey"
      columns: ["id"]
      isOneToOne: true
      referencedRelation: "users"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "waiter_profiles_restaurant_id_fkey"
      columns: ["restaurant_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}