"use client";

import { MotionCalendar } from "@/components/ui/motion-calendar";
import { useSanityCalendarEventsForCalendar } from "@/hooks/useSanityCalendarEvents";
import { CalendarEvents } from "@/lib/types/api";
import type { MotionCalendarEvent } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Calendar events'i MotionCalendar formatına çevir
const calendarEventsToMotionEvents = (events: CalendarEvents[], locale: string): MotionCalendarEvent[] => {
  return events.map(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // Generate consistent color based on event ID
    const EVENT_COLORS = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", 
      "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500", 
      "bg-orange-500", "bg-cyan-500"
    ];
    const colorIndex = event._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % EVENT_COLORS.length;
    const color = EVENT_COLORS[colorIndex];
    
    return {
      id: event._id,
      title: event.title,
      date: startDate,
      endDate: endDate,
      time: startDate.toLocaleTimeString(locale || 'tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }),
      color: color,
      description: event.description,
      location: event.location,
      capacity: event.capacity,
      registeredCount: event.registeredCount,
      organizer: event.organizer,
      // Medya içerikleri şimdilik boş, çünkü CalendarEvents'te mediaResources yok
      // Eğer CalendarEvents'e mediaResources eklenecekse buraya eklenebilir
      mediaResources: []
    };
  });
};

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const locale = useLocale();
  // Fetch calendar events for calendar display
  const { 
    data: calendarEvents, 
    isLoading: calendarLoading, 
    error: calendarError 
  } = useSanityCalendarEventsForCalendar();


  

  // Convert calendar events to MotionCalendar format
  const motionEvents = calendarEvents ? calendarEventsToMotionEvents(calendarEvents, locale) : [];
  console.log(motionEvents);

  // Show loading state
  if (calendarLoading) {
    return (
      <LoadingSpinner 
      title={t('loading.title')}
      subtitle={t('loading.subtitle')}
      className="min-h-[60vh]"
    />

    );
  }

  // Show error state
  if (calendarError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('errors.title')}</h1>
          <p className="text-red-400">{t('errors.message')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pt-24">
        {/* Calendar Section */}
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  {t('title')}
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {t('subtitle')}
                </p>
            </div>
            
            <MotionCalendar events={motionEvents} />
        </div>
    </div>
  );
}
