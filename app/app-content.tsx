"use client";

import { useCurrentUser } from "@/hooks/useAuth";
import { SideNavbar } from "./layout/side-navbar";
import TopNavbar from "./layout/top-navbar";
import Footer from "./layout/footer";
import { LoaderOne } from "@/components/ui/loader";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { useTranslations } from "next-intl";

export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AppContentInner>{children}</AppContentInner>
      </QueryProvider>
    </ThemeProvider>
  );
}

function AppContentInner({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const t = useTranslations("common");

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <LoaderOne />
          <p className="text-white">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Render appropriate layout based on user authentication
  return user ? (
    <SideNavbar>{children}</SideNavbar>
  ) : (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavbar />
      </div>
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}