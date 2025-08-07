'use client';

import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileUploadProgress } from '@/lib/types/api';
import { Upload, X, File, Image, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete?: (files: unknown[]) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  compress?: boolean;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  topic?: string; // Dosya konusu (klasör adı için)
  autoUpload?: boolean; // Otomatik yükleme için
}

interface FileState {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress?: FileUploadProgress;
  result?: unknown;
  error?: string;
}

export interface FileUploadRef {
  uploadFiles: () => Promise<unknown[]>;
  clearFiles: () => void;
  hasPendingFiles: () => boolean;
  getUploadedFiles: () => unknown[];
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(({
  onUploadComplete,
  onError,
  accept = 'image/*',
  maxFiles = 5,
  maxSize = 500, // 500MB default
  className,
  compress = true,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080,
  topic = 'genel', // Default konu
  autoUpload = false,
}, ref) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload();

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    uploadFiles: async () => {
      const pendingFiles = files.filter(f => f.status === 'pending');
      const uploadedResults: unknown[] = [];
      
      for (const fileState of pendingFiles) {
        setFiles(prev => prev.map(f => 
          f.id === fileState.id 
            ? { ...f, status: 'uploading' }
            : f
        ));

        try {
          const result = await uploadFile(fileState.file, {
            compress,
            quality,
            maxWidth,
            maxHeight,
            topic,
          });

          setFiles(prev => prev.map(f => 
            f.id === fileState.id 
              ? { ...f, status: 'completed', result }
              : f
          ));

          uploadedResults.push(result);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Yükleme başarısız';
          setFiles(prev => prev.map(f => 
            f.id === fileState.id 
              ? { ...f, status: 'error', error: errorMessage }
              : f
          ));
          onError?.(errorMessage);
          throw error; // Re-throw to let parent handle
        }
      }

      // Notify completion
      if (uploadedResults.length > 0) {
        onUploadComplete?.(uploadedResults);
      }

      return uploadedResults;
    },
    clearFiles: () => {
      setFiles([]);
    },
    hasPendingFiles: () => {
      return files.some(f => f.status === 'pending');
    },
    getUploadedFiles: () => {
      return files.filter(f => f.status === 'completed').map(f => f.result);
    }
  }));

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileState[] = [];
    const remainingSlots = maxFiles - files.length;

    Array.from(selectedFiles).slice(0, remainingSlots).forEach((file) => {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        onError?.(`${file.name} dosyası ${maxSize}MB'dan büyük olamaz`);
        return;
      }

      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        onError?.(`${file.name} sadece resim dosyaları desteklenir`);
        return;
      }

      newFiles.push({
        file,
        id: Math.random().toString(36).substring(7),
        status: 'pending',
      });
    });

    setFiles(prev => [...prev, ...newFiles]);

    // Auto upload if enabled
    if (autoUpload && newFiles.length > 0) {
      setTimeout(() => {
        if (typeof ref === 'object' && ref?.current) {
          ref.current.uploadFiles();
        }
      }, 100);
    }
  }, [files.length, maxFiles, maxSize, onError, autoUpload, ref]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" aria-hidden="true" />;
    return <File className="w-4 h-4" aria-hidden="true" />;
  };

  const getStatusIcon = (status: FileState['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'pending':
        return <div className="w-4 h-4 border-2 border-gray-400 border-dashed rounded-full" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: FileState['status']) => {
    switch (status) {
      case 'completed':
        return 'Yüklendi';
      case 'error':
        return 'Hata';
      case 'uploading':
        return 'Yükleniyor...';
      case 'pending':
        return 'Bekliyor';
      default:
        return '';
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-semibold">Dosyaları buraya sürükleyin</p>
          <p className="text-gray-500 mt-1">veya yüklemek için tıklayın</p>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Resim dosyaları • Maksimum {maxSize}MB • En fazla {maxFiles} dosya
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Klasör: {topic}
        </p>
        {!autoUpload && (
          <p className="text-xs text-amber-600 mt-2 font-medium">
            ⚠️ Dosyalar seçildikten sonra form gönderildiğinde yüklenecektir
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Seçilen Dosyalar ({files.length})</h3>
          {files.map((fileState) => (
            <div
              key={fileState.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(fileState.file)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{fileState.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(fileState.file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(fileState.status)}
                <div className="text-xs">
                  {fileState.status === 'error' && (
                    <span className="text-red-500">{fileState.error}</span>
                  )}
                  {fileState.status === 'uploading' && fileState.progress && (
                    <span className="text-blue-500">
                      {fileState.progress.percentage}% • {fileState.progress.stage}
                    </span>
                  )}
                  {fileState.status === 'pending' && (
                    <span className="text-gray-500">Form gönderildiğinde yüklenecek</span>
                  )}
                  {fileState.status === 'completed' && (
                    <span className="text-green-500">{getStatusText(fileState.status)}</span>
                  )}
                </div>
                <button
                  onClick={() => removeFile(fileState.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  disabled={fileState.status === 'uploading'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compression Options */}
      {compress && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p>Resim sıkıştırma etkin: Kalite %{(quality * 100).toFixed(0)}, Maksimum boyut: {maxWidth}x{maxHeight}</p>
        </div>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload; 