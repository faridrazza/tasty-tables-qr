import { GSTSettingsTable } from "./tables/gst-settings"
import { MenuItemsTable } from "./tables/menu-items"
import { OrderItemsTable } from "./tables/order-items"
import { OrdersTable } from "./tables/orders"
import { WaiterProfilesTable } from "./tables/waiter-profiles"

export interface Database {
  public: {
    Tables: {
      gst_settings: GSTSettingsTable
      menu_items: MenuItemsTable
      order_items: OrderItemsTable
      orders: OrdersTable
      waiter_profiles: WaiterProfilesTable
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']