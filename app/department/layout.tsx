import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore the different departments of ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
