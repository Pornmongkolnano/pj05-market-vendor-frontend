import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "./logout-button";
import "./scubidupapa.css";

const bodyFont = DM_Sans({
  axes: ["opsz"],
  subsets: ["latin"],
  variable: "--font-market-body",
});

const headingFont = Cormorant_Garamond({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-market-heading",
});

const guestLinks = [
  { href: "/spots", label: "Explore spots" },
  { href: "/bookings", label: "My bookings" },
];

const adminLinks = [
  { href: "/admin/spots", label: "Manage spots" },
  { href: "/admin/bookings", label: "Manage bookings" },
  { href: "/admin/dashboard", label: "Dashboard" },
];

const menuSignOut = {
  idle: "Log out",
  busy: "Logging out…",
  failed: "We couldn't log you out. Please try again.",
};

type AuthNavigation = {
  current: "register" | "login";
  registerUrl: string;
  loginUrl: string;
};

type Navigation = AuthNavigation | { current: "dashboard"; adminName: string };

function Wordmark() {
  return (
    <Link
      href="/"
      className="market-wordmark"
      aria-label="ScubiduPapa Night Market home"
    >
      <span className="market-brand">ScubiduPapa</span>
      <span className="market-tagline">NIGHT MARKET</span>
    </Link>
  );
}

export function ScubiduPapaLayout({
  children,
  navigation,
}: {
  children: ReactNode;
  navigation: Navigation;
}) {
  const links = navigation.current === "dashboard" ? adminLinks : guestLinks;

  return (
    <div
      lang="en"
      data-scubidupapa-page=""
      className={`market-page ${bodyFont.variable} ${headingFont.variable}`}
    >
      <header className="market-header">
        <nav className="market-navigation" aria-label="Main menu">
          <Wordmark />
          <div className="market-navigation-links">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === "/admin/dashboard" ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
          {navigation.current === "dashboard" ? (
            <details className="market-account-menu">
              <summary>
                <span className="market-account-name">
                  Hello, {navigation.adminName}
                </span>
                <span aria-hidden="true">▾</span>
              </summary>
              <div className="market-account-dropdown">
                <Link href="/account" className="market-account-action">
                  My account
                </Link>
                <LogoutButton
                  className="market-account-action"
                  labels={menuSignOut}
                />
              </div>
            </details>
          ) : (
            <div className="market-auth-navigation">
              <Link
                href={navigation.registerUrl}
                aria-current={
                  navigation.current === "register" ? "page" : undefined
                }
              >
                Register
              </Link>
              <Link
                href={navigation.loginUrl}
                aria-current={
                  navigation.current === "login" ? "page" : undefined
                }
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </header>
      {children}
      <footer className="market-footer">
        <div className="market-footer-inner">
          <Wordmark />
          <p>Contact the market</p>
        </div>
      </footer>
    </div>
  );
}

export function ScubiduPapaAuthPage({
  children,
  navigation,
  notice,
}: {
  children: ReactNode;
  navigation: AuthNavigation;
  notice?: string;
}) {
  const isRegister = navigation.current === "register";

  return (
    <ScubiduPapaLayout navigation={navigation}>
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
            <Link
              href={isRegister ? navigation.loginUrl : navigation.registerUrl}
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        </section>
      </main>
    </ScubiduPapaLayout>
  );
}
