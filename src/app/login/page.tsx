import type { Metadata } from "next";
import { ScubiduPapaAuthPage } from "@/components/scubidupapa";
import { loginDestination } from "@/lib/auth-types";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login | ScubiduPapa",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    registered?: string | string[];
    next?: string | string[];
    callbackUrl?: string | string[];
  }>;
}) {
  const { registered, next, callbackUrl } = await searchParams;
  const destination = loginDestination(next ?? callbackUrl);
  const nextQuery = destination
    ? `?${new URLSearchParams({ next: destination })}`
    : "";

  return (
    <ScubiduPapaAuthPage
      mode="login"
      alternateUrl={`/register${nextQuery}`}
      notice={
        registered === "1"
          ? "Your account is ready. You can log in now."
          : undefined
      }
    >
      <LoginForm destination={destination ?? "/account"} />
    </ScubiduPapaAuthPage>
  );
}
