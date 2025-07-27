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

// Enhanced color palette for multiple events on same day
const EVENT_COLORS = [
  {
    gradient: 'bg-gradient-to-r from-red-500 to-pink-500',
    border: 'border-red-400',
    text: 'text-red-50',
    hover: 'hover:from-red-600 hover:to-pink-600',
    shadow: 'shadow-red-500/25',
    ring: 'ring-red-200 dark:ring-red-800',
    dot: 'bg-red-500'
  },
  {
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500',
    border: 'border-blue-400',
    text: 'text-blue-50',
    hover: 'hover:from-blue-600 hover:to-purple-600',
    shadow: 'shadow-blue-500/25',
    ring: 'ring-blue-200 dark:ring-blue-800',
    dot: 'bg-blue-500'
  },
  {
    gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
    border: 'border-green-400',
    text: 'text-green-50',
    hover: 'hover:from-green-600 hover:to-teal-600',
    shadow: 'shadow-green-500/25',
    ring: 'ring-green-200 dark:ring-green-800',
    dot: 'bg-green-500'
  },
  {
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    border: 'border-yellow-400',
    text: 'text-yellow-50',
    hover: 'hover:from-yellow-600 hover:to-orange-600',
    shadow: 'shadow-yellow-500/25',
    ring: 'ring-yellow-200 dark:ring-yellow-800',
    dot: 'bg-yellow-500'
  },
  {
    gradient: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    border: 'border-purple-400',
    text: 'text-purple-50',
    hover: 'hover:from-purple-600 hover:to-indigo-600',
    shadow: 'shadow-purple-500/25',
    ring: 'ring-purple-200 dark:ring-purple-800',
    dot: 'bg-purple-500'
  },
  {
    gradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
    border: 'border-pink-400',
    text: 'text-pink-50',
    hover: 'hover:from-pink-600 hover:to-rose-600',
    shadow: 'shadow-pink-500/25',
    ring: 'ring-pink-200 dark:ring-pink-800',
    dot: 'bg-pink-500'
  },
  {
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    border: 'border-cyan-400',
    text: 'text-cyan-50',
    hover: 'hover:from-cyan-600 hover:to-blue-600',
    shadow: 'shadow-cyan-500/25',
    ring: 'ring-cyan-200 dark:ring-cyan-800',
    dot: 'bg-cyan-500'
  },
  {
    gradient: 'bg-gradient-to-r from-emerald-500 to-green-500',
    border: 'border-emerald-400',
    text: 'text-emerald-50',
    hover: 'hover:from-emerald-600 hover:to-green-600',
    shadow: 'shadow-emerald-500/25',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    dot: 'bg-emerald-500'
  },
  {
    gradient: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    border: 'border-amber-400',
    text: 'text-amber-50',
    hover: 'hover:from-amber-600 hover:to-yellow-600',
    shadow: 'shadow-amber-500/25',
    ring: 'ring-amber-200 dark:ring-amber-800',
    dot: 'bg-amber-500'
  },
  {
    gradient: 'bg-gradient-to-r from-violet-500 to-purple-500',
    border: 'border-violet-400',
    text: 'text-violet-50',
    hover: 'hover:from-violet-600 hover:to-purple-600',
    shadow: 'shadow-violet-500/25',
    ring: 'ring-violet-200 dark:ring-violet-800',
    dot: 'bg-violet-500'
  },
  {
    gradient: 'bg-gradient-to-r from-slate-500 to-gray-500',
    border: 'border-slate-400',
    text: 'text-slate-50',
    hover: 'hover:from-slate-600 hover:to-gray-600',
    shadow: 'shadow-slate-500/25',
    ring: 'ring-slate-200 dark:ring-slate-800',
    dot: 'bg-slate-500'
  },
  {
    gradient: 'bg-gradient-to-r from-rose-500 to-red-500',
    border: 'border-rose-400',
    text: 'text-rose-50',
    hover: 'hover:from-rose-600 hover:to-red-600',
    shadow: 'shadow-rose-500/25',
    ring: 'ring-rose-200 dark:ring-rose-800',
    dot: 'bg-rose-500'
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
        isCurrentMonth: false,
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
        "w-full max-w-5xl mx-auto p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/20 dark:bg-neutral-900/90 dark:border-neutral-700/50",
        className
      )}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        layout
      >
        <motion.button
          onClick={() => navigateMonth(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-600 hover:to-purple-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.h2 
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {MONTH_NAMES[month]} {year}
        </motion.h2>

        <motion.button
          onClick={() => navigateMonth(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-600 hover:to-purple-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAY_NAMES.map((day) => (
          <div 
            key={day}
            className="text-center text-sm font-bold text-gray-600 dark:text-gray-300 py-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
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
                  "relative min-h-[100px] p-3 rounded-xl cursor-pointer transition-all duration-300 z-0",
                  "border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700",
                  day.isCurrentMonth 
                    ? "bg-white/80 dark:bg-neutral-800/80 shadow-sm hover:shadow-md" 
                    : "bg-gray-50/50 dark:bg-neutral-900/50 opacity-60",
                  isSelected && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-300",
                  isTodayDate && "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-300 dark:border-blue-600"
                )}
                onClick={() => handleDateClick(day.date)}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Date number */}
                <motion.div 
                  className={cn(
                    "text-lg font-semibold mb-2 flex items-center justify-between relative z-10",
                    day.isCurrentMonth 
                      ? "text-gray-800 dark:text-gray-200" 
                      : "text-gray-400 dark:text-gray-600",
                    isTodayDate && "text-blue-600 dark:text-blue-400"
                  )}
                  animate={isTodayDate ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>{day.date.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex items-center gap-1">
                      {dayEvents.slice(0, 6).map((event, index) => {
                        const colorScheme = EVENT_COLORS[index % EVENT_COLORS.length];
                        return (
                          <motion.div
                            key={`${event.id}-dot`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              colorScheme.dot
                            )}
                          />
                        );
                      })}
                      {dayEvents.length > 6 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          +{dayEvents.length - 6}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Events */}
                <div className="space-y-0.5 flex-1 relative z-10">
                  <AnimatePresence>
                    {dayEvents.slice(0, 6).map((event, eventIndex) => {
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
                            "h-1.5 cursor-pointer transition-all duration-200 relative overflow-hidden",
                            colorScheme.gradient,
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
                          {/* Subtle shimmer effect */}
                          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent transform skew-x-12 pointer-events-none animate-pulse" />
                        </motion.div>
                      );
                    })}
                                      </AnimatePresence>
                    
                  {dayEvents.length > 6 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-600 rounded-md border border-gray-300 dark:border-neutral-600 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span className="font-semibold">+{dayEvents.length - 6}</span> daha fazla etkinlik
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
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl pointer-events-none z-0"
                    />
                  )}
                </AnimatePresence>

                {/* Today indicator */}
                {isTodayDate && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg z-20 pointer-events-none"
                  />
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
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700"
          >
            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-4">
              {selectedDate.toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
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
                        "flex items-center space-x-4 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 relative overflow-hidden",
                        "bg-white/80 dark:bg-neutral-800/80",
                        colorScheme.ring,
                        `border-l-${colorScheme.dot.replace('bg-', '')}`
                      )}
                    >
                      {/* Gradient background overlay */}
                      <div className={cn(
                        "absolute inset-0 opacity-5",
                        colorScheme.gradient
                      )} />
                      
                      {/* Color indicator */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className={cn(
                          "w-4 h-4 rounded-full flex-shrink-0 relative",
                          colorScheme.gradient,
                          "shadow-md ring-2 ring-white dark:ring-neutral-800"
                        )}
                      >
                        <div className={cn(
                          "absolute inset-0 rounded-full animate-ping opacity-20",
                          colorScheme.gradient
                        )} />
                      </motion.div>
                      
                      <div className="flex-1 relative z-10">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-1">
                          <span className="text-lg">{event.title}</span>
                          {positionType !== 'single' && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium",
                                colorScheme.gradient,
                                colorScheme.text,
                                "shadow-sm"
                              )}
                            >
                              {positionType === 'start' && 'Başlangıç'}
                              {positionType === 'middle' && 'Devam ediyor'}
                              {positionType === 'end' && 'Bitiş'}
                            </motion.span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                          🕐 {event.time}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {event.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Hover effect decoration */}
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className={cn(
                          "w-1 h-8 rounded-full",
                          colorScheme.gradient
                        )}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Bu tarihte etkinlik bulunmuyor.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 