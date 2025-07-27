import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure we always have a valid locale
  const validLocale = locale && locales.includes(locale as any) ? locale : 'tr';
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});