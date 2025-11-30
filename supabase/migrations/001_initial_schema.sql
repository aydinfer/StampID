-- StampID Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  scan_count_this_month INTEGER DEFAULT 0,
  scan_reset_date TIMESTAMP WITH TIME ZONE DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STAMPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Identification
  name TEXT NOT NULL,
  country TEXT,
  year_issued INTEGER,
  catalog_number TEXT, -- Scott/Stanley Gibbons number
  denomination TEXT,

  -- Classification
  category TEXT CHECK (category IN ('definitive', 'commemorative', 'airmail', 'special', 'other')),
  theme TEXT, -- wildlife, historical, sports, etc.

  -- Condition & Value
  condition TEXT CHECK (condition IN ('mint', 'mint_hinged', 'used', 'damaged')),
  condition_notes TEXT,
  estimated_value_low DECIMAL(10,2),
  estimated_value_high DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',

  -- Images
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- AI Data
  ai_confidence DECIMAL(5,2),
  ai_raw_response JSONB,

  -- Metadata
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COLLECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STAMP_COLLECTIONS (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.stamp_collections (
  stamp_id UUID REFERENCES public.stamps(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (stamp_id, collection_id)
);

-- ============================================
-- SCAN_HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  result JSONB,
  was_saved BOOLEAN DEFAULT FALSE,
  stamp_id UUID REFERENCES public.stamps(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_stamps_user_id ON public.stamps(user_id);
CREATE INDEX IF NOT EXISTS idx_stamps_country ON public.stamps(country);
CREATE INDEX IF NOT EXISTS idx_stamps_year ON public.stamps(year_issued);
CREATE INDEX IF NOT EXISTS idx_stamps_created_at ON public.stamps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Stamps policies
CREATE POLICY "Users can view own stamps"
  ON public.stamps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stamps"
  ON public.stamps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stamps"
  ON public.stamps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stamps"
  ON public.stamps FOR DELETE
  USING (auth.uid() = user_id);

-- Collections policies
CREATE POLICY "Users can view own collections"
  ON public.collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections"
  ON public.collections FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own collections"
  ON public.collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON public.collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON public.collections FOR DELETE
  USING (auth.uid() = user_id);

-- Stamp_collections policies
CREATE POLICY "Users can view own stamp_collections"
  ON public.stamp_collections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.stamps
      WHERE stamps.id = stamp_collections.stamp_id
      AND stamps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own stamp_collections"
  ON public.stamp_collections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stamps
      WHERE stamps.id = stamp_collections.stamp_id
      AND stamps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own stamp_collections"
  ON public.stamp_collections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.stamps
      WHERE stamps.id = stamp_collections.stamp_id
      AND stamps.user_id = auth.uid()
    )
  );

-- Scan_history policies
CREATE POLICY "Users can view own scan_history"
  ON public.scan_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan_history"
  ON public.scan_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_stamps_updated_at
  BEFORE UPDATE ON public.stamps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('stamps', 'stamps', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true);

-- Storage policies (run in SQL editor):
-- CREATE POLICY "Users can upload stamp images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'stamps' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Anyone can view stamp images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'stamps');

-- CREATE POLICY "Users can upload avatars"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Anyone can view avatars"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');
