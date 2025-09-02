"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RootPage() {
  const t = useTranslations("common");
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to /home
    router.replace('/home');
  }, [router]);

  return (
    <LoadingSpinner 
    title={t('loading.title')}
    subtitle={t('loading.subtitle')}
    className="min-h-[60vh]"
  />
  );
} 