export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_active: number;
};
