import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ESOES Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
