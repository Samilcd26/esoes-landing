import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "View photos and memories from ESOES events and activities",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
