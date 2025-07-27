import { createClient } from '@supabase/supabase-js';

// Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("supabaseUrl", supabaseUrl);
console.log("supabaseAnonKey", supabaseAnonKey ? "✓ Set" : "✗ Not set");

// Environment variables validation
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
}

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database tipleri için (opsiyonel - database schema'nıza göre)
export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          location: string;
          image_url?: string;
          capacity: number;
          registered_count: number;
          status: 'draft' | 'published' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          location: string;
          image_url?: string;
          capacity: number;
          registered_count?: number;
          status?: 'draft' | 'published' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          location?: string;
          image_url?: string;
          capacity?: number;
          registered_count?: number;
          status?: 'draft' | 'published' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'user' | 'admin' | 'organizer';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role?: 'user' | 'admin' | 'organizer';
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'user' | 'admin' | 'organizer';
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      uploaded_files: {
        Row: {
          id: string;
          user_id: string;
          original_name: string;
          file_name: string;
          file_path: string;
          file_type: 'image' | 'video';
          mime_type: string;
          file_size: number;
          compressed_size?: number;
          width?: number;
          height?: number;
          duration?: number;
          r2_bucket: string;
          r2_key: string;
          cdn_url: string;
          is_compressed: boolean;
          compression_ratio?: number;
          status: 'processing' | 'completed' | 'failed';
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_name: string;
          file_name: string;
          file_path: string;
          file_type: 'image' | 'video';
          mime_type: string;
          file_size: number;
          compressed_size?: number;
          width?: number;
          height?: number;
          duration?: number;
          r2_bucket: string;
          r2_key: string;
          cdn_url: string;
          is_compressed?: boolean;
          compression_ratio?: number;
          status?: 'processing' | 'completed' | 'failed';
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_name?: string;
          file_name?: string;
          file_path?: string;
          file_type?: 'image' | 'video';
          mime_type?: string;
          file_size?: number;
          compressed_size?: number;
          width?: number;
          height?: number;
          duration?: number;
          r2_bucket?: string;
          r2_key?: string;
          cdn_url?: string;
          is_compressed?: boolean;
          compression_ratio?: number;
          status?: 'processing' | 'completed' | 'failed';
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question_tr: string;
          answer_tr: string;
          question_en: string;
          answer_en: string;
          category: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_tr: string;
          answer_tr: string;
          question_en: string;
          answer_en: string;
          category?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_tr?: string;
          answer_tr?: string;
          question_en?: string;
          answer_en?: string;
          category?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Typed Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;