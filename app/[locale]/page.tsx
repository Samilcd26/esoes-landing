"use client";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { LoaderOne } from "@/components/ui/loader";
import { useTranslations } from "next-intl";

export default function RootPage() {
  const { data: user, isLoading } = useCurrentUser();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("common");
  const locale = params.locale as string;

  useEffect(() => {
    if (!isLoading) {
      const targetPath = user ? `/${locale}/admin` : `/${locale}/home`;
      router.push(targetPath);
    }
  }, [user, isLoading, locale, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <LoaderOne />
        <p className="text-white">{t("loading")}</p>
      </div>
    </div>
  );
} 