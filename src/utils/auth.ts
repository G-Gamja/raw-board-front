import { deleteCall, post } from "./axios";

export async function register(
  email: string,
  username: string,
  password: string
) {
  const data = await post("/api/auth/register", { email, username, password });

  return data;
}

export async function logOut() {
  const data = await post("/api/auth/log-out");

  return data;
}

export async function withdrawMembership() {
  const data = await deleteCall("/api/auth/withdraw-membership");

  return data;
}
