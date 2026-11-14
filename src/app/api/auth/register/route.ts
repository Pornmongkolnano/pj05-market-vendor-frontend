import { validateRegistration } from "@/lib/registration";

const duplicateEmailPattern =
  /\bE11000 duplicate key error\b.*\bindex: email_1\b/;

export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  if (!input || typeof input !== "object") {
    return Response.json({ success: false }, { status: 400 });
  }

  const { name, email, tel, password } = input as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof tel !== "string" ||
    typeof password !== "string"
  ) {
    return Response.json({ success: false }, { status: 400 });
  }

  const values = {
    name: name.trim(),
    email: email.trim(),
    tel: tel.trim(),
    password,
  };
  if (Object.keys(validateRegistration(values)).length > 0) {
    return Response.json({ success: false }, { status: 400 });
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:5050" : "");
  if (!backendUrl) {
    return Response.json({ success: false }, { status: 503 });
  }

  try {
    const upstream = await fetch(new URL("/api/v1/auth/register", backendUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, role: "member" }),
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
    });
    const result: { success?: unknown; error?: unknown } | null = await upstream
      .json()
      .catch(() => null);

    if (upstream.status === 201 && result?.success === true) {
      return Response.json({ success: true }, { status: 201 });
    }

    // PJ05 returns a MongoDB duplicate email error with an HTTP 500 status.
    if (
      upstream.status === 500 &&
      typeof result?.error === "string" &&
      duplicateEmailPattern.test(result.error)
    ) {
      return Response.json({ success: false }, { status: 409 });
    }

    if (upstream.status === 429) {
      return Response.json({ success: false }, { status: 429 });
    }
  } catch {
    return Response.json({ success: false }, { status: 503 });
  }

  return Response.json({ success: false }, { status: 502 });
}
