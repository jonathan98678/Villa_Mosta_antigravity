-- Seed Data for Demo/Development
-- Run after 001_initial_schema.sql

-- =====================================================
-- SAMPLE ROOMS
-- =====================================================
INSERT INTO rooms (name, slug, description, base_price, max_guests, features, images, is_active, min_nights) VALUES
(
  'Terrace Suite',
  'terrace-suite',
  'Experience luxury living in our stunning Terrace Suite. This spacious accommodation features a private terrace with panoramic ocean views, a king-size bed with premium linens, and a beautifully appointed en-suite bathroom with rainfall shower. The suite includes a cozy seating area, perfect for relaxing after a day of exploration. Wake up to breathtaking sunrises and enjoy your morning coffee with the sound of waves in the distance.',
  195.00,
  2,
  ARRAY['Private Terrace', 'Ocean View', 'King Bed', 'En-suite Bathroom', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Free WiFi', 'Room Service'],
  ARRAY['/images/rooms/terrace-suite-1.jpg', '/images/rooms/terrace-suite-2.jpg', '/images/rooms/terrace-suite-3.jpg'],
  true,
  2
),
(
  'Garden Double',
  'garden-double',
  'Nestled among lush tropical gardens, our Garden Double offers a peaceful retreat from the everyday. This charming room features a comfortable queen-size bed, a serene garden view, and modern amenities to ensure a relaxing stay. Step outside to your private patio and immerse yourself in the natural beauty that surrounds you, with the gentle fragrance of exotic flowers and the songs of local birds.',
  145.00,
  2,
  ARRAY['Garden View', 'Queen Bed', 'Private Patio', 'En-suite Bathroom', 'Air Conditioning', 'Smart TV', 'Free WiFi', 'Breakfast Included'],
  ARRAY['/images/rooms/garden-double-1.jpg', '/images/rooms/garden-double-2.jpg'],
  true,
  1
),
(
  'Family Villa',
  'family-villa',
  'Our spacious Family Villa is perfect for those traveling with children or friends. Featuring two bedrooms, a comfortable living area, and a fully equipped kitchenette, this villa offers all the comforts of home in a stunning seaside setting. The private garden and direct pool access make this an ideal choice for families seeking space, privacy, and convenience during their holiday.',
  295.00,
  4,
  ARRAY['Two Bedrooms', 'Living Area', 'Kitchenette', 'Private Garden', 'Pool Access', 'En-suite Bathrooms', 'Air Conditioning', 'Smart TV', 'Free WiFi', 'Washer/Dryer'],
  ARRAY['/images/rooms/family-villa-1.jpg', '/images/rooms/family-villa-2.jpg', '/images/rooms/family-villa-3.jpg', '/images/rooms/family-villa-4.jpg'],
  true,
  3
),
(
  'Honeymoon Suite',
  'honeymoon-suite',
  'Celebrate love in our romantic Honeymoon Suite, designed for couples seeking an unforgettable escape. This intimate sanctuary features a luxurious king-size bed, a private jacuzzi with ocean views, and a spacious balcony for stargazing. Complimentary champagne upon arrival, rose petal turndown service, and couples spa treatments available upon request make this the perfect choice for newlyweds and romantics.',
  345.00,
  2,
  ARRAY['Ocean View', 'Private Jacuzzi', 'King Bed', 'Balcony', 'Champagne Service', 'Premium Toiletries', 'Air Conditioning', 'Smart TV', 'Free WiFi', '24h Room Service'],
  ARRAY['/images/rooms/honeymoon-suite-1.jpg', '/images/rooms/honeymoon-suite-2.jpg', '/images/rooms/honeymoon-suite-3.jpg'],
  true,
  2
);

-- =====================================================
-- SAMPLE REVIEWS
-- =====================================================
INSERT INTO reviews (guest_name, country, source, rating, review_text, review_date, is_verified, stay_type, room_type, score, is_featured, is_active) VALUES
(
  'Emma & James Wilson',
  'United Kingdom',
  'Booking.com',
  5,
  'Absolutely stunning property! From the moment we arrived, we were blown away by the beauty and attention to detail. The staff went above and beyond to make our anniversary special. The terrace suite was immaculate, with breathtaking views that made us never want to leave. The breakfast each morning was a highlight - fresh local ingredients prepared with love. We will definitely be returning!',
  '2025-12-15',
  true,
  'Couple',
  'Terrace Suite',
  9.8,
  true,
  true
),
(
  'Marco Rossi',
  'Italy',
  'Airbnb',
  5,
  'Un posto magico! The villa exceeded all our expectations. Perfect location, incredible hosts, and the most beautiful sunsets I have ever seen. The garden room was peaceful and beautifully decorated. Highly recommend the local restaurant suggestions - we had the best seafood of our lives!',
  '2025-11-28',
  true,
  'Solo traveller',
  'Garden Double',
  NULL,
  true,
  true
),
(
  'The Thompson Family',
  'Australia',
  'Our Website',
  5,
  'We traveled with our two kids (ages 8 and 12) and could not have asked for a better family holiday. The Family Villa was spacious and had everything we needed. The kids loved the pool and made friends with other young guests. The staff arranged amazing day trips for us. Already planning our return trip!',
  '2025-10-05',
  true,
  'Family',
  'Family Villa',
  NULL,
  true,
  true
),
(
  'Sophie Dubois',
  'France',
  'Google Maps',
  5,
  'Magnifique! This was our honeymoon and it was perfect. The suite, the service, the location - everything was exceptional. Special thanks to the team for the surprise champagne and rose petals. The jacuzzi with the ocean view at sunset was unforgettable. Pure romance.',
  '2025-09-20',
  true,
  'Couple',
  'Honeymoon Suite',
  NULL,
  true,
  true
),
(
  'David Kim',
  'South Korea',
  'Booking.com',
  4,
  'Great stay overall. Beautiful property with amazing views. The room was clean and comfortable. Only suggestion would be to improve the WiFi connection, but honestly we did not need it much with such beautiful surroundings. Would recommend to anyone looking for a peaceful retreat.',
  '2025-08-12',
  true,
  'Solo traveller',
  'Garden Double',
  8.5,
  false,
  true
),
(
  'Anna & Peter Mueller',
  'Germany',
  'Airbnb',
  5,
  'Wir hatten eine fantastische Zeit! The attention to detail was incredible. Every corner of this property is Instagram-worthy. The breakfast was delicious with so many healthy options. Perfect place to disconnect and recharge. We extended our stay by two extra nights!',
  '2025-07-30',
  true,
  'Couple',
  'Terrace Suite',
  NULL,
  false,
  true
);

-- =====================================================
-- HOME PAGE CONTENT
-- =====================================================
INSERT INTO site_content (page, section, content, order_index, is_active) VALUES
(
  'home',
  'hero',
  '{
    "title": "Villa Paradise",
    "subtitle": "A sanctuary of tranquility on the Portuguese coast. Experience the perfect blend of luxury, nature, and authentic hospitality.",
    "backgroundImage": "/images/hero-villa.jpg"
  }'::jsonb,
  1,
  true
),
(
  'home',
  'description',
  '{
    "text": "Nestled along the stunning Algarve coastline, Villa Paradise offers an intimate escape from the ordinary. Our boutique property combines contemporary elegance with traditional Portuguese charm, creating a unique atmosphere where every moment becomes a cherished memory. Whether you seek adventure or relaxation, our dedicated team ensures your stay exceeds every expectation."
  }'::jsonb,
  2,
  true
),
(
  'home',
  'highlights',
  '{
    "items": [
      {
        "title": "Oceanfront Location",
        "description": "Steps from pristine golden beaches and crystal-clear waters"
      },
      {
        "title": "Curated Experiences",
        "description": "From wine tasting to sailing, discover the best of the Algarve"
      },
      {
        "title": "Farm-to-Table Dining",
        "description": "Fresh, local ingredients prepared by our talented culinary team"
      },
      {
        "title": "Wellness & Relaxation",
        "description": "Spa treatments, yoga sessions, and meditation in nature"
      }
    ]
  }'::jsonb,
  3,
  true
),
(
  'home',
  'amenities',
  '{
    "items": [
      "Infinity Pool",
      "Private Beach Access",
      "Spa & Wellness Center",
      "Gourmet Restaurant",
      "Yoga Deck",
      "Bicycle Rentals",
      "Concierge Service",
      "Airport Transfers",
      "Free High-Speed WiFi",
      "24/7 Room Service"
    ]
  }'::jsonb,
  4,
  true
),
(
  'home',
  'stats',
  '{
    "items": [
      {"label": "Rooms", "value": "4"},
      {"label": "Guest Rating", "value": "9.6"},
      {"label": "Years of Excellence", "value": "12"},
      {"label": "Happy Guests", "value": "2000+"}
    ]
  }'::jsonb,
  5,
  true
),
(
  'home',
  'cta',
  '{
    "title": "Begin Your Escape",
    "description": "Book your stay at Villa Paradise and discover why our guests return year after year.",
    "buttonText": "Check Availability",
    "buttonLink": "/book"
  }'::jsonb,
  6,
  true
);

-- =====================================================
-- VILLA/ABOUT PAGE CONTENT
-- =====================================================
INSERT INTO site_content (page, section, content, order_index, is_active) VALUES
(
  'villa',
  'hero',
  '{
    "title": "Our Villa",
    "subtitle": "A legacy of hospitality, reimagined for the modern traveler",
    "backgroundImage": "/images/villa-exterior.jpg"
  }'::jsonb,
  1,
  true
),
(
  'villa',
  'story',
  '{
    "title": "Our Story",
    "paragraphs": [
      "Villa Paradise began as a family dream in 2013 - to create a place where guests could experience the authentic beauty of Portugal while enjoying world-class comfort and service.",
      "What started as a three-room guesthouse has blossomed into a beloved destination, yet we have never lost sight of what makes us special: the personal touch, the attention to detail, and the genuine warmth that only a family-run property can offer.",
      "Today, under the stewardship of the second generation, we continue to evolve while honoring our heritage. Every renovation, every new offering, every team member is chosen with one goal: to create unforgettable moments for our guests."
    ]
  }'::jsonb,
  2,
  true
),
(
  'villa',
  'features',
  '{
    "items": [
      {
        "title": "Architecture & Design",
        "description": "Traditional Portuguese whitewashed walls meet contemporary interiors, creating spaces that are both timeless and fresh.",
        "image": "/images/villa-architecture.jpg"
      },
      {
        "title": "Sustainable Luxury",
        "description": "Solar power, water recycling, and locally sourced materials - because luxury and responsibility go hand in hand.",
        "image": "/images/villa-sustainable.jpg"
      },
      {
        "title": "Gardens & Grounds",
        "description": "Three acres of landscaped gardens featuring native plants, fruit trees, and secret corners for peaceful contemplation.",
        "image": "/images/villa-gardens.jpg"
      }
    ]
  }'::jsonb,
  3,
  true
);

-- =====================================================
-- LOCATION PAGE CONTENT
-- =====================================================
INSERT INTO site_content (page, section, content, order_index, is_active) VALUES
(
  'location',
  'hero',
  '{
    "title": "Location",
    "subtitle": "Discover the magic of the Algarve coast",
    "backgroundImage": "/images/location-hero.jpg"
  }'::jsonb,
  1,
  true
),
(
  'location',
  'neighborhood',
  '{
    "title": "The Neighborhood",
    "paragraphs": [
      "Villa Paradise is located in the charming fishing village of Carvoeiro, one of the Algarve most picturesque coastal towns. Unlike the busier resort areas, Carvoeiro retains its authentic Portuguese character with cobblestone streets, traditional restaurants, and a genuine local community.",
      "The village beach, Praia do Carvoeiro, is just a 10-minute walk from our property. Here you will find golden sand, calm waters perfect for swimming, and colorful fishing boats that remind you of a simpler time."
    ]
  }'::jsonb,
  2,
  true
),
(
  'location',
  'transportation',
  '{
    "items": [
      {
        "title": "From Faro Airport",
        "description": "45-minute drive via the A22 motorway. We offer airport transfer service.",
        "icon": "plane"
      },
      {
        "title": "By Car",
        "description": "Free private parking available. Car rental recommended for exploring.",
        "icon": "car"
      },
      {
        "title": "Local Transport",
        "description": "Regular bus connections to Lagos, Portimão, and other coastal towns.",
        "icon": "bus"
      }
    ]
  }'::jsonb,
  3,
  true
),
(
  'location',
  'distances',
  '{
    "items": [
      {"destination": "Praia do Carvoeiro (Beach)", "time": "10 min", "method": "walk"},
      {"destination": "Carvoeiro Village Center", "time": "5 min", "method": "walk"},
      {"destination": "Benagil Cave", "time": "15 min", "method": "drive"},
      {"destination": "Lagos Historic Center", "time": "25 min", "method": "drive"},
      {"destination": "Portimão Marina", "time": "20 min", "method": "drive"},
      {"destination": "Faro Airport", "time": "45 min", "method": "drive"},
      {"destination": "Silves Castle", "time": "30 min", "method": "drive"},
      {"destination": "Slide & Splash Water Park", "time": "15 min", "method": "drive"}
    ]
  }'::jsonb,
  4,
  true
);

-- =====================================================
-- FOOTER CONTENT
-- =====================================================
INSERT INTO site_content (page, section, content, order_index, is_active) VALUES
(
  'footer',
  'main',
  '{
    "aboutText": "Villa Paradise is a boutique accommodation on the stunning Algarve coast. We offer luxury rooms, personalized service, and unforgettable experiences in one of Portugal most beautiful regions.",
    "email": "info@villaparadise.com",
    "phone": "+351 282 123 456",
    "address": "Rua das Flores 123",
    "city": "Carvoeiro, Algarve",
    "country": "Portugal",
    "socialLinks": {
      "instagram": "https://instagram.com/villaparadise",
      "facebook": "https://facebook.com/villaparadise"
    }
  }'::jsonb,
  1,
  true
);

-- =====================================================
-- FAQS
-- =====================================================
INSERT INTO faqs (question, answer, category, order_index, is_active) VALUES
(
  'What time is check-in and check-out?',
  'Check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability. Please contact us in advance to arrange.',
  'Booking',
  1,
  true
),
(
  'Do you offer airport transfers?',
  'Yes, we offer private airport transfers from Faro Airport. The journey takes approximately 45 minutes. Please book at least 48 hours in advance. We can also arrange transfers from Lisbon or other locations.',
  'Transportation',
  2,
  true
),
(
  'Is breakfast included?',
  'Breakfast is included with the Garden Double room. For other room types, our gourmet breakfast buffet is available for €25 per person. We also offer in-room breakfast service for an additional fee.',
  'Dining',
  3,
  true
),
(
  'Do you have parking facilities?',
  'Yes, we offer free private parking for all guests. The parking area is secure and located within the property grounds. No reservation needed.',
  'Facilities',
  4,
  true
),
(
  'What is your cancellation policy?',
  'Free cancellation up to 7 days before check-in. Cancellations within 7 days incur a charge of the first night. No-shows are charged the full booking amount. For peak season bookings, different terms may apply.',
  'Booking',
  5,
  true
),
(
  'Are children welcome?',
  'Absolutely! Children of all ages are welcome. The Family Villa is particularly suited for families, with extra beds available upon request. We can also arrange babysitting services with advance notice.',
  'General',
  6,
  true
),
(
  'Do you allow pets?',
  'We welcome well-behaved pets in select rooms. There is a €30 per night pet fee. Please inform us at the time of booking if you plan to bring a pet so we can prepare accordingly.',
  'General',
  7,
  true
),
(
  'Is the property accessible?',
  'Our ground floor rooms and common areas are wheelchair accessible. Please contact us before booking to discuss specific accessibility requirements and we will do our best to accommodate you.',
  'Facilities',
  8,
  true
);
