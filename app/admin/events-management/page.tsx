"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EventList } from "@/components/admin/event-list";
import { EventForm } from "@/components/admin/event-form";
import { Event } from "@/lib/types/api";

// Force dynamic rendering to prevent static generation issues with React Query
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const revalidate = 0;

type ViewMode = 'list' | 'add' | 'edit';

export default function AdminEventsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventAdd = () => {
    setSelectedEvent(null);
    setViewMode('add');
  };

  const handleEventEdit = (event: Event) => {
    setSelectedEvent(event);
    setViewMode('edit');
  };

  const handleEventView = (event: Event) => {
    // For now, just redirect to edit mode
    handleEventEdit(event);
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setSelectedEvent(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <EventList
                onEventAdd={handleEventAdd}
                onEventEdit={handleEventEdit}
                onEventView={handleEventView}
              />
            </motion.div>
          )}

          {(viewMode === 'add' || viewMode === 'edit') && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <button
                  onClick={handleFormCancel}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Listeye Dön
                </button>
              </div>
              
              <EventForm
                event={selectedEvent || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 