import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
