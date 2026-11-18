import type { Metadata } from "next";
import { ScubiduPapaAuthPage } from "@/components/scubidupapa";
import { loginDestination } from "@/lib/auth-types";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Register | ScubiduPapa",
};

export default async function RegisterPage({
  searchParams,
}: PageProps<"/register">) {
  const destination = loginDestination((await searchParams).next);
  const nextQuery = destination
    ? `?${new URLSearchParams({ next: destination })}`
    : "";
  const successParams = new URLSearchParams({ registered: "1" });
  if (destination) successParams.set("next", destination);

  return (
    <ScubiduPapaAuthPage
      mode="register"
      alternateUrl={`/login${nextQuery}`}
    >
      <RegisterForm successUrl={`/login?${successParams}`} />
    </ScubiduPapaAuthPage>
  );
}
