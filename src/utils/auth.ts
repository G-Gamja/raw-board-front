import { post } from "./axios";

export async function logOut() {
  const data = await post("/api/auth/log-out");

  return data;
}
