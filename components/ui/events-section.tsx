"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  images: string[];
}

const EventCard = ({ event, index, onCardClick }: { event: Event; index: number; onCardClick: (event: Event) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const aspectRatio = "aspect-[4/3]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onCardClick(event)}
      className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      {/* Image/Video - İlk resmi göster */}
      <div className={`relative ${aspectRatio} overflow-hidden`}>
        {event.images && event.images.length > 0 ? (
          <>
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Animated overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-blue-600/40 to-cyan-600/40 flex items-center justify-center"
            >
              <div className="text-white text-lg font-semibold">Detayları Gör</div>
            </motion.div>
          </>
        ) : (
          <>
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-cyan-600/30 opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-white/30 font-bold">
                {event.title.charAt(0)}
              </div>
            </div>
            {/* Animated overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-blue-600/40 to-cyan-600/40 flex items-center justify-center"
            >
              <div className="text-white text-lg font-semibold">Detayları Gör</div>
            </motion.div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-purple-300 transition-colors duration-300">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3">
          {event.description}
        </p>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl pointer-events-none"
      />
    </motion.div>
  );
};



// Modal bileşeni
const EventModal = ({ event, isOpen, onClose }: { event: Event | null; isOpen: boolean; onClose: () => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!event) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Gallery */}
              <div className="relative lg:w-2/3 h-48 sm:h-64 lg:h-full bg-gray-800">
                <div className="relative h-full">
                  <Image
                    src={event.images[currentImageIndex]}
                    alt={`${event.title} - Resim ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                  
                  {/* Navigation Arrows */}
                  {event.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft size={20} className="md:w-6 md:h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight size={20} className="md:w-6 md:h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Indicators */}
                  {event.images.length > 1 && (
                    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
                      {event.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/3 p-4 md:p-8 overflow-y-auto">
                <div className="space-y-4 md:space-y-6">
                  {/* Title */}
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4">{event.title}</h2>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-lg">{event.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const t = useTranslations("events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section className="relative py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Events Grid - Masonry Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8"
        >
          {events.map((event, index) => (
            <div key={event.id} className="break-inside-avoid mb-4 md:mb-8">
              <EventCard event={event} index={index} onCardClick={handleCardClick} />
            </div>
          ))}
        </motion.div>

        {/* Event Modal */}
        <EventModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />

        {/* Empty State */}
        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg 
                  className="w-24 h-24 mx-auto text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {t("details.noEvents")}
              </h3>
              <p className="text-gray-400 text-lg">
                Bu kategoride henüz etkinlik bulunmuyor.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
