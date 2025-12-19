import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming events and activities organized by ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
