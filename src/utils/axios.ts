import type { AxiosError, AxiosRequestConfig } from "axios";

import axios from "axios";

export async function get<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await axios.get<T>(path, {
    ...config,
  });
  return data;
}

export async function deleteCall<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await axios.delete<T>(path, {
    ...config,
  });
  return data;
}

export async function update<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await axios.put<T>(path, body);
  return data;
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await axios.post<T>(path, body);
  return data;
}

export function isAxiosError(e: any): e is AxiosError {
  return typeof e?.response?.status === "number";
}
