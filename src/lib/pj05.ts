import "server-only";

export class Pj05Error extends Error {
  constructor(
    readonly status: number,
    readonly detail?: string,
  ) {
    super(`PJ05 request failed (${status})`);
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: object;
  next?: { revalidate?: number; tags?: string[] };
};

export async function fetchPj05(
  path: string,
  { method = "GET", token, body, next }: RequestOptions = {},
) {
  const backendUrl =
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:5050" : "");
  if (!backendUrl) throw new Pj05Error(503);

  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (body) headers.set("Content-Type", "application/json");

  try {
    return await fetch(new URL(`/api/v1/${path}`, backendUrl), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...(next ? { next } : { cache: "no-store" }),
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new Pj05Error(503);
  }
}

export async function pj05Data<T>(path: string, options?: RequestOptions) {
  const response = await fetchPj05(path, options);
  const payload: {
    success?: unknown;
    data?: T;
    error?: unknown;
  } | null = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Pj05Error(
      response.status,
      typeof payload?.error === "string" ? payload.error : undefined,
    );
  }
  if (payload?.success !== true || payload.data === undefined) {
    throw new Pj05Error(502);
  }
  return payload.data;
}
