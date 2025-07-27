import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fileUploadService } from '../lib/api/services/fileUploadService';
import { authService } from '../lib/api/services/authService';
import { 
  FileUploadRequest, 
  FileUploadResponse, 
  FileUploadProgress, 
  UploadedFile 
} from '../lib/types/api';
import { useCurrentUser } from './useAuth';

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress | null>(null);
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const uploadMutation = useMutation<FileUploadResponse, Error, FileUploadRequest>({
    mutationFn: async (request: FileUploadRequest) => {
      return await fileUploadService.uploadFile(request, setUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      setUploadProgress(null);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      setUploadProgress(null);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (fileId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await fileUploadService.deleteFile(fileId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
    },
  });

  const uploadFile = async (file: File, options?: {
    compress?: boolean;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    topic?: string;
  }) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to upload files');
    }

    // Ensure user profile exists before uploading
    try {
      await authService.ensureUserProfile();
    } catch (error) {
      console.error('User profile check failed:', error);
      throw new Error('Kullanıcı profili bulunamadı. Lütfen tekrar giriş yapın.');
    }

    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    
    const request: FileUploadRequest = {
      file,
      fileType,
      userId: user.id,
      compress: options?.compress ?? true,
      quality: options?.quality,
      maxWidth: options?.maxWidth,
      maxHeight: options?.maxHeight,
      topic: options?.topic || 'genel',
    };

    return uploadMutation.mutateAsync(request);
  };

  const deleteFile = async (fileId: string) => {
    return deleteMutation.mutateAsync(fileId);
  };

  return {
    uploadFile,
    deleteFile,
    uploadProgress,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadError: uploadMutation.error,
    deleteError: deleteMutation.error,
  };
};

export const useUserFiles = () => {
  const { data: user } = useCurrentUser();

  return useQuery<UploadedFile[], Error>({
    queryKey: ['user-files', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await fileUploadService.getUserFiles(user.id);
    },
    enabled: !!user?.id,
  });
};

export const useFileById = (fileId: string) => {
  const { data: user } = useCurrentUser();

  return useQuery<UploadedFile | null, Error>({
    queryKey: ['file', fileId, user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await fileUploadService.getFileById(fileId, user.id);
    },
    enabled: !!user?.id && !!fileId,
  });
}; 