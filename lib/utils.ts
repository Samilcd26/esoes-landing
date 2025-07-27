import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Event as ApiEvent } from "./types/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// MotionCalendar event interface
export interface MotionCalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date; // Bitiş tarihi için eklendi
  time: string;
  color: string;
  description?: string;
}

// Event color palette for calendar
const EVENT_COLORS = [
  "bg-blue-500",
  "bg-green-500", 
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

// Convert API event to MotionCalendar event
export function apiEventToMotionEvent(apiEvent: ApiEvent): MotionCalendarEvent {
  const startDate = new Date(apiEvent.startDate);
  const endDate = new Date(apiEvent.endDate);
  
  // Format time from date
  const timeString = startDate.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  // Generate consistent color based on event ID
  const colorIndex = apiEvent.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % EVENT_COLORS.length;
  const color = EVENT_COLORS[colorIndex];
  
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    date: startDate,
    endDate: endDate, // Bitiş tarihini de ekliyoruz
    time: timeString,
    color: color,
    description: apiEvent.description
  };
}

// Convert multiple API events to MotionCalendar events
export function apiEventsToMotionEvents(apiEvents: ApiEvent[]): MotionCalendarEvent[] {
  return apiEvents.map(apiEventToMotionEvent);
}

// Get time range string for display
export function getEventTimeRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startTime = start.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const endTime = end.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  // If same day, show time range
  if (start.toDateString() === end.toDateString()) {
    return `${startTime} - ${endTime}`;
  }
  
  // If different days, show full date range
  return `${start.toLocaleDateString('tr-TR')} ${startTime} - ${end.toLocaleDateString('tr-TR')} ${endTime}`;
}
