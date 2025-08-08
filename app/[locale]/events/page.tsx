"use client";

import { MotionCalendar } from "@/components/ui/motion-calendar";
import { useCalendarEvents } from "@/hooks/useEvents";
import { apiEventsToMotionEvents, MotionCalendarEvent } from "@/lib/utils";
import { LoaderOne } from "@/components/ui/loader";
import EventsSection from "@/components/ui/events-section";
import { useTranslations } from "next-intl";

interface TranslationEvent {
  id: string;
  title: string;
  description: string;
}

// Events objesi - Translation'dan alınacak ve images eklenecek
const getEventsData = () => {
  const events = [
    {
      id: "hebocon",
      images: [
        "/assets/images/events/hebocon-1.jpg",
        "/assets/images/events/hebocon-2.jpg",
      ]
    },
    {
      id: "summit-of-future",
      images: [
        "/assets/images/events/summit-1.jpg",
      ]
    },
    {
      id: "game-jam",
      images: [
        "/assets/images/events/gamejam-1.jpg",
        "/assets/images/events/gamejam-2.jpg"
      ]
    },
    {
      id: "technical-trip",
      images: [
        "/assets/images/events/technical-1.jpg",
      ]
    },
    {
      id: "estalks",
      images: [
        "/assets/images/events/estalks-1.gif",
        "/assets/images/events/estalks-2.jpg"
      ]
    },
    {
      id: "social-responsibility",
      images: [
        "/assets/images/events/social-1.jpg",
      ]
    },
    {
      id: "education-workshop",
      images: [
        "/assets/images/events/workshop-1.gif",
        "/assets/images/events/workshop-2.jpg",
      ]
    }
  ];
  
  return events;
};




export default function EventsPage() {
  const t = useTranslations("events");
  
  // Fetch calendar events from Supabase
  const { data: calendarEvents, isLoading, error } = useCalendarEvents();

  // Convert API events to MotionCalendar format
  const motionEvents = calendarEvents ? apiEventsToMotionEvents(calendarEvents) : [];

  // Get events from translation and combine with images
  const eventsData = t.raw("events").map((event: TranslationEvent) => {
    const imageData = getEventsData().find(img => img.id === event.id);
    return {
      ...event,
      images: imageData?.images || []
    };
  });

  const handleDateSelect = (date: Date) => {
    console.log("Seçilen tarih:", date);
  };

  const handleEventClick = (event: MotionCalendarEvent) => {
    console.log("Seçilen etkinlik:", event);
    // Etkinlik detaylarını göster
    alert(`Etkinlik: ${event.title}\nTarih: ${event.date.toLocaleDateString('tr-TR')}\nSaat: ${event.time}\nAçıklama: ${event.description || 'Açıklama yok'}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Bir Hata Oluştu</h1>
          <p className="text-red-400">Lütfen daha sonra tekrar deneyin.</p>
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
                Etkinlik
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    {" "}Takvimi
                </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Yaklaşan etkinliklerimizi takip edin ve katılım sağlayın
                </p>
            </div>
            
                <MotionCalendar
                events={motionEvents}
                onDateSelect={handleDateSelect}
                onEventClick={handleEventClick}
                />
            </div>

        {/* Events Section */}
        <EventsSection events={eventsData} />
    </div>
  );
}
