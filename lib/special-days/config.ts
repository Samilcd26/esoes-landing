export type EffectType = 'snow' | 'confetti' | 'sparkles' | null;

export interface SpecialDayConfig {
  id: string;
  name: string;
  startDate: string; // MM-DD formatı
  endDate: string; // MM-DD formatı
  effectType: EffectType;
  priority: number; // Çakışma durumunda öncelik (düşük sayı = yüksek öncelik)
}

export const SPECIAL_DAYS: SpecialDayConfig[] = [
  {
    id: 'new-year',
    name: 'Yılbaşı',
    startDate: '12-10', // 20 Aralık
    endDate: '01-05',   // 5 Ocak
    effectType: 'snow',
    priority: 1
  },
  // Diğer özel günler buraya eklenebilir
  // Örnek:
  // {
  //   id: 'national-day',
  //   name: 'Ulusal Gün',
  //   startDate: '04-23', // 23 Nisan
  //   endDate: '04-23',   // 23 Nisan
  //   effectType: 'confetti',
  //   priority: 2
  // },
];
