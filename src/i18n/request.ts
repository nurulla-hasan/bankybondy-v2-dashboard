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
      Users: (await import(`../../messages/${locale}/users.json`)).default,
      Admins: (await import(`../../messages/${locale}/admins.json`)).default,
      Skills: (await import(`../../messages/${locale}/skills.json`)).default,
      Topics: (await import(`../../messages/${locale}/topics.json`)).default,
      Reports: (await import(`../../messages/${locale}/reports.json`)).default,
      Income: (await import(`../../messages/${locale}/income.json`)).default,
      Donors: (await import(`../../messages/${locale}/donors.json`)).default,
      AudioModeration: (
        await import(`../../messages/${locale}/audio-moderation.json`)
      ).default,
      HeatMap: (await import(`../../messages/${locale}/heat-map.json`)).default,
    },
  };
});
