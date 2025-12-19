"use client";

import { useMemo } from "react";
import { SPECIAL_DAYS, type SpecialDayConfig, type EffectType } from "@/lib/special-days/config";

interface ActiveSpecialDay {
  config: SpecialDayConfig;
  effectType: EffectType;
}

/**
 * Mevcut tarihin özel gün aralığında olup olmadığını kontrol eder
 * ve aktif özel günü döndürür
 */
export function useSpecialDay(): ActiveSpecialDay | null {
  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();

    // Aktif özel günleri bul
    const activeDays: Array<{ config: SpecialDayConfig; priority: number }> = [];

    for (const dayConfig of SPECIAL_DAYS) {
      if (!dayConfig.effectType) continue;

      const [startMonth, startDay] = dayConfig.startDate.split("-").map(Number);
      const [endMonth, endDay] = dayConfig.endDate.split("-").map(Number);

      let isActive = false;

      // Yılbaşı gibi yıl geçişi durumları için özel kontrol
      if (startMonth > endMonth) {
        // Yıl geçişi (örn: 12-20 ile 01-05)
        // Başlangıç tarihinden yıl sonuna kadar veya yıl başından bitiş tarihine kadar
        if (
          (currentMonth === startMonth && currentDay >= startDay) ||
          (currentMonth > startMonth) ||
          (currentMonth === endMonth && currentDay <= endDay) ||
          (currentMonth < endMonth)
        ) {
          isActive = true;
        }
      } else {
        // Normal aralık (aynı yıl içinde)
        const startDate = new Date(currentYear, startMonth - 1, startDay);
        const endDate = new Date(currentYear, endMonth - 1, endDay);
        const currentDate = new Date(currentYear, currentMonth - 1, currentDay);

        if (currentDate >= startDate && currentDate <= endDate) {
          isActive = true;
        }
      }

      if (isActive) {
        activeDays.push({
          config: dayConfig,
          priority: dayConfig.priority,
        });
      }
    }

    // Önceliğe göre sırala (düşük sayı = yüksek öncelik)
    activeDays.sort((a, b) => a.priority - b.priority);

    // En yüksek öncelikli aktif günü döndür
    if (activeDays.length > 0) {
      return {
        config: activeDays[0].config,
        effectType: activeDays[0].config.effectType,
      };
    }

    return null;
  }, []);
}
