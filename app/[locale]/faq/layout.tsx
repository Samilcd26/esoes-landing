import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | ESOES",
  description: "ESOES hakkında sıkça sorulan sorular ve cevapları. Üyelik, etkinlikler, gönüllülük ve daha fazlası hakkında bilgi alın.",
  keywords: ["ESOES", "FAQ", "Sıkça Sorulan Sorular", "Üyelik", "Etkinlikler", "Gönüllülük"],
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
