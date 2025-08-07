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

// Event tipleri
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
export interface Department {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  image_url?: string;
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
  question_tr: string;
  answer_tr: string;
  question_en: string;
  answer_en: string;
  category: FaqCategory;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFaqRequest {
  question_tr: string;
  answer_tr: string;
  question_en: string;
  answer_en: string;
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