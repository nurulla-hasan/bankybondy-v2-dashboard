import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const locale =
    cookieLocale && hasLocale(routing.locales, cookieLocale)
      ? cookieLocale
      : routing.defaultLocale;

  return {
    locale,
    messages: {
      Common: (await import(`../../messages/${locale}/common.json`)).default,
      Nav: (await import(`../../messages/${locale}/nav.json`)).default,
      Auth: (await import(`../../messages/${locale}/auth.json`)).default,
      Dashboard: (await import(`../../messages/${locale}/dashboard.json`))
        .default,
    },
  };
});
