export type Comment = {
  id: number;
  post_id: number;
  commment_content: string;
  post_content: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_active: number;
  username: string;
  email: string;
};

export type GetCommentsResponse = {
  data: Comment[];
};
