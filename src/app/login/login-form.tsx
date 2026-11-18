"use client";

import { signIn } from "next-auth/react";
import { type SubmitEvent, useState } from "react";

const unavailable = "Login is temporarily unavailable. Please try again.";

export default function LoginForm({ destination }: { destination: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const data = new FormData(event.currentTarget);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        email: data.get("email"),
        password: data.get("password"),
        redirect: false,
        callbackUrl: destination,
      });

      if (response?.ok && !response.error) {
        window.location.replace(destination);
        return;
      }

      if (response?.error === "CredentialsSignin") {
        setError("The email address or password is incorrect.");
      } else if (response?.error === "RateLimited") {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(unavailable);
      }
    } catch {
      setError(unavailable);
    }
    setIsSubmitting(false);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="market-auth-form">
      <div className="market-fields">
        <div className="market-field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            required
            readOnly={isSubmitting}
            className="market-control"
          />
        </div>
        <div className="market-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            readOnly={isSubmitting}
            className="market-control"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="market-primary-action"
      >
        {isSubmitting ? "Logging in…" : "Login"}
      </button>
      <div role="status">
        {error ? <p className="market-error-notice">{error}</p> : null}
      </div>
    </form>
  );
}
