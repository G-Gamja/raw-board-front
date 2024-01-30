import { GetPostsResponse } from "@/types/post";
import { User } from "@/types/user";
import { get } from "./axios";

export async function getUser() {
  const data = await get<User[]>(`http://www.localhost/api/user`);

  return data;
}
