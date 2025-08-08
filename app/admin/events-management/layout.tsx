import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Management",
  description: "Manage ESOES events",
};

export default function EventsManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
