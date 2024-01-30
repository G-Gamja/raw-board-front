import { GetPostsResponse, Post } from "@/types/post";
import { deleteCall, get, post, update } from "./axios";

export async function getPosts(
  page: number,
  perPage?: number,
  isDesc?: boolean,
  keyword?: string
) {
  const data = (await get(
    `http://www.localhost/api/posts?page=${page}${
      perPage ? `&perPage=${perPage}` : ""
    }${isDesc ? `&isDesc=${isDesc}` : ""}
    ${keyword ? `&keyword=${keyword}` : ""}
    `
  )) as GetPostsResponse;

  return data.data;
}

export async function getPostById(id: number) {
  const data = (await get(`http://www.localhost/api/posts/id/${id}`)) as Post;

  return data;
}

export async function getMyPosts() {
  const data = (await get(
    `http://www.localhost/api/posts/my`
  )) as GetPostsResponse;

  return data;
}

export async function deletePostById(id: number) {
  const data = await deleteCall(`/api/posts/id/${id}`);

  return data;
}

export async function updatePostById(
  id: number,
  title: string,
  content: string
) {
  const data = await update(`/api/posts/id/${id}`, {
    title,
    content,
  });

  return data;
}

export async function writePost(title: string, content: string) {
  const data = await post("/api/posts", {
    title,
    content,
  });

  return data;
}
