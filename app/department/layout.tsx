import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Departmanlar",
  description:
    "ESOES departmanlarını keşfedin. Çevre sürdürülebilirliği, teknoloji, organizasyon ve diğer departmanlarımız hakkında bilgi edinin ve departman sorumlularımızla iletişime geçin.",
  path: "/department",
  keywords: [
    "departmanlar",
    "departments",
    "ESOES departmanları",
    "topluluk yapısı",
    "community structure",
    "organizasyon",
    "organization",
  ],
});

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
