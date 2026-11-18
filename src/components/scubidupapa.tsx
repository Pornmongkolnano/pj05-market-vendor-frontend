import Link from "next/link";
import type { ReactNode } from "react";
import "./scubidupapa.css";

export function ScubiduPapaLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className="market-page">
      {children}
    </div>
  );
}

export function ScubiduPapaAuthPage({
  children,
  mode,
  alternateUrl,
  notice,
}: {
  children: ReactNode;
  mode: "register" | "login";
  alternateUrl: string;
  notice?: string;
}) {
  const isRegister = mode === "register";

  return (
    <ScubiduPapaLayout>
      <main className="market-auth-body">
        <section className="market-auth-card" aria-labelledby="auth-title">
          <h1 id="auth-title" className="market-auth-title">
            {isRegister ? "Create your account" : "Login"}
          </h1>
          {notice ? (
            <p className="market-success-notice" role="status">
              {notice}
            </p>
          ) : null}
          {children}
          <p className="market-auth-switch">
            {isRegister ? "Already have an account?" : "New to ScubiduPapa?"}{" "}
            <Link href={alternateUrl}>{isRegister ? "Login" : "Register"}</Link>
          </p>
        </section>
      </main>
    </ScubiduPapaLayout>
  );
}
