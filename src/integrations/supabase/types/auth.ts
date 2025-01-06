export interface WaiterUser {
  id: string;
  name: string;
  email: string;
  role: 'waiter' | 'admin';
  restaurant_id: string;
}

export interface AuthUser extends WaiterUser {
  created_at: string;
}