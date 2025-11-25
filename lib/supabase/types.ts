// Database Types for StampID
// These match the Supabase schema in supabase/migrations/001_initial_schema.sql

export type SubscriptionTier = 'free' | 'premium' | 'pro';
export type StampCondition = 'mint' | 'mint_hinged' | 'used' | 'damaged';
export type StampCategory = 'definitive' | 'commemorative' | 'airmail' | 'special' | 'other';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  scan_count_this_month: number;
  scan_reset_date: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Stamp {
  id: string;
  user_id: string;

  // Identification
  name: string;
  country: string | null;
  year_issued: number | null;
  catalog_number: string | null;
  denomination: string | null;

  // Classification
  category: StampCategory | null;
  theme: string | null;

  // Condition & Value
  condition: StampCondition | null;
  condition_notes: string | null;
  estimated_value_low: number | null;
  estimated_value_high: number | null;
  currency: string;

  // Images
  image_url: string;
  thumbnail_url: string | null;

  // AI Data
  ai_confidence: number | null;
  ai_raw_response: Record<string, unknown> | null;

  // Metadata
  notes: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface StampCollection {
  stamp_id: string;
  collection_id: string;
  added_at: string;
}

export interface ScanHistory {
  id: string;
  user_id: string;
  image_url: string;
  result: Record<string, unknown> | null;
  was_saved: boolean;
  stamp_id: string | null;
  created_at: string;
}

// Insert types (for creating new records)
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type StampInsert = Omit<Stamp, 'id' | 'created_at' | 'updated_at'>;
export type CollectionInsert = Omit<Collection, 'id' | 'created_at' | 'updated_at'>;
export type ScanHistoryInsert = Omit<ScanHistory, 'id' | 'created_at'>;

// Update types (for updating records)
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
export type StampUpdate = Partial<Omit<Stamp, 'id' | 'user_id' | 'created_at'>>;
export type CollectionUpdate = Partial<Omit<Collection, 'id' | 'user_id' | 'created_at'>>;

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      stamps: {
        Row: Stamp;
        Insert: StampInsert;
        Update: StampUpdate;
      };
      collections: {
        Row: Collection;
        Insert: CollectionInsert;
        Update: CollectionUpdate;
      };
      stamp_collections: {
        Row: StampCollection;
        Insert: StampCollection;
        Update: never;
      };
      scan_history: {
        Row: ScanHistory;
        Insert: ScanHistoryInsert;
        Update: never;
      };
    };
  };
}
