"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to /home
    router.replace('/home');
  }, [router]);

  return (
    <LoadingSpinner 
      title="Yükleniyor..."
      subtitle="Ana sayfaya yönlendiriliyorsunuz"
      className="min-h-[60vh]"
    />
  );
}
