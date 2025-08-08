"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderOne } from "@/components/ui/loader";
import { useTranslations } from "next-intl";

export default function RootPage() {
  const t = useTranslations("common");
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to /home
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <LoaderOne />
        <p className="text-white">{t("loading")}</p>
      </div>
    </div>
  );
} 