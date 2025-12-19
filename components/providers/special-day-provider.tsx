"use client";

import { useSpecialDay } from "@/hooks/useSpecialDay";
import { SnowEffect } from "@/components/ui/special-day-effects/snow-effect";
import { ConfettiEffect } from "@/components/ui/special-day-effects/confetti-effect";

/**
 * Özel günler için otomatik efekt provider'ı
 * Tarih kontrolü yaparak uygun efekti render eder
 */
export function SpecialDayProvider() {
  const activeDay = useSpecialDay();

  if (!activeDay || !activeDay.effectType) {
    return null;
  }

  // Efekt tipine göre uygun komponenti render et
  switch (activeDay.effectType) {
    case "snow":
      return <SnowEffect intensity="medium" />;
    case "confetti":
      return <ConfettiEffect intensity="medium" />;
    case "sparkles":
      // Sparkles efekti için mevcut SparklesCore komponenti kullanılabilir
      // Şimdilik null döndürüyoruz, gerekirse eklenebilir
      return null;
    default:
      return null;
  }
}
