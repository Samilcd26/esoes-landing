"use client";

import { useCurrentUser } from "@/hooks/useAuth";
import { SideNavbar } from "./layout/side-navbar";
import TopNavbar from "./layout/top-navbar";
import Footer from "./layout/footer";
import { LoaderOne } from "@/components/ui/loader";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { useState, useEffect } from "react";
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
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Safe translation hook with fallback
  let t: any;
  try {
    t = useTranslations("common");
  } catch (error) {
    console.warn("Translation context not ready, using fallbacks");
    t = (key: string) => key; // Fallback function
  }

  useEffect(() => {
    setIsHydrated(true);
    console.log("AppContentInner: Hydration complete."); // Log hydration status
  }, []);

  console.log("AppContentInner: isHydrated =", isHydrated, ", isLoading =", isLoading); // Log state on render

  // Always render loading on the server and until hydration is complete
  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <LoaderOne />
          <p className="text-white">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  // After hydration, show loading if user is still loading
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <LoaderOne />
          <p className="text-white">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  // Only render the actual content after hydration and user fetch
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