import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Takvim",
  description:
    "ESOES etkinlik takvimi. Yaklaşan etkinliklerimizi, workshoplarımızı ve aktivitelerimizi tarih bazında görüntüleyin. Etkinliklere kayıt olun ve bize katılın.",
  path: "/calendar",
  keywords: [
    "etkinlik takvimi",
    "event calendar",
    "yaklaşan etkinlikler",
    "upcoming events",
    "etkinlik kaydı",
    "event registration",
  ],
});

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
