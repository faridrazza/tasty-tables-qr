export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      gst_settings: {
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
      menu_items: {
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
      order_items: {
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
      orders: {
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
      waiter_profiles: {
        Row: {
          id: string
          name: string
          email: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
