import { getViewer } from "@/lib/auth";
import { isRole } from "@/lib/auth-types";
import { fetchPj05 } from "@/lib/pj05";
import { validateRegistration } from "@/lib/registration";

const duplicateEmailPattern =
  /\bE11000 duplicate key error\b.*\bindex: email_1\b/;

export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  if (!input || typeof input !== "object") {
    return Response.json({ success: false }, { status: 400 });
  }

  const { name, email, tel, password, role = "member" } = input as Record<
    string,
    unknown
  >;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof tel !== "string" ||
    typeof password !== "string" ||
    !isRole(role)
  ) {
    return Response.json({ success: false }, { status: 400 });
  }

  const values = {
    name: name.trim(),
    email: email.trim(),
    tel: tel.trim(),
    role,
    password,
  };
  if (Object.keys(validateRegistration(values)).length > 0) {
    return Response.json({ success: false }, { status: 400 });
  }

  try {
    let token: string | undefined;
    if (role === "admin") {
      const contentType = request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase();
      if (contentType !== "application/json") {
        return Response.json({ success: false }, { status: 415 });
      }
      const account = await getViewer();
      if (account?.viewer.role !== "admin") {
        return Response.json(
          { success: false },
          { status: account ? 403 : 401 },
        );
      }
      token = account.backendToken;
    }

    const path = role === "admin" ? "auth/register/admin" : "auth/register";
    const upstream = await fetchPj05(path, {
      method: "POST",
      token,
      body: values,
    });
    const result: {
      success?: unknown;
      error?: unknown;
      data?: { role?: unknown } | null;
    } | null = await upstream.json().catch(() => null);

    if (
      upstream.status === 201 &&
      result?.success === true &&
      result.data?.role === role
    ) {
      return Response.json({ success: true }, { status: 201 });
    }

    // The course starter reports its duplicate email error as HTTP 500.
    if (
      upstream.status === 409 ||
      (upstream.status === 500 &&
        typeof result?.error === "string" &&
        duplicateEmailPattern.test(result.error))
    ) {
      return Response.json({ success: false }, { status: 409 });
    }

    if ([400, 401, 403, 429, 503].includes(upstream.status)) {
      return Response.json({ success: false }, { status: upstream.status });
    }
  } catch {
    return Response.json({ success: false }, { status: 503 });
  }

  return Response.json({ success: false }, { status: 502 });
}
