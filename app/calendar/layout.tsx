import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Discover upcoming events and activities organized by ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
