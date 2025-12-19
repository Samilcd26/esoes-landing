import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "HSD - Huawei Student Developers",
  description:
    "HSD (Huawei Student Developers) - ESOES bünyesinde yer alan Huawei öğrenci geliştiricileri topluluğu. Teknoloji, yazılım geliştirme ve inovasyon konularında çalışmalar yürütüyoruz.",
  path: "/hsd",
  keywords: [
    "HSD",
    "Huawei Student Developers",
    "Huawei öğrenci geliştiricileri",
    "yazılım geliştirme",
    "software development",
    "teknoloji topluluğu",
    "technology community",
  ],
});

export default function HsdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
