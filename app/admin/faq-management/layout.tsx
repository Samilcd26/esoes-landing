import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Management",
  description: "Manage ESOES FAQ",
};

export default function FaqManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
