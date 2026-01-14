-- Boutique Villa Booking Platform - Database Schema
-- Run this migration in your Supabase SQL Editor
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =====================================================
-- ADMIN USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  features TEXT [] DEFAULT '{}',
  images TEXT [] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  min_nights INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Index for active rooms
CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_slug ON rooms(slug);
-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'failed', 'refunded')
  ),
  stripe_payment_intent_id VARCHAR(255),
  booking_status VARCHAR(50) DEFAULT 'confirmed' CHECK (
    booking_status IN ('confirmed', 'cancelled', 'completed')
  ),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);
-- Indexes for booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment ON bookings(payment_status);
-- =====================================================
-- BLOCKED DATES TABLE (for maintenance, holidays, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_blocked_dates CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_room ON blocked_dates(room_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_range ON blocked_dates(start_date, end_date);
-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  source VARCHAR(50) DEFAULT 'Our Website' CHECK (
    source IN (
      'Our Website',
      'Booking.com',
      'Airbnb',
      'Google Maps'
    )
  ),
  rating INTEGER NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
  ),
  review_text TEXT NOT NULL,
  review_date DATE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  stay_type VARCHAR(100),
  room_type VARCHAR(100),
  score DECIMAL(3, 1),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
-- =====================================================
-- SITE CONTENT TABLE (CMS)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section)
);
CREATE INDEX IF NOT EXISTS idx_site_content_page ON site_content(page);
-- =====================================================
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- FAQS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);
-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author VARCHAR(255) NOT NULL,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
-- =====================================================
-- GALLERY IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
-- =====================================================
-- ICAL INTEGRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ical_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  ical_url TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  sync_frequency_minutes INTEGER DEFAULT 60,
  last_sync_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- CONTACT REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_responded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contact_requests_read ON contact_requests(is_read);
-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Apply trigger to tables with updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE
UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE
UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE
UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE
UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE
UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE
UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE
UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE
UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ical_integrations_updated_at BEFORE
UPDATE ON ical_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ical_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
-- Public read policies for public-facing content
CREATE POLICY "Public rooms are viewable by everyone" ON rooms FOR
SELECT USING (is_active = true);
CREATE POLICY "Public reviews are viewable by everyone" ON reviews FOR
SELECT USING (is_active = true);
CREATE POLICY "Public content is viewable by everyone" ON site_content FOR
SELECT USING (is_active = true);
CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR
SELECT USING (true);
CREATE POLICY "Active FAQs are viewable by everyone" ON faqs FOR
SELECT USING (is_active = true);
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR
SELECT USING (is_published = true);
CREATE POLICY "Active gallery images are viewable by everyone" ON gallery_images FOR
SELECT USING (is_active = true);
-- Allow inserting contact requests and bookings from public
CREATE POLICY "Anyone can submit contact requests" ON contact_requests FOR
INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create bookings" ON bookings FOR
INSERT WITH CHECK (true);
-- Service role has full access (for admin operations)
-- Note: Service role bypasses RLS, so no explicit policies needed
-- =====================================================
-- SEED DATA - Default Site Settings
-- =====================================================
INSERT INTO site_settings (key, value, description)
VALUES ('site_name', 'Villa Mosta', 'Name of the villa'),
  (
    'contact_email',
    'info@villamosta.com',
    'Main contact email'
  ),
  (
    'contact_phone',
    '+356 1234 5678',
    'Main contact phone'
  ),
  (
    'address',
    '51 Triq Il-Kungress Ewkaristiku',
    'Street address'
  ),
  ('city', 'Mosta, MST 9032', 'City'),
  ('country', 'Malta', 'Country'),
  ('currency', 'EUR', 'Default currency'),
  ('booking_fee', '30', 'Booking/cleaning fee'),
  ('min_nights', '1', 'Default minimum nights') ON CONFLICT (key) DO NOTHING;
-- =====================================================
-- SEED DATA - Default Admin User (password: admin123)
-- =====================================================
-- Note: In production, change this password immediately!
-- Password hash is for 'admin123' using bcrypt
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
    'admin@villamosta.com',
    '$2b$10$N9qo8uLQOWXX0.xV.QxIve8Tz.EpJJYC0lqBv3tW2d3Xc8vN4zjGK',
    'Admin',
    'admin'
  ) ON CONFLICT (email) DO NOTHING;
-- =====================================================
-- SEED DATA - Default Rooms
-- =====================================================
INSERT INTO rooms (
    name,
    slug,
    description,
    base_price,
    max_guests,
    features,
    is_active
  )
VALUES (
    'Family Room with Terrace',
    'family-room-terrace',
    'Spacious 344 sq ft room with private terrace and stunning city views. Features air conditioning, tea/coffee maker, and work desk.',
    89.00,
    3,
    ARRAY ['Air Conditioning', 'Private Terrace', 'City Views', 'Tea/Coffee Maker', 'Work Desk', 'Free WiFi'],
    true
  ),
  (
    'Deluxe Double Room',
    'deluxe-double',
    'Comfortable 215 sq ft room with private bathroom and balcony. Perfect for couples seeking a cozy retreat.',
    69.00,
    2,
    ARRAY ['Air Conditioning', 'Private Bathroom', 'Balcony', 'Free WiFi', 'Tea/Coffee Maker'],
    true
  ),
  (
    'Double/Twin Room with Garden View',
    'double-twin-garden',
    'Charming 215 sq ft room overlooking the garden. Can be configured as twin or double bed.',
    65.00,
    2,
    ARRAY ['Air Conditioning', 'Garden View', 'Twin/Double Bed', 'Free WiFi', 'Private Bathroom'],
    true
  ) ON CONFLICT (slug) DO NOTHING;
-- =====================================================
-- SEED DATA - Sample Reviews
-- =====================================================
INSERT INTO reviews (
    guest_name,
    country,
    source,
    rating,
    review_text,
    review_date,
    is_verified,
    is_featured,
    is_active
  )
VALUES (
    'Maria',
    'Germany',
    'Booking.com',
    5,
    'Amazing location near the Mosta Rotunda! The hosts were incredibly friendly and helpful. The room was clean and comfortable with a beautiful view.',
    '2024-12-15',
    true,
    true,
    true
  ),
  (
    'John',
    'United Kingdom',
    'Airbnb',
    5,
    'Perfect base for exploring Malta. Central location, easy to get to Valletta and Mdina. The sun terrace was lovely!',
    '2024-11-20',
    true,
    true,
    true
  ),
  (
    'Sophie',
    'France',
    'Booking.com',
    5,
    'Wonderful Maltese hospitality! The villa is exactly as pictured. Great value for money and the breakfast recommendations were excellent.',
    '2024-10-05',
    true,
    true,
    true
  ) ON CONFLICT DO NOTHING;
-- =====================================================
-- SEED DATA - Default FAQs
-- =====================================================
INSERT INTO faqs (
    question,
    answer,
    category,
    order_index,
    is_active
  )
VALUES (
    'How far is Villa Mosta from the airport?',
    'Villa Mosta is located approximately 6.8 miles (11 km) from Malta International Airport, about 20 minutes by car or taxi.',
    'Location',
    1,
    true
  ),
  (
    'What attractions are nearby?',
    'The famous Mosta Rotunda (3rd largest unsupported dome in the world) is just a 5-minute walk away. Valletta is 15 minutes by car, and the medieval city of Mdina is 10 minutes away.',
    'Location',
    2,
    true
  ),
  (
    'Is parking available?',
    'Street parking is available in the area. We can also help arrange paid parking if needed.',
    'Amenities',
    3,
    true
  ),
  (
    'What amenities are included?',
    'All rooms include free WiFi, air conditioning, tea/coffee maker, and private bathroom. The property also features a sun terrace and outdoor dining area.',
    'Amenities',
    4,
    true
  ),
  (
    'What is the check-in/check-out time?',
    'Check-in is from 2:00 PM and check-out is by 11:00 AM. We offer express check-in/out and luggage storage for flexible arrivals.',
    'Booking',
    5,
    true
  ),
  (
    'Do you accept children?',
    'Yes! Villa Mosta is child-friendly. Please let us know if you are traveling with children so we can prepare accordingly.',
    'Policies',
    6,
    true
  ) ON CONFLICT DO NOTHING;