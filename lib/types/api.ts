import { FaqCategory } from "./enum";

// Genel API response tipi
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination için tip
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Calendar Event tipleri
export interface CalendarEvent {
  _id: string;
  _type: 'calendar_event';
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  capacity: number;
  registeredCount: number;
  status: 'draft' | 'published' | 'cancelled';
  slug: string;
  category?: string;
  tags?: string[];
  organizer?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

// Event Archive tipleri
export interface MediaResource {
  type: 'image' | 'video' | 'youtube' | 'document' | 'link';
  image?: string;
  imageUrl?: string;
  video?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  document?: string;
  documentUrl?: string;
  externalUrl?: string;
  order: number;
}

export interface EventArchive {
  _id: string;
  _type: 'event_archive';
  title: string;
  description: string;
  slug: string;
  mediaResources?: MediaResource[];
  _createdAt: string;
  _updatedAt: string;
}

// Legacy Event type (for backward compatibility)
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  capacity: number;
  registeredCount: number;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  capacity: number;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

// User tipleri
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | 'organizer';
  avatar_url?: string;
  department_id?: string;
  department?: Department;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Department tipleri
export interface DepartmentImage {
  url: string;
  alt?: string;
}

export interface DepartmentAssistant {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  images?: DepartmentImage[];
  responsibleUserName: string;
  responsibleUserImage?: string;
  responsibleUserNotes?: string;
  phone?: string;
  email?: string;
  assistants?: DepartmentAssistant[];
  slug: string;
  isActive: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  images?: DepartmentImage[];
  responsibleUserName: string;
  responsibleUserImage?: string;
  responsibleUserNotes?: string;
  phone?: string;
  email?: string;
  assistants?: DepartmentAssistant[];
  slug: string;
  isActive?: boolean;
  order: number;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {
  id: string;
}

export interface DepartmentStatistics {
  department_id: string;
  department_name: string;
  member_count: number;
  admin_count: number;
  organizer_count: number;
  user_count: number;
}

// FAQ tipleri
// Faq tipleri
export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFaqRequest {
  question: string;
  answer: string;
  category: FaqCategory;
  order: number;
}

export interface UpdateFaqRequest extends Partial<CreateFaqRequest> {
  id: string;
}


// Contact form tipi
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Error tipi
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// File upload tipleri
export interface UploadedFile {
  id: string;
  userId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileType: 'image' | 'video';
  mimeType: string;
  fileSize: number;
  compressedSize?: number;
  width?: number;
  height?: number;
  duration?: number;
  r2Bucket: string;
  r2Key: string;
  cdnUrl: string;
  isCompressed: boolean;
  compressionRatio?: number;
  status: 'processing' | 'completed' | 'failed';
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FileUploadRequest {
  file: File;
  fileType: 'image' | 'video';
  userId: string;
  compress?: boolean;
  quality?: number; // 0.1 - 1.0
  maxWidth?: number;
  maxHeight?: number;
  topic?: string; // Dosya konusu (klasör yapısı için)
}

export interface FileUploadResponse {
  file: UploadedFile;
  uploadUrl?: string;
}

export interface FileCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

export interface VideoCompressionOptions {
  videoBitrate?: number;
  audioBitrate?: number;
  width?: number;
  height?: number;
  fps?: number;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage: 'compressing' | 'uploading' | 'finalizing';
} 