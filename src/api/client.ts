// Lightweight API client using fetch for Admin frontend
// Reads base URL from Vite env and attaches Bearer token from localStorage

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = localStorage.getItem("mm_admin_token") || localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    // credentials not needed since we are using JWT in Authorization header
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : (await res.text() as any);

  if (!res.ok) {
    const message = (isJson && (data as any)?.message)
      ? (data as any).message
      : (isJson && (data as any)?.error)
        ? (data as any).error
        : res.statusText || `Request failed with status ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data as T;
}
