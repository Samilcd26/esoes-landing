import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to ESOES - Engineering Students Organization for Environmental Sustainability",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
