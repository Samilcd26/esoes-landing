import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import imageCompression from 'browser-image-compression';
// FFmpeg import'larını koşullu hale getiriyoruz
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { toBlobURL } from '@ffmpeg/util';
import { supabase } from '../client';
import { 
  FileUploadRequest, 
  FileUploadResponse, 
  FileCompressionOptions, 
  VideoCompressionOptions,
  FileUploadProgress,
  UploadedFile 
} from '../../types/api';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

// R2 Configuration
const R2_ENDPOINT = process.env.NEXT_PUBLIC_R2_ENDPOINT!;
const R2_ACCESS_KEY = process.env.NEXT_PUBLIC_R2_ACCESS_KEY!;
const R2_SECRET_KEY = process.env.NEXT_PUBLIC_R2_SECRET_KEY!;
const R2_BUCKET = process.env.NEXT_PUBLIC_R2_BUCKET!;
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

// S3 Client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

// FFmpeg instance for video compression - şimdilik devre dışı
// let ffmpeg: FFmpeg | null = null;

class FileUploadService {
  // private async initializeFFmpeg(): Promise<FFmpeg> {
  //   if (!ffmpeg) {
  //     ffmpeg = new FFmpeg();
  //     const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  //     await ffmpeg.load({
  //       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
  //       wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  //     });
  //   }
  //   return ffmpeg;
  // }

  private generateFileName(originalName: string, fileType: 'image' | 'video', topic: string = 'genel'): string {
    const timestamp = Date.now();
    const randomId = uuidv4().substring(0, 8);
    const extension = originalName.split('.').pop();
    
    // Tarih bilgilerini al
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Konu adını temizle (Türkçe karakterler ve özel karakterler için)
    const cleanTopic = topic
      .toLowerCase()
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${fileType}s/${cleanTopic}/${year}/${month}/${day}/${timestamp}-${randomId}.${extension}`;
  }

  private async compressImage(
    file: File, 
    options: FileCompressionOptions = {}
  ): Promise<{ compressedFile: File; compressionRatio: number }> {
    const defaultOptions: FileCompressionOptions = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: false,
      quality: 0.8,
    };

    const compressionOptions = { ...defaultOptions, ...options };

    try {
      const compressedFile = await imageCompression(file, compressionOptions);
      const compressionRatio = Number(((1 - compressedFile.size / file.size) * 100).toFixed(2));
      
      return {
        compressedFile,
        compressionRatio,
      };
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error('Resim sıkıştırma başarısız oldu');
    }
  }

  private async compressVideo(
    file: File, 
    options: VideoCompressionOptions = {}
  ): Promise<{ compressedFile: File; compressionRatio: number }> {
    // Video sıkıştırma şimdilik devre dışı - FFmpeg sorunları nedeniyle
    console.warn('Video compression is temporarily disabled due to FFmpeg issues');
    return {
      compressedFile: file,
      compressionRatio: 0,
    };
  }

  private async getMediaDimensions(file: File): Promise<{ width?: number; height?: number; duration?: number }> {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => resolve({});
        img.src = URL.createObjectURL(file);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          resolve({ 
            width: video.videoWidth, 
            height: video.videoHeight, 
            duration: Math.round(video.duration) 
          });
        };
        video.onerror = () => resolve({});
        video.src = URL.createObjectURL(file);
      } else {
        resolve({});
      }
    });
  }

  private async uploadToR2(file: File, fileName: string): Promise<string> {
    try {
      // File'ı Uint8Array'e çevir - browser uyumluluğu için
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
        Body: uint8Array,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000', // 1 year
      });

      await r2Client.send(command);
      return `${R2_PUBLIC_URL}/${fileName}`;
    } catch (error) {
      console.error('R2 upload failed:', error);
      throw new Error('Dosya yükleme başarısız oldu');
    }
  }

  private async saveFileRecord(
    file: File, 
    fileName: string, 
    filePath: string, 
    cdnUrl: string, 
    userId: string,
    compressionData?: { compressedSize: number; compressionRatio: number; isCompressed: boolean },
    dimensions?: { width?: number; height?: number; duration?: number }
  ): Promise<UploadedFile> {
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    
    const fileRecord = {
      user_id: userId,
      original_name: file.name,
      file_name: fileName,
      file_path: filePath,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
      compressed_size: compressionData?.compressedSize || null,
      width: dimensions?.width || null,
      height: dimensions?.height || null,
      duration: dimensions?.duration || null,
      r2_bucket: R2_BUCKET,
      r2_key: fileName,
      cdn_url: cdnUrl,
      is_compressed: compressionData?.isCompressed || false,
      compression_ratio: compressionData?.compressionRatio || null,
      status: 'completed' as const,
      metadata: {
        originalSize: file.size,
        uploadedAt: new Date().toISOString(),
      },
    };

    const { data, error } = await supabase
      .from('uploaded_files')
      .insert(fileRecord)
      .select()
      .single();

    if (error) {
      console.error('Database save failed:', error);
      console.error('File record that failed to insert:', fileRecord);
      
      // Provide more specific error messages
      if (error.code === '23503' && error.message.includes('user_id')) {
        throw new Error('Kullanıcı profili bulunamadı. Lütfen tekrar giriş yapın.');
      } else if (error.code === '23505') {
        throw new Error('Bu dosya zaten yüklenmiş.');
      } else {
        throw new Error(`Dosya kaydı veritabanına kaydedilemedi: ${error.message}`);
      }
    }

    return {
      id: data.id,
      userId: data.user_id,
      originalName: data.original_name,
      fileName: data.file_name,
      filePath: data.file_path,
      fileType: data.file_type,
      mimeType: data.mime_type,
      fileSize: data.file_size,
      compressedSize: data.compressed_size,
      width: data.width,
      height: data.height,
      duration: data.duration,
      r2Bucket: data.r2_bucket,
      r2Key: data.r2_key,
      cdnUrl: data.cdn_url,
      isCompressed: data.is_compressed,
      compressionRatio: data.compression_ratio,
      status: data.status,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async uploadFile(
    request: FileUploadRequest,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileUploadResponse> {
    const { file, userId, compress = true } = request;
    
    if (!file) {
      throw new Error('Dosya seçilmedi');
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      throw new Error('Yalnızca resim ve video dosyaları yüklenebilir');
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new Error('Dosya boyutu 500MB\'dan büyük olamaz');
    }

    try {
      onProgress?.({
        loaded: 0,
        total: 100,
        percentage: 0,
        stage: 'compressing',
      });

      // Get original dimensions
      const dimensions = await this.getMediaDimensions(file);
      
      // Compress file if requested
      let finalFile = file;
      let compressionData: { compressedSize: number; compressionRatio: number; isCompressed: boolean } | undefined;

      if (compress) {
        if (isImage) {
          const { compressedFile, compressionRatio } = await this.compressImage(file, {
            maxSizeMB: request.quality ? request.quality * 10 : 2,
            maxWidthOrHeight: request.maxWidth || request.maxHeight || 1920,
            quality: request.quality || 0.8,
          });
          finalFile = compressedFile;
          compressionData = {
            compressedSize: compressedFile.size,
            compressionRatio,
            isCompressed: true,
          };
        } else if (isVideo) {
          const { compressedFile, compressionRatio } = await this.compressVideo(file, {
            width: request.maxWidth || 1280,
            height: request.maxHeight || 720,
          });
          finalFile = compressedFile;
          compressionData = {
            compressedSize: compressedFile.size,
            compressionRatio,
            isCompressed: true,
          };
        }
      }

      onProgress?.({
        loaded: 50,
        total: 100,
        percentage: 50,
        stage: 'uploading',
      });

      // Generate file name and upload to R2
      const fileName = this.generateFileName(file.name, isImage ? 'image' : 'video', request.topic);
      const cdnUrl = await this.uploadToR2(finalFile, fileName);

      onProgress?.({
        loaded: 90,
        total: 100,
        percentage: 90,
        stage: 'finalizing',
      });

      // Save file record to database
      const uploadedFile = await this.saveFileRecord(
        file,
        fileName,
        fileName,
        cdnUrl,
        userId,
        compressionData,
        dimensions
      );

      onProgress?.({
        loaded: 100,
        total: 100,
        percentage: 100,
        stage: 'finalizing',
      });

      return {
        file: uploadedFile,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    // Get file record
    const { data: fileRecord, error: fetchError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !fileRecord) {
      throw new Error('Dosya bulunamadı');
    }

    try {
      // Delete from R2
      const deleteCommand = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileRecord.r2_key,
      });

      await r2Client.send(deleteCommand);

      // Delete from database
      const { error: deleteError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', userId);

      if (deleteError) {
        throw new Error('Dosya veritabanından silinemedi');
      }
    } catch (error) {
      console.error('File deletion failed:', error);
      throw new Error('Dosya silinirken hata oluştu');
    }
  }

  async getUserFiles(userId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Dosyalar getirilemedi');
    }

    return data.map(file => ({
      id: file.id,
      userId: file.user_id,
      originalName: file.original_name,
      fileName: file.file_name,
      filePath: file.file_path,
      fileType: file.file_type,
      mimeType: file.mime_type,
      fileSize: file.file_size,
      compressedSize: file.compressed_size,
      width: file.width,
      height: file.height,
      duration: file.duration,
      r2Bucket: file.r2_bucket,
      r2Key: file.r2_key,
      cdnUrl: file.cdn_url,
      isCompressed: file.is_compressed,
      compressionRatio: file.compression_ratio,
      status: file.status,
      metadata: file.metadata,
      created_at: file.created_at,
      updated_at: file.updated_at,
    }));
  }

  async getFileById(fileId: string, userId: string): Promise<UploadedFile | null> {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      originalName: data.original_name,
      fileName: data.file_name,
      filePath: data.file_path,
      fileType: data.file_type,
      mimeType: data.mime_type,
      fileSize: data.file_size,
      compressedSize: data.compressed_size,
      width: data.width,
      height: data.height,
      duration: data.duration,
      r2Bucket: data.r2_bucket,
      r2Key: data.r2_key,
      cdnUrl: data.cdn_url,
      isCompressed: data.is_compressed,
      compressionRatio: data.compression_ratio,
      status: data.status,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async generatePresignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileKey,
    });

    try {
      const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
      return presignedUrl;
    } catch (error) {
      console.error('Failed to generate presigned URL:', error);
      throw new Error('Dosya erişim URL\'si oluşturulamadı');
    }
  }
}

export const fileUploadService = new FileUploadService();
export default fileUploadService; 