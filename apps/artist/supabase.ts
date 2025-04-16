import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      albums: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          cover_url: string | null;
          release_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          cover_url?: string | null;
          release_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          artist_id?: string;
          cover_url?: string | null;
          release_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          album_id: string | null;
          duration: number;
          audio_url: string;
          genre: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          album_id?: string | null;
          duration: number;
          audio_url: string;
          genre?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          artist_id?: string;
          album_id?: string | null;
          duration?: number;
          audio_url?: string;
          genre?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          song_id: string;
          play_count: number;
          unique_listeners: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          song_id: string;
          play_count?: number;
          unique_listeners?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          song_id?: string;
          play_count?: number;
          unique_listeners?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
