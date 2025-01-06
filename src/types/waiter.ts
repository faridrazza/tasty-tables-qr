export interface WaiterProfile {
  id: string;
  name: string;
  email: string;
  restaurant_id: string;
  created_at: string;
}

export type WaiterFormData = {
  name: string;
  email: string;
  password: string;
};