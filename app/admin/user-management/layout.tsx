import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage ESOES users",
};

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
