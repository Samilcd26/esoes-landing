"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CreateEventRequest, Event } from "@/lib/types/api";
import { useCreateEvent, useUpdateEvent, useUpdateEventStatus } from "@/hooks/useEvents";
import { LoaderOne } from "@/components/ui/loader";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload, FileUploadRef } from "@/components/ui/file-upload";
import { DatePicker } from "@/components/ui/date-picker";
import { useCurrentUser } from "@/hooks/useAuth";

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export const EventForm = ({ event, onSuccess, onCancel, className }: EventFormProps) => {
  const [formData, setFormData] = useState<CreateEventRequest>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    image: "",
    capacity: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateEventRequest, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileUploadRef = useRef<FileUploadRef>(null);

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const updateStatusMutation = useUpdateEventStatus();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  // Populate form if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        image: event.image || "",
        capacity: event.capacity,
      });
    }
  }, [event]);

  const handleInputChange = (field: keyof CreateEventRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateEventRequest, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Etkinlik başlığı gereklidir";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Etkinlik açıklaması gereklidir";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Başlangıç tarihi gereklidir";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Bitiş tarihi gereklidir";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start >= end) {
        newErrors.endDate = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Etkinlik konumu gereklidir";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Kapasite 0'dan büyük olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check authentication and permission
    if (!currentUser) {
      alert('Etkinlik oluşturmak için giriş yapmanız gerekiyor!');
      return;
    }

    if (currentUser.role !== 'admin' && currentUser.role !== 'organizer') {
      alert('Etkinlik oluşturmak için admin veya organizer yetkisine sahip olmanız gerekiyor!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Önce dosyaları yükle
      if (fileUploadRef.current?.hasPendingFiles()) {
        try {
          const uploadedFiles = await fileUploadRef.current.uploadFiles();
          if (uploadedFiles.length > 0) {
            const uploadedFile = uploadedFiles[0] as { url?: string; publicUrl?: string };
            setFormData(prev => ({
              ...prev,
              image: uploadedFile.url || uploadedFile.publicUrl || ""
            }));
          }
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          alert('Dosya yükleme hatası! Lütfen tekrar deneyin.');
          setIsSubmitting(false);
          return;
        }
      }

      if (event) {
        // Update existing event
        await updateMutation.mutateAsync({
          id: event.id,
          data: formData
        });
      } else {
        // Create new event
        await createMutation.mutateAsync(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Event form error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData,
        currentUser,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });
      
      // Show user-friendly error message
      let errorMessage = 'Bilinmeyen bir hata oluştu';
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          errorMessage = 'Yetki hatası: Admin yetkisine sahip değilsiniz';
        } else if (error.message.includes('401')) {
          errorMessage = 'Kimlik doğrulama hatası: Lütfen giriş yapın';
        } else {
          errorMessage = error.message;
        }
      }
      alert(`Hata: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (files: unknown[]) => {
    if (files.length > 0) {
      const uploadedFile = files[0] as { url?: string; publicUrl?: string };
      // Yüklenen dosyanın URL'sini formData'ya ekle
      setFormData(prev => ({
        ...prev,
        image: uploadedFile.url || uploadedFile.publicUrl || ""
      }));
    }
  };

  const handleFileUploadError = (error: string) => {
    console.error("File upload error:", error);
    alert(`Dosya yükleme hatası: ${error}`);
  };

  const handleReset = () => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        image: event.image || "",
        capacity: event.capacity,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        image: "",
        capacity: 0,
      });
    }
    setErrors({});
  };

  const handleStatusChange = async (newStatus: 'published' | 'draft' | 'cancelled') => {
    if (!event) return;
    
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Etkinlik durumunu değiştirmek için admin yetkisine sahip olmanız gerekiyor!');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: event.id,
        status: newStatus
      });
      
      alert(`Etkinlik durumu "${newStatus}" olarak güncellendi!`);
      onSuccess?.(); // Parent component'te event listesini yeniler
    } catch (error) {
      console.error('Status update error:', error);
      alert('Etkinlik durumu güncellenirken hata oluştu!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(className)}
    >
      <div className="shadow-input mx-auto w-full max-w-2xl rounded-none bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          {event ? "Etkinlik Düzenle" : "Yeni Etkinlik Oluştur"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          {event ? "Etkinlik bilgilerini güncelleyin" : "Yeni bir etkinlik oluşturun"}
        </p>

        {/* Authentication Status */}
        {isUserLoading ? (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Kullanıcı bilgileri yükleniyor...
            </p>
          </div>
        ) : !currentUser ? (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ Etkinlik oluşturmak için giriş yapmanız gerekiyor!
            </p>
          </div>
        ) : currentUser.role !== 'admin' && currentUser.role !== 'organizer' ? (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-400">
              ⚠️ Etkinlik oluşturmak için admin veya organizer yetkisine sahip olmanız gerekiyor!
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              ✅ Yetki doğrulandı - {currentUser.role} ({currentUser.email})
            </p>
            {currentUser.role === 'organizer' && (
              <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                Not: Etkinlik oluşturabiliriz ama yayınlamak için admin onayı gerekir.
              </p>
            )}
          </div>
        )}

        {/* Event Status Display */}
        {event && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Etkinlik Durumu:
                </p>
                <p className={cn("text-sm font-semibold", 
                  event.status === 'published' ? 'text-green-600 dark:text-green-400' :
                  event.status === 'draft' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                )}>
                  {event.status === 'published' ? '✅ Yayınlandı' :
                   event.status === 'draft' ? '📝 Taslak' :
                   '❌ İptal edildi'}
                </p>
              </div>
              
              {/* Status Change Buttons - Only for Admins */}
              {currentUser?.role === 'admin' && (
                <div className="flex gap-2">
                  {event.status !== 'published' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('published')}
                      disabled={updateStatusMutation.isPending}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      Yayınla
                    </button>
                  )}
                  {event.status !== 'draft' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('draft')}
                      disabled={updateStatusMutation.isPending}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Taslak
                    </button>
                  )}
                  {event.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={updateStatusMutation.isPending}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      İptal
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <form className="my-8" onSubmit={handleSubmit}>
          {/* Title */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="title">Etkinlik Başlığı *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Etkinlik başlığını girin"
              className={cn(
                "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
                errors.title && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </LabelInputContainer>

          {/* Description */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="description">Etkinlik Açıklaması *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Etkinlik açıklamasını girin"
              rows={4}
              className={cn(
                "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none",
                errors.description && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </LabelInputContainer>

          {/* Date and Time */}
          <LabelInputContainer className="mb-4">
            <DatePicker
              mode="range"
              startDate={formData.startDate}
              endDate={formData.endDate}
              onStartDateChange={(date) => handleInputChange("startDate", date)}
              onEndDateChange={(date) => handleInputChange("endDate", date)}
              label="Etkinlik Tarihi ve Saati"
              placeholder="Etkinlik tarih aralığını seçin"
              error={errors.startDate || errors.endDate}
              showTime={true}
              autoFillEndDate={true}
              required={true}
              className="w-full"
            />
            {(errors.startDate || errors.endDate) && (
              <div className="mt-1 space-y-1">
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate}</p>
                )}
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            )}
          </LabelInputContainer>

          {/* Location */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="location">Etkinlik Konumu *</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Etkinlik konumunu girin"
              className={cn(
                "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
                errors.location && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </LabelInputContainer>

          {/* Image Upload */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="image">Etkinlik Görseli</Label>
            <FileUpload
              ref={fileUploadRef}
              onUploadComplete={handleFileUpload}
              onError={handleFileUploadError}
              accept="image/*"
              maxFiles={1}
              maxSize={10}
              compress={false}
              topic="events"
              className="mt-2"
            />
            {formData.image && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✅ Görsel yüklendi
                </p>
                <a 
                  href={formData.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Görseli görüntüle
                </a>
              </div>
            )}
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              Etkinlik için bir görsel yükleyin (opsiyonel, maksimum 10MB). Form gönderildiğinde otomatik olarak yüklenecektir.
            </p>
          </LabelInputContainer>

          {/* Capacity */}
          <LabelInputContainer className="mb-8">
            <Label htmlFor="capacity">Kapasite *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
              placeholder="Maksimum katılımcı sayısı"
              className={cn(
                "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100",
                errors.capacity && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
            )}
          </LabelInputContainer>

          {/* Submit Button */}
          <button
            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting || !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'organizer')}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <LoaderOne />
                <span>{event ? "Güncelleniyor..." : "Oluşturuluyor..."}</span>
              </div>
            ) : !currentUser ? (
              <span>Giriş Yapmanız Gerekiyor</span>
            ) : currentUser.role !== 'admin' && currentUser.role !== 'organizer' ? (
              <span>Admin/Organizer Yetkisi Gerekiyor</span>
            ) : (
              <>
                {event ? "Etkinliği Güncelle" : "Etkinlik Oluştur (Taslak)"}
                {!event && currentUser.role === 'organizer' && " - Admin Onayı Gerekir"}
                {" "}&rarr;
              </>
            )}
            <BottomGradient />
          </button>

          {/* Divider */}
          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          {/* Secondary Actions */}
          <div className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Formu Sıfırla
              </span>
              <BottomGradient />
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  İptal Et
                </span>
                <BottomGradient />
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 