"use client";

import { useSanityEventArchives } from "@/hooks/useSanityEventArchive";
import EventsSection from "@/components/ui/events-section";
import { EventArchive } from "@/lib/types/api";
import { useTranslations } from "next-intl";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Event archive'ı EventsSection formatına çevir
const eventArchivesToEventsData = (archives: EventArchive[]) => {
  return archives.map(archive => {
    return {
      id: archive._id,
      title: archive.title,
      description: archive.description,
      images: [], // Boş bırakıyoruz çünkü medya kaynakları zaten mediaResources'da
      date: undefined,
      category: 'other',
      mediaResources: archive.mediaResources
    };
  });
};

export default function EventsPage() {
  const t = useTranslations('events');
  // Fetch event archives for bottom section
  const { 
    data: eventArchives, 
    isLoading: archiveLoading, 
    error: archiveError 
  } = useSanityEventArchives();

  // Convert event archives to events data format
  const archiveEventsData = eventArchives?.data ? eventArchivesToEventsData(eventArchives.data) : [];

  // Show loading state
  if (archiveLoading) {
    return (
      <LoadingSpinner 
      title={t('loading.title')}
      subtitle={t('loading.subtitle')}
      className="min-h-[60vh]"
    />

    );
  }

  // Show error state
  if (archiveError) {
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
    <div className="bg-black ">
        {/* Event Archive Section */}
        <div className="container mx-auto">
            <EventsSection events={archiveEventsData} />
        </div>
    </div>
  );
}
