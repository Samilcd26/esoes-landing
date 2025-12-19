"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SpecialDayProvider } from "@/components/providers/special-day-provider";
import TopNavbar from "@/components/layout/top-navbar";
import Footer from "@/components/layout/footer";

export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SpecialDayProvider />
        <div className="flex min-h-screen flex-col">
          <TopNavbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </QueryProvider>
  );
}

