import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department Management",
  description: "Manage ESOES departments",
};

export default function DepartmentManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
