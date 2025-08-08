import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently Asked Questions about ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
