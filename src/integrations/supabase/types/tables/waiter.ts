export type WaiterProfile = {
  Row: {
    id: string;
    name: string;
    email: string;
    restaurant_id: string;
    created_at: string;
  };
  Insert: {
    id: string;
    name: string;
    email: string;
    restaurant_id: string;
    created_at?: string;
  };
  Update: {
    name?: string;
    email?: string;
    restaurant_id?: string;
    created_at?: string;
  };
  Relationships: [];
};

export type WaiterProfileRow = WaiterProfile['Row'];