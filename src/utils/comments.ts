import { deleteCall, get, post } from "./axios";

import { GetCommentsResponse } from "@/types/comments";

export async function writeComment(post_id: number, content: string) {
  const data = await post("/api/comments", {
    post_id,
    content,
  });

  return data;
}

export async function getComments(post_id: number, isDesc?: boolean) {
  const data = (await get(
    `http://www.localhost/api/comments?post_id=${post_id}${
      isDesc ? `&isDesc=${isDesc}` : ""
    }
    `
  )) as GetCommentsResponse;

  return data.data;
}

export async function deleteCommentById(id: number) {
  const data = await deleteCall(`/api/comments/id/${id}`);

  return data;
}
