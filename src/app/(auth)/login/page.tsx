import { LoginForm } from "./_components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  // Only same-origin paths: an absolute URL here would be an open redirect.
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  return <LoginForm callbackUrl={safeCallback} forbidden={error === "forbidden"} />;
}
