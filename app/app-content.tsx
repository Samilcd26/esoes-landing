"use client";

import TopNavbar from "./layout/top-navbar";
import Footer from "./layout/footer";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
  // Render appropriate layout based on user authentication
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopNavbar />
      </div>
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}