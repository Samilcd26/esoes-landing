"use client";

import { LoaderOne } from "@/components/ui/loader";
import { useTranslations } from "next-intl";

export default function RootPage() {
  const t = useTranslations("common");


  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <LoaderOne />
        <p className="text-white">{t("loading")}</p>
      </div>
    </div>
  );
} 