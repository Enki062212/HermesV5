-- ============================================================
--  HERMES ENTERPRISE PLATFORM — Supabase SQL Dump
--  Run this in Supabase → SQL Editor
-- ============================================================


-- ============================================================
--  PHASE 1: AUTH & ROLES
-- ============================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT,
  email         TEXT UNIQUE,
  role          TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  avatar_url    TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Brands (e.g. Bloom Cosmetics, Bloom Home)
CREATE TABLE IF NOT EXISTS public.brands (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  logo_url      TEXT,
  color         TEXT DEFAULT '#c9a84c',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Which users can access which brands
CREATE TABLE IF NOT EXISTS public.user_brands (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);


-- ============================================================
--  PHASE 2: CRM
-- ============================================================

-- Contacts / Customers
CREATE TABLE IF NOT EXISTS public.contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  full_name     TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  platform      TEXT CHECK (platform IN ('facebook','instagram','tiktok','shopee','lazada','viber','twitter')),
  stage         TEXT DEFAULT 'Lead' CHECK (stage IN ('Lead','Prospect','Negotiation','Customer','Churned')),
  lifetime_value NUMERIC(12,2) DEFAULT 0,
  score         INTEGER DEFAULT 50 CHECK (score BETWEEN 0 AND 100),
  tags          TEXT[] DEFAULT '{}',
  notes         TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Contact activity log
CREATE TABLE IF NOT EXISTS public.contact_activities (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id    UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  activity_type TEXT CHECK (activity_type IN ('message','call','email','note','stage_change','purchase')),
  description   TEXT,
  created_by    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
--  PHASE 2: INBOX & MESSAGES
-- ============================================================

-- Conversations (one per contact per platform thread)
CREATE TABLE IF NOT EXISTS public.conversations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id      UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  brand_id        UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  platform        TEXT CHECK (platform IN ('facebook','instagram','tiktok','shopee','lazada','viber','twitter')),
  platform_thread_id TEXT,           -- external ID from Meta/TikTok etc.
  status          TEXT DEFAULT 'open' CHECK (status IN ('open','resolved','snoozed')),
  is_urgent       BOOLEAN DEFAULT FALSE,
  assigned_to     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Messages inside conversations
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type     TEXT CHECK (sender_type IN ('customer','agent','bot')),
  sender_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content         TEXT NOT NULL,
  platform_msg_id TEXT,              -- external message ID
  is_ai_generated BOOLEAN DEFAULT FALSE,
  is_read         BOOLEAN DEFAULT FALSE,
  attachments     JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-reply rules per brand
CREATE TABLE IF NOT EXISTS public.auto_reply_rules (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  platform      TEXT,
  trigger_type  TEXT CHECK (trigger_type IN ('keyword','greeting','order','complaint','all')),
  keywords      TEXT[] DEFAULT '{}',
  reply_template TEXT,
  use_ai        BOOLEAN DEFAULT TRUE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
--  PHASE 2: ERP / INVENTORY
-- ============================================================

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  sku           TEXT UNIQUE,
  category      TEXT,
  description   TEXT,
  price         NUMERIC(10,2) DEFAULT 0,
  cost          NUMERIC(10,2) DEFAULT 0,
  stock         INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 50,
  image_url     TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Stock movement log
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    UUID REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type TEXT CHECK (movement_type IN ('in','out','adjustment')),
  quantity      INTEGER NOT NULL,
  reason        TEXT,
  reference_id  UUID,               -- e.g. order ID
  created_by    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id    UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  platform      TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled','refunded')),
  total_amount  NUMERIC(12,2) DEFAULT 0,
  notes         TEXT,
  ordered_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Order line items
CREATE TABLE IF NOT EXISTS public.order_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id      UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity      INTEGER NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
--  PHASE 3: PLATFORM CONNECTIONS
-- ============================================================

-- Social media platform credentials per brand
CREATE TABLE IF NOT EXISTS public.platform_connections (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id        UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  platform        TEXT CHECK (platform IN ('facebook','instagram','tiktok','shopee','lazada','viber','twitter')),
  access_token    TEXT,              -- store encrypted in production
  refresh_token   TEXT,
  page_id         TEXT,              -- Facebook Page ID etc.
  is_active       BOOLEAN DEFAULT TRUE,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, platform)
);


-- ============================================================
--  SEED DATA — Default brands
-- ============================================================

INSERT INTO public.brands (name, description, color) VALUES
  ('Bloom Cosmetics', 'Beauty and skincare products', '#fb7185'),
  ('Bloom Home',      'Home living and decor',        '#34d399'),
  ('Bloom Kids',      'Baby and kids products',       '#fbbf24'),
  ('Bloom Food',      'Food and beverage products',   '#38bdf8')
ON CONFLICT DO NOTHING;


-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_brands         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_activities  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_reply_rules    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;


-- Profiles: users can read their own, admins read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Brands: everyone can read, only admins can write
CREATE POLICY "Anyone authenticated can view brands"
  ON public.brands FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage brands"
  ON public.brands FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contacts: clients see only their brand contacts
CREATE POLICY "Clients see their brand contacts"
  ON public.contacts FOR SELECT
  USING (
    brand_id IN (
      SELECT brand_id FROM public.user_brands
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all contacts"
  ON public.contacts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Conversations: same brand-based access
CREATE POLICY "Clients see their brand conversations"
  ON public.conversations FOR SELECT
  USING (
    brand_id IN (
      SELECT brand_id FROM public.user_brands
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all conversations"
  ON public.conversations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Messages: accessible if user can access the conversation
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE brand_id IN (
        SELECT brand_id FROM public.user_brands
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins manage all messages"
  ON public.messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products: clients read only, admins full access
CREATE POLICY "Authenticated users can view products"
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
--  HELPER FUNCTION: auto-update updated_at timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_contacts
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================
--  HELPER FUNCTION: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
