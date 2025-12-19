import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse through our gallery of events, workshops, and activities organized by ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
