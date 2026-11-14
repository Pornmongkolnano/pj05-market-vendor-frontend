export type Role = "member" | "admin";

export type Viewer = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function isRole(value: unknown): value is Role {
  return value === "member" || value === "admin";
}

export function loginDestination(value: string | string[] | undefined) {
  if (typeof value !== "string" || !value.startsWith("/")) return undefined;

  const origin = "https://pj05.invalid";
  const url = URL.parse(value, origin);
  if (
    !url ||
    url.origin !== origin ||
    /^\/(?:\/|(?:login|register|api)(?:\/|$))/i.test(url.pathname)
  ) {
    return undefined;
  }
  return url.pathname + url.search;
}
