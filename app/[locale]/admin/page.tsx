"use client";
import { motion } from "motion/react";
import { useAllEvents } from "@/hooks/useEvents";
import { LoaderOne } from "@/components/ui/loader";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { 
  IconCalendar, 
  IconUsers, 
  IconChartBar, 
  IconPlus, 
  IconList,
  IconEye,
  IconClock,
  IconCheck,
  IconX
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: eventsData, isLoading } = useAllEvents({ page: 1, limit: 100 });

  const stats = {
    totalEvents: eventsData?.data?.length || 0,
    publishedEvents: eventsData?.data?.filter(e => e.status === 'published').length || 0,
    draftEvents: eventsData?.data?.filter(e => e.status === 'draft').length || 0,
    cancelledEvents: eventsData?.data?.filter(e => e.status === 'cancelled').length || 0,
    totalRegistrations: eventsData?.data?.reduce((sum, event) => sum + event.registeredCount, 0) || 0,
  };

  const recentEvents = eventsData?.data?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <LoaderOne />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Sistem genelinde etkinlik ve kullanıcı yönetimi
              </p>
            </div>
            
            
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Etkinlik</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalEvents}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <IconCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Yayında</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {stats.publishedEvents}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <IconCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Taslak</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                    {stats.draftEvents}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <IconClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Kayıt</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {stats.totalRegistrations}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <IconUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Events */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Son Etkinlikler
                </h2>
                <button
                  onClick={() => window.location.href = '/admin/events'}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <IconList size={16} />
                  Tümünü Görüntüle
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentEvents.length > 0 ? (
                recentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            event.status === 'published' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                            event.status === 'draft' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            event.status === 'cancelled' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          )}>
                            {event.status === 'published' ? 'Yayında' : 
                             event.status === 'draft' ? 'Taslak' : 'İptal'}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <IconCalendar size={14} />
                            {new Date(event.startDate).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <IconUsers size={14} />
                            {event.registeredCount}/{event.capacity}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => window.location.href = `/admin/events`}
                          className="flex items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <IconEye size={14} />
                          Görüntüle
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  Henüz etkinlik bulunmuyor
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Hızlı İşlemler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.location.href = '/admin/events'}
                className="flex items-center gap-3 p-4 text-left bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <IconList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Etkinlik Yönetimi
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tüm etkinlikleri görüntüle ve yönet
                  </p>
                </div>
              </button>

              <button
                onClick={() => window.location.href = '/admin/calendar'}
                className="flex items-center gap-3 p-4 text-left bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <IconCalendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Takvim Görünümü
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Etkinlikleri takvim formatında görüntüle
                  </p>
                </div>
              </button>

              <button
                className="flex items-center gap-3 p-4 text-left bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <IconChartBar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Raporlar
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Etkinlik istatistiklerini görüntüle
                  </p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 