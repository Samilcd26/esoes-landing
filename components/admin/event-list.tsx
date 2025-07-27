"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn, getEventTimeRange } from "@/lib/utils";
import { Event } from "@/lib/types/api";
import { useAllEvents, useDeleteEvent, useUpdateEventStatus } from "@/hooks/useEvents";
import { LoaderOne } from "@/components/ui/loader";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconPlus, 
  IconSearch,
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconX,
  IconClock
} from "@tabler/icons-react";

interface EventListProps {
  onEventAdd?: () => void;
  onEventEdit?: (event: Event) => void;
  onEventView?: (event: Event) => void;
  className?: string;
}

type FilterStatus = 'all' | 'draft' | 'published' | 'cancelled';

const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const STATUS_LABELS = {
  draft: 'Taslak',
  published: 'Yayında',
  cancelled: 'İptal'
};

export const EventList = ({ onEventAdd, onEventEdit, onEventView, className }: EventListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const itemsPerPage = 10;

  const { data: eventsData, isLoading, error } = useAllEvents({
    page: currentPage,
    limit: itemsPerPage
  });

  const deleteEventMutation = useDeleteEvent();
  const updateStatusMutation = useUpdateEventStatus();

  // Filter events based on search and status
  const filteredEvents = useMemo(() => {
    if (!eventsData?.data) return [];
    
    let filtered = eventsData.data;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    return filtered;
  }, [eventsData?.data, searchQuery, filterStatus]);

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      try {
        await deleteEventMutation.mutateAsync(eventId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: 'draft' | 'published' | 'cancelled') => {
    try {
      await updateStatusMutation.mutateAsync({ id: eventId, status: newStatus });
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const totalPages = Math.ceil((eventsData?.pagination.total || 0) / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderOne />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Etkinlikler yüklenirken bir hata oluştu
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Etkinlik Yönetimi
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Tüm etkinlikleri görüntüleyin ve yönetin
          </p>
        </div>
        
        {onEventAdd && (
          <HoverBorderGradient as="div">
            <button
              onClick={onEventAdd}
              className="flex items-center gap-2 px-4 py-2 bg-transparent text-white font-medium rounded-lg"
            >
              <IconPlus size={20} />
              Yeni Etkinlik
            </button>
          </HoverBorderGradient>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Etkinlik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
          <option value="cancelled">İptal</option>
        </select>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      STATUS_COLORS[event.status]
                    )}>
                      {STATUS_LABELS[event.status]}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <IconCalendar size={16} />
                      {getEventTimeRange(event.startDate, event.endDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <IconMapPin size={16} />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <IconUsers size={16} />
                      {event.registeredCount}/{event.capacity}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {/* View Button */}
                  {onEventView && (
                    <button
                      onClick={() => onEventView(event)}
                      className="flex items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <IconEye size={16} />
                      Görüntüle
                    </button>
                  )}

                  {/* Edit Button */}
                  {onEventEdit && (
                    <button
                      onClick={() => onEventEdit(event)}
                      className="flex items-center gap-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <IconEdit size={16} />
                      Düzenle
                    </button>
                  )}

                  {/* Status Actions */}
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'published')}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-1 px-3 py-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors disabled:opacity-50"
                    >
                      <IconCheck size={16} />
                      Yayınla
                    </button>
                  )}

                  {event.status === 'published' && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'cancelled')}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-1 px-3 py-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors disabled:opacity-50"
                    >
                      <IconClock size={16} />
                      İptal Et
                    </button>
                  )}

                  {event.status === 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'published')}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-1 px-3 py-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors disabled:opacity-50"
                    >
                      <IconCheck size={16} />
                      Yeniden Yayınla
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deleteEventMutation.isPending}
                    className="flex items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <IconTrash size={16} />
                    Sil
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' 
                ? "Arama kriterlerinize uygun etkinlik bulunamadı" 
                : "Henüz etkinlik bulunmuyor"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            <IconChevronLeft size={16} />
            Önceki
          </button>
          
          <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            Sonraki
            <IconChevronRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
}; 