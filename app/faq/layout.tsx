import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ESOES - Engineering Students Organization for Environmental Sustainability",
  keywords: ["ESOES", "FAQ", "questions", "answers", "engineering", "students", "organization"],
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
