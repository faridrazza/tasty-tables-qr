export interface GSTSettingsTable {
  Row: {
    address: string
    created_at: string
    gst_number: string
    gst_rate: number
    id: string
    restaurant_id: string
    restaurant_name: string
    updated_at: string
  }
  Insert: {
    address: string
    created_at?: string
    gst_number: string
    gst_rate: number
    id?: string
    restaurant_id: string
    restaurant_name: string
    updated_at?: string
  }
  Update: {
    address?: string
    created_at?: string
    gst_number?: string
    gst_rate?: number
    id?: string
    restaurant_id?: string
    restaurant_name?: string
    updated_at?: string
  }
  Relationships: []
}