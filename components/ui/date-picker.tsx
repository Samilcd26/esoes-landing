"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconClock, IconX } from "@tabler/icons-react";

interface DatePickerProps {
  // Single date mode
  value?: string;
  onChange?: (date: string) => void;
  
  // Range mode
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  
  // Configuration
  mode?: 'single' | 'range';
  className?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  showTime?: boolean;
  minDate?: string;
  maxDate?: string;
  autoFillEndDate?: boolean;
  required?: boolean;
}

const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export const DatePicker = ({
  // Single mode
  value = "",
  onChange,
  
  // Range mode
  startDate = "",
  endDate = "",
  onStartDateChange,
  onEndDateChange,
  
  // Configuration
  mode = 'single',
  className,
  label,
  placeholder,
  error,
  disabled = false,
  showTime = true,
  minDate,
  maxDate,
  autoFillEndDate = false,
  required = false
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Single mode state
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? new Date(value).toTimeString().slice(0, 5) : "09:00"
  );
  
  // Range mode state
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate ? new Date(startDate) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    endDate ? new Date(endDate) : null
  );
  const [selectingType, setSelectingType] = useState<'start' | 'end'>('start');
  const [startTime, setStartTime] = useState(
    startDate ? new Date(startDate).toTimeString().slice(0, 5) : "09:00"
  );
  const [endTime, setEndTime] = useState(
    endDate ? new Date(endDate).toTimeString().slice(0, 5) : "17:00"
  );
  
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update internal state when props change
  useEffect(() => {
    if (mode === 'single' && value) {
      const date = new Date(value);
      setSelectedDate(date);
      setSelectedTime(date.toTimeString().slice(0, 5));
    }
  }, [value, mode]);

  useEffect(() => {
    if (mode === 'range') {
      if (startDate) {
        const date = new Date(startDate);
        setSelectedStartDate(date);
        setStartTime(date.toTimeString().slice(0, 5));
      }
      if (endDate) {
        const date = new Date(endDate);
        setSelectedEndDate(date);
        setEndTime(date.toTimeString().slice(0, 5));
      }
    }
  }, [startDate, endDate, mode]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  // Get current month info
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  // Create calendar grid
  const calendarDays = [];
  
  // Previous month's trailing days
  const prevMonth = new Date(year, month - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, prevMonth.getDate() - i),
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }
  
  // Next month's leading days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Past dates are disabled
    if (date < today) return true;
    
    // Check min/max dates
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    
    // Range mode: If selecting end date, it must be after start date
    if (mode === 'range' && selectingType === 'end' && selectedStartDate && date < selectedStartDate) {
      return true;
    }
    
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (mode === 'single') {
      return selectedDate && date.toDateString() === selectedDate.toDateString();
    } else {
      if (selectingType === 'start') {
        return selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
      } else {
        return selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (mode === 'single') return false;
    
    if (!selectedStartDate) return false;
    
    // If we're selecting and hovering, show preview range
    if (selectingType === 'end' && hoveredDate && !selectedEndDate) {
      const endDate = hoveredDate;
      return date >= selectedStartDate && date <= endDate && date.toDateString() !== selectedStartDate.toDateString() && date.toDateString() !== endDate.toDateString();
    }
    
    // Show actual selected range
    if (selectedEndDate) {
      return date >= selectedStartDate && date <= selectedEndDate && date.toDateString() !== selectedStartDate.toDateString() && date.toDateString() !== selectedEndDate.toDateString();
    }
    
    return false;
  };

  const isRangeStart = (date: Date) => {
    if (mode === 'single') return false;
    return selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    if (mode === 'single') return false;
    
    // Preview end date while hovering
    if (selectingType === 'end' && hoveredDate && !selectedEndDate) {
      return date.toDateString() === hoveredDate.toDateString();
    }
    
    return selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === 'single') {
      setSelectedDate(date);
      const dateTimeString = showTime ? formatDateTime(date, selectedTime) : formatDate(date);
      onChange?.(dateTimeString);
    } else {
      // Range mode
      if (selectingType === 'start') {
        setSelectedStartDate(date);
        
        // Auto-fill end date if enabled and no end date selected
        if (autoFillEndDate && !selectedEndDate) {
          setSelectedEndDate(date);
          setSelectingType('end');
        } else if (selectedEndDate && date > selectedEndDate) {
          // If start date is after end date, reset end date
          setSelectedEndDate(date);
        }
        
        // Create datetime string
        const dateTimeString = showTime ? formatDateTime(date, startTime) : formatDate(date);
        onStartDateChange?.(dateTimeString);
        
        // Auto-fill end date
        if (autoFillEndDate && !selectedEndDate) {
          const endDateTime = showTime ? formatDateTime(date, endTime) : formatDate(date);
          onEndDateChange?.(endDateTime);
        }
      } else {
        setSelectedEndDate(date);
        const dateTimeString = showTime ? formatDateTime(date, endTime) : formatDate(date);
        onEndDateChange?.(dateTimeString);
      }
    }
  };

  const handleTimeChange = (time: string) => {
    if (mode === 'single') {
      setSelectedTime(time);
      if (selectedDate) {
        const dateTimeString = formatDateTime(selectedDate, time);
        onChange?.(dateTimeString);
      }
    }
  };

  const handleRangeTimeChange = (type: 'start' | 'end', time: string) => {
    if (type === 'start') {
      setStartTime(time);
      if (selectedStartDate) {
        const dateTimeString = formatDateTime(selectedStartDate, time);
        onStartDateChange?.(dateTimeString);
      }
    } else {
      setEndTime(time);
      if (selectedEndDate) {
        const dateTimeString = formatDateTime(selectedEndDate, time);
        onEndDateChange?.(dateTimeString);
      }
    }
  };

  const formatDateTime = (date: Date, time: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}`;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDisplayText = () => {
    if (mode === 'single') {
      if (selectedDate) {
        if (showTime) {
          return `${formatDisplayDate(selectedDate)} ${selectedTime}`;
        } else {
          return formatDisplayDate(selectedDate);
        }
      }
      return placeholder || "Tarih seçin";
    } else {
      // Range mode
      if (selectedStartDate && selectedEndDate) {
        if (selectedStartDate.toDateString() === selectedEndDate.toDateString()) {
          return `${formatDisplayDate(selectedStartDate)} ${showTime ? `(${startTime} - ${endTime})` : ''}`;
        } else {
          return `${formatDisplayDate(selectedStartDate)} - ${formatDisplayDate(selectedEndDate)}`;
        }
      } else if (selectedStartDate) {
        return `${formatDisplayDate(selectedStartDate)} (Başlangıç)`;
      } else {
        return placeholder || "Tarih aralığı seçin";
      }
    }
  };

  const clearSelection = () => {
    if (mode === 'single') {
      setSelectedDate(null);
      onChange?.("");
    } else {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setSelectingType('start');
      onStartDateChange?.("");
      onEndDateChange?.("");
    }
  };

  const hasSelection = mode === 'single' ? selectedDate : selectedStartDate || selectedEndDate;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 text-left bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200",
            "hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            isOpen && "border-blue-500 ring-2 ring-blue-500 shadow-lg"
          )}
        >
          <span className={cn(
            "text-sm flex-1 truncate",
            hasSelection ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
          )}>
            {getDisplayText()}
          </span>
          
          <div className="flex items-center gap-2 ml-2">
            <IconCalendar className="h-5 w-5 text-gray-400" />
          </div>
        </button>
        
        {/* Clear Button - Outside of main button */}
        {hasSelection && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors z-10"
          >
            <IconX className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full min-w-[400px] bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6"
          >
            {/* Range Mode: Date Type Selector */}
            {mode === 'range' && (
              <div className="flex mb-6 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setSelectingType('start')}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    selectingType === 'start'
                      ? "bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm transform scale-105"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Başlangıç Tarihi
                </button>
                <button
                  type="button"
                  onClick={() => setSelectingType('end')}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    selectingType === 'end'
                      ? "bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm transform scale-105"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Bitiş Tarihi
                </button>
              </div>
            )}

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                type="button"
                onClick={() => navigateMonth(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <IconChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              <motion.h3 
                key={`${month}-${year}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                {MONTH_NAMES[month]} {year}
              </motion.h3>
              
              <motion.button
                type="button"
                onClick={() => navigateMonth(1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <IconChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {DAY_NAMES.map((day) => (
                <div 
                  key={day}
                  className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {calendarDays.map((day, index) => {
                const isSelected = isDateSelected(day.date);
                const isInRange = isDateInRange(day.date);
                const isRangeStartDate = isRangeStart(day.date);
                const isRangeEndDate = isRangeEnd(day.date);
                const isDisabled = isDateDisabled(day.date);
                const isTodayDate = isToday(day.date);

                return (
                  <motion.button
                    key={`${day.date.getTime()}-${index}`}
                    type="button"
                    onClick={() => handleDateClick(day.date)}
                    onMouseEnter={() => setHoveredDate(day.date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    className={cn(
                      "relative h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200",
                      day.isCurrentMonth 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-400 dark:text-gray-600",
                      
                      // Single mode selection
                      mode === 'single' && isSelected && "bg-blue-500 text-white shadow-lg",
                      
                      // Range mode selections
                      isRangeStartDate && "bg-blue-500 text-white shadow-lg",
                      isRangeEndDate && "bg-blue-500 text-white shadow-lg",
                      isInRange && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                      
                      // Hover states
                      !isSelected && !isRangeStartDate && !isRangeEndDate && !isInRange && !isDisabled && "hover:bg-gray-100 dark:hover:bg-neutral-700",
                      
                      // Disabled state
                      isDisabled && "opacity-50 cursor-not-allowed",
                      
                      // Today indicator
                      isTodayDate && !isSelected && !isRangeStartDate && !isRangeEndDate && "bg-gray-200 dark:bg-neutral-600 font-bold ring-2 ring-blue-300 dark:ring-blue-700"
                    )}
                  >
                    {day.date.getDate()}
                    
                    {/* Today dot indicator */}
                    {isTodayDate && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Time Selectors */}
            {showTime && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                {mode === 'single' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <IconClock className="inline h-4 w-4 mr-1" />
                      Saat
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <IconClock className="inline h-4 w-4 mr-1" />
                        Başlangıç Saati
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => handleRangeTimeChange('start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <IconClock className="inline h-4 w-4 mr-1" />
                        Bitiş Saati
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => handleRangeTimeChange('end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    handleDateClick(today);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                >
                  Bugün
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    handleDateClick(tomorrow);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                >
                  Yarın
                </motion.button>
              </div>
              
              <div className="flex gap-2">
                {hasSelection && (
                  <motion.button
                    type="button"
                    onClick={clearSelection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md transition-colors"
                  >
                    Temizle
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors shadow-sm"
                >
                  Tamam
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 