"use client";

import { MotionCalendar } from "@/components/ui/motion-calendar";
import { useCalendarEvents } from "@/hooks/useEvents";
import { apiEventsToMotionEvents } from "@/lib/utils";
import { LoaderOne } from "@/components/ui/loader";
import { motion } from "framer-motion";

// Section wrapper for fade-in animation
const SectionWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.section>
  );
};


export default function EventsPage() {
  // Fetch calendar events from Supabase
  const { data: calendarEvents, isLoading, error } = useCalendarEvents();

  // Convert API events to MotionCalendar format
  const motionEvents = calendarEvents ? apiEventsToMotionEvents(calendarEvents) : [];

  const handleDateSelect = (date: Date) => {
    console.log("Seçilen tarih:", date);
  };

  const handleEventClick = (event: any) => {
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
        <SectionWrapper className="relative py-20 bg-black">
            <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Upcoming
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    {" "}Events
                </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Heyecan verici etkinliklerimizi keşfedin ve kayıt olun
                </p>
            </div>
            
            </div>
        </SectionWrapper>
    </div>
  );
}
