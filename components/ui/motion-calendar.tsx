"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  color: string;
  description?: string;
  endDate?: Date; // Bitiş tarihi için eklendi
}

interface MotionCalendarProps {
  events?: Event[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  className?: string;
}

const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Modern single color palette with glow effects
const EVENT_COLORS = [
  {
    color: 'bg-red-500',
    border: 'border-red-400',
    text: 'text-red-50',
    hover: 'hover:bg-red-600',
    shadow: 'shadow-red-500/40',
    ring: 'ring-red-200 dark:ring-red-800',
    dot: 'bg-red-500',
    glow: 'shadow-red-500/50'
  },
  {
    color: 'bg-blue-500',
    border: 'border-blue-400',
    text: 'text-blue-50',
    hover: 'hover:bg-blue-600',
    shadow: 'shadow-blue-500/40',
    ring: 'ring-blue-200 dark:ring-blue-800',
    dot: 'bg-blue-500',
    glow: 'shadow-blue-500/50'
  },
  {
    color: 'bg-green-500',
    border: 'border-green-400',
    text: 'text-green-50',
    hover: 'hover:bg-green-600',
    shadow: 'shadow-green-500/40',
    ring: 'ring-green-200 dark:ring-green-800',
    dot: 'bg-green-500',
    glow: 'shadow-green-500/50'
  },
  {
    color: 'bg-yellow-500',
    border: 'border-yellow-400',
    text: 'text-yellow-50',
    hover: 'hover:bg-yellow-600',
    shadow: 'shadow-yellow-500/40',
    ring: 'ring-yellow-200 dark:ring-yellow-800',
    dot: 'bg-yellow-500',
    glow: 'shadow-yellow-500/50'
  },
  {
    color: 'bg-purple-500',
    border: 'border-purple-400',
    text: 'text-purple-50',
    hover: 'hover:bg-purple-600',
    shadow: 'shadow-purple-500/40',
    ring: 'ring-purple-200 dark:ring-purple-800',
    dot: 'bg-purple-500',
    glow: 'shadow-purple-500/50'
  },
  {
    color: 'bg-pink-500',
    border: 'border-pink-400',
    text: 'text-pink-50',
    hover: 'hover:bg-pink-600',
    shadow: 'shadow-pink-500/40',
    ring: 'ring-pink-200 dark:ring-pink-800',
    dot: 'bg-pink-500',
    glow: 'shadow-pink-500/50'
  },
  {
    color: 'bg-indigo-500',
    border: 'border-indigo-400',
    text: 'text-indigo-50',
    hover: 'hover:bg-indigo-600',
    shadow: 'shadow-indigo-500/40',
    ring: 'ring-indigo-200 dark:ring-indigo-800',
    dot: 'bg-indigo-500',
    glow: 'shadow-indigo-500/50'
  },
  {
    color: 'bg-emerald-500',
    border: 'border-emerald-400',
    text: 'text-emerald-50',
    hover: 'hover:bg-emerald-600',
    shadow: 'shadow-emerald-500/40',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-500/50'
  },
  {
    color: 'bg-orange-500',
    border: 'border-orange-400',
    text: 'text-orange-50',
    hover: 'hover:bg-orange-600',
    shadow: 'shadow-orange-500/40',
    ring: 'ring-orange-200 dark:ring-orange-800',
    dot: 'bg-orange-500',
    glow: 'shadow-orange-500/50'
  },
  {
    color: 'bg-rose-500',
    border: 'border-rose-400',
    text: 'text-rose-50',
    hover: 'hover:bg-rose-600',
    shadow: 'shadow-rose-500/40',
    ring: 'ring-rose-200 dark:ring-rose-800',
    dot: 'bg-rose-500',
    glow: 'shadow-rose-500/50'
  },
  {
    color: 'bg-violet-500',
    border: 'border-violet-400',
    text: 'text-violet-50',
    hover: 'hover:bg-violet-600',
    shadow: 'shadow-violet-500/40',
    ring: 'ring-violet-200 dark:ring-violet-800',
    dot: 'bg-violet-500',
    glow: 'shadow-violet-500/50'
  },
  {
    color: 'bg-cyan-500',
    border: 'border-cyan-400',
    text: 'text-cyan-50',
    hover: 'hover:bg-cyan-600',
    shadow: 'shadow-cyan-500/40',
    ring: 'ring-cyan-200 dark:ring-cyan-800',
    dot: 'bg-cyan-500',
    glow: 'shadow-cyan-500/50'
  },
];

export const MotionCalendar = ({ 
  events = [], 
  onDateSelect, 
  onEventClick,
  className 
}: MotionCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Get current month info
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Pazartesi = 0
  const daysInMonth = lastDayOfMonth.getDate();

  // Create calendar grid
  const calendarDays = useMemo(() => {
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }
    
    return days;
  }, [year, month, daysInMonth, firstDayWeekday]);

  // Get events for a specific date (including multi-day events)
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.date);
      const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.date);
      
      // Set times to 00:00:00 for date comparison
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Get event position type for multi-day events
  const getEventPositionType = (event: Event, date: Date) => {
    const eventStart = new Date(event.date);
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.date);
    const checkDate = new Date(date);
    
    // Set times to 00:00:00 for date comparison
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    
    if (eventStart.getTime() === eventEnd.getTime()) {
      return 'single'; // Single day event
    } else if (checkDate.getTime() === eventStart.getTime()) {
      return 'start'; // First day of multi-day event
    } else if (checkDate.getTime() === eventEnd.getTime()) {
      return 'end'; // Last day of multi-day event
    } else {
      return 'middle'; // Middle day of multi-day event
    }
  };

  // Navigation functions
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1: Date, date2: Date | null) => {
    if (!date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 dark:bg-neutral-900/90 dark:border-neutral-700/50",
        className
      )}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8"
        layout
      >
        <motion.button
          onClick={() => navigateMonth(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 sm:p-3 rounded-xl bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-blue-600 touch-manipulation relative overflow-hidden group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
          <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.h2 
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 text-center px-2"
        >
          {MONTH_NAMES[month]} {year}
        </motion.h2>

        <motion.button
          onClick={() => navigateMonth(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 sm:p-3 rounded-xl bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-blue-600 touch-manipulation relative overflow-hidden group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
          <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
        {DAY_NAMES.map((day) => (
          <div 
            key={day}
            className="text-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 py-2 sm:py-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        <AnimatePresence mode="popLayout">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isSelected = isSameDate(day.date, selectedDate);
            const isHovered = isSameDate(day.date, hoveredDate);
            const isTodayDate = isToday(day.date);

            return (
              <motion.div
                key={`${day.date.getTime()}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.005 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative min-h-[60px] sm:min-h-[80px] md:min-h-[100px] p-1 sm:p-2 md:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 z-0 touch-manipulation",
                  "border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700",
                  day.isCurrentMonth 
                    ? "bg-white/80 dark:bg-neutral-800/80 shadow-sm hover:shadow-md" 
                    : "bg-gray-50/50 dark:bg-neutral-900/50 opacity-60",
                  isSelected && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-300",
                  isTodayDate && "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600"
                )}
                onClick={() => handleDateClick(day.date)}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Date number */}
                <motion.div 
                  className={cn(
                    "text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 flex items-center justify-between relative z-10",
                    day.isCurrentMonth 
                      ? "text-gray-800 dark:text-gray-200" 
                      : "text-gray-400 dark:text-gray-600",
                    isTodayDate && "text-blue-600 dark:text-blue-400"
                  )}
                  animate={isTodayDate ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs sm:text-sm md:text-base">{day.date.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {dayEvents.slice(0, 3).map((event, index) => {
                        const colorScheme = EVENT_COLORS[index % EVENT_COLORS.length];
                        return (
                          <motion.div
                            key={`${event.id}-dot`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full relative overflow-hidden",
                              colorScheme.dot
                            )}
                          >
                            {/* Glow effect on dots */}
                            <div className={cn(
                              "absolute inset-0 rounded-full blur-sm opacity-60",
                              colorScheme.glow
                            )} />
                          </motion.div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Events */}
                <div className="space-y-0.5 flex-1 relative z-10">
                  <AnimatePresence>
                    {dayEvents.slice(0, 3).map((event, eventIndex) => {
                      const positionType = getEventPositionType(event, day.date);
                      const colorScheme = EVENT_COLORS[eventIndex % EVENT_COLORS.length];
                      
                      return (
                        <motion.div
                          key={`${event.id}-${day.date.getTime()}`}
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          transition={{ delay: eventIndex * 0.1 }}
                          whileHover={{ 
                            scaleY: 1.2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event);
                          }}
                          className={cn(
                            "h-1 sm:h-1.5 cursor-pointer transition-all duration-200 relative overflow-hidden",
                            colorScheme.color,
                            colorScheme.shadow,
                            colorScheme.hover,
                            // Multi-day event styling
                            positionType === 'start' && "rounded-l-full rounded-r-none",
                            positionType === 'middle' && "rounded-none",
                            positionType === 'end' && "rounded-r-full rounded-l-none",
                            positionType === 'single' && "rounded-full",
                            // Enhanced shadow for better depth
                            "shadow-sm hover:shadow-md"
                          )}
                        >
                          {/* Glow effect */}
                          <div className={cn(
                            "absolute inset-0 blur-sm opacity-40",
                            colorScheme.glow
                          )} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                    
                  {dayEvents.length > 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center py-1 sm:py-1.5 bg-gray-100 dark:bg-neutral-700 rounded-md border border-gray-300 dark:border-neutral-600 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span className="font-semibold">+{dayEvents.length - 3}</span> daha fazla
                    </motion.div>
                  )}
                </div>

                {/* Hover effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none z-0"
                    />
                  )}
                </AnimatePresence>

                {/* Today indicator */}
                {isTodayDate && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg z-20 pointer-events-none relative overflow-hidden"
                  >
                    {/* Glow effect on today indicator */}
                    <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-sm" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected date info */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
          >
            <h3 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
              {selectedDate.toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {getEventsForDate(selectedDate).map((event, index) => {
                  const positionType = getEventPositionType(event, selectedDate);
                  const colorScheme = EVENT_COLORS[index % EVENT_COLORS.length];
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                      }}
                      className={cn(
                        "flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 relative overflow-hidden",
                        "bg-white/80 dark:bg-neutral-800/80",
                        colorScheme.ring,
                        `border-l-${colorScheme.dot.replace('bg-', '')}`
                      )}
                    >
                      {/* Glow background overlay */}
                      <div className={cn(
                        "absolute inset-0 opacity-10",
                        colorScheme.color
                      )} />
                      
                      {/* Color indicator */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className={cn(
                          "w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 relative overflow-hidden",
                          colorScheme.color,
                          "shadow-md ring-2 ring-white dark:ring-neutral-800"
                        )}
                      >
                        {/* Glow effect on indicator */}
                        <div className={cn(
                          "absolute inset-0 rounded-full blur-sm opacity-60",
                          colorScheme.glow
                        )} />
                      </motion.div>
                      
                      <div className="flex-1 relative z-10 min-w-0">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-1">
                          <span className="text-base sm:text-lg truncate">{event.title}</span>
                          {positionType !== 'single' && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 relative overflow-hidden",
                                colorScheme.color,
                                colorScheme.text,
                                "shadow-sm"
                              )}
                            >
                              {/* Glow effect on badge */}
                              <div className={cn(
                                "absolute inset-0 rounded-full blur-sm opacity-40",
                                colorScheme.glow
                              )} />
                              <span className="relative z-10">
                                {positionType === 'start' && 'Başlangıç'}
                                {positionType === 'middle' && 'Devam ediyor'}
                                {positionType === 'end' && 'Bitiş'}
                              </span>
                            </motion.span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                          🕐 {event.time}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Hover effect decoration */}
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className={cn(
                          "w-1 h-6 sm:h-8 rounded-full relative overflow-hidden",
                          colorScheme.color
                        )}
                      >
                        {/* Glow effect on decoration */}
                        <div className={cn(
                          "absolute inset-0 blur-sm opacity-40",
                          colorScheme.glow
                        )} />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8">
                Bu tarihte etkinlik bulunmuyor.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 