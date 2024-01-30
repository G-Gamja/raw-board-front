export type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_active: number;
  username: string;
  email: string;
};

export type GetPostsResponse = {
  data: Post[];
};
