-- Insert events data
INSERT INTO public.events (
    id,
    title,
    title_arabic,
    description,
    full_description,
    date,
    time,
    location,
    location_arabic,
    address,
    category,
    status,
    attendees,
    capacity,
    price,
    organizer,
    contact_email,
    contact_phone
) VALUES
(
    1,
    'Annual Fundraising Gala',
    'حفل جمع التبرعات السنوي',
    'Join us for an elegant evening of community, culture, and charity. Experience traditional performances, delicious cuisine, and connect with fellow members.',
    'Join us for an unforgettable evening at our Annual Fundraising Gala. This elegant event brings together community members, supporters, and friends for a night of celebration and giving.

The evening will feature:
• Traditional cultural performances
• Gourmet cuisine prepared by renowned chefs
• Silent auction with exclusive items
• Keynote speeches from community leaders
• Networking opportunities
• Live entertainment and music

All proceeds will support our ongoing community projects including education, healthcare, and infrastructure development. Your attendance makes a direct impact on the lives of those we serve.

Dress code: Formal attire
Parking: Valet service available',
    '2025-11-15',
    '6:00 PM - 10:00 PM',
    'Grand Ballroom, Community Center',
    'القاعة الكبرى، مركز المجتمع',
    '123 Community Drive, Downtown District',
    'Fundraising',
    'upcoming',
    250,
    300,
    'Free',
    'Ansarudeen Digital',
    'events@ansarudeen.org',
    '+1 (555) 123-4567'
),
(
    2,
    'Youth Leadership Workshop',
    'ورشة القيادة الشبابية',
    'Empowering the next generation with leadership skills, mentorship opportunities, and networking sessions with community leaders.',
    'Empower yourself with essential leadership skills at our Youth Leadership Workshop. This comprehensive program is designed for young adults aged 16-25 who aspire to become future community leaders.

Workshop Highlights:
• Interactive leadership training sessions
• One-on-one mentorship with established leaders
• Team building activities and exercises
• Public speaking and communication skills
• Project management fundamentals
• Certificate of completion

Learn from experienced professionals and connect with like-minded peers. This workshop provides practical tools and strategies to help you lead with confidence and make a positive impact in your community.

Limited seats available. Registration required.',
    '2025-10-20',
    '2:00 PM - 5:00 PM',
    'Education Hall, Main Campus',
    'قاعة التعليم، الحرم الرئيسي',
    '456 Learning Avenue, Education District',
    'Education',
    'upcoming',
    80,
    100,
    'Free',
    'Youth Committee',
    'youth@ansarudeen.org',
    '+1 (555) 123-4568'
),
(
    3,
    'Ramadan Iftar Gathering',
    'إفطار رمضان الجماعي',
    'Break your fast with the community in a spirit of unity and brotherhood. Traditional iftar meal and Taraweeh prayers included.',
    'Experience the blessed month of Ramadan with our community at this special Iftar gathering. Join fellow believers in breaking the fast together in an atmosphere of spiritual reflection and unity.

Event Features:
• Traditional iftar meal with dates and water
• Delicious halal dinner buffet
• Maghrib prayer in congregation
• Taraweeh prayers (8 rakats)
• Short Islamic lecture
• Children''s activities area
• Free copies of the Quran

This gathering exemplifies the spirit of Ramadan - community, generosity, and spiritual growth. Bring your family and friends to share in this blessed occasion.

All are welcome regardless of background. Please arrive before sunset for iftar preparation.',
    '2026-03-25',
    '6:30 PM - 9:00 PM',
    'Grand Mosque',
    'المسجد الكبير',
    '789 Spiritual Way, Holy District',
    'Religious',
    'upcoming',
    500,
    600,
    'Free',
    'Religious Affairs Committee',
    'religious@ansarudeen.org',
    '+1 (555) 123-4569'
),
(
    4,
    'Health & Wellness Fair',
    'معرض الصحة والعافية',
    'Free health screenings, wellness workshops, and consultations with healthcare professionals. Learn about healthy living and disease prevention.',
    'Take charge of your health at our comprehensive Health & Wellness Fair. This free community event offers valuable health resources, screenings, and expert advice to help you live a healthier life.

Services Offered:
• Free blood pressure and glucose screenings
• BMI and body composition analysis
• Vision and hearing tests
• Dental check-ups and consultations
• Nutrition counseling
• Mental health awareness sessions
• Fitness demonstrations and tips
• Free health education materials

Our team of licensed healthcare professionals will be available throughout the day to answer questions and provide personalized recommendations. Don''t miss this opportunity to prioritize your well-being.

Bring your health insurance card if available. All services are free regardless of insurance status.',
    '2025-11-08',
    '10:00 AM - 4:00 PM',
    'Community Sports Complex',
    'مجمع الرياضة المجتمعي',
    '321 Wellness Boulevard, Healthcare District',
    'Healthcare',
    'upcoming',
    150,
    200,
    'Free',
    'Healthcare Initiative',
    'health@ansarudeen.org',
    '+1 (555) 123-4570'
),
(
    5,
    'Eid Al-Fitr Celebration',
    'احتفال عيد الفطر',
    'Celebrate the joyous occasion of Eid with prayers, festivities, cultural performances, and traditional sweets. Family-friendly activities for all ages.',
    'Join us for a grand celebration of Eid Al-Fitr, marking the end of the blessed month of Ramadan. This joyous occasion brings together families and friends in a spirit of gratitude, unity, and celebration.

Celebration Highlights:
• Eid prayer at 8:00 AM
• Traditional Eid breakfast
• Cultural performances and music
• Children''s carnival with games and prizes
• Henna art station
• Face painting and balloon art
• Traditional sweets and refreshments
• Eid gifts for children
• Photo booth with Eid decorations

Dress in your finest traditional attire and bring the whole family for a day of joy and celebration. This is a wonderful opportunity to strengthen community bonds and create lasting memories.

Eid Mubarak to all! May this blessed day bring peace and prosperity to our community.',
    '2026-04-01',
    '8:00 AM - 2:00 PM',
    'Open Grounds, City Center',
    'الساحة المفتوحة، وسط المدينة',
    '555 Festival Plaza, Central District',
    'Religious',
    'upcoming',
    800,
    1000,
    'Free',
    'Ansarudeen Digital',
    'events@ansarudeen.org',
    '+1 (555) 123-4567'
),
(
    6,
    'Community Clean-Up Drive',
    'حملة التنظيف المجتمعية',
    'Join hands to beautify our neighborhood. Bring your family and friends for a day of community service and environmental stewardship.',
    'Make a difference in our community by participating in our quarterly Clean-Up Drive. This hands-on environmental initiative brings neighbors together to beautify our shared spaces and promote sustainable practices.

What to Expect:
• Organized clean-up teams
• All equipment and supplies provided
• Trash bags, gloves, and safety vests
• Recycling education and sorting
• Tree planting activity
• Community gardening session
• Refreshments and snacks
• Volunteer certificate

No experience necessary - just bring your enthusiasm and willingness to serve. This is a great opportunity for families to work together and teach children about environmental responsibility.

Wear comfortable clothes and closed-toe shoes. Sunscreen and water bottles recommended.',
    '2025-10-15',
    '7:00 AM - 12:00 PM',
    'Various Locations',
    'مواقع متعددة',
    'Meeting Point: Community Center Parking Lot',
    'Environment',
    'upcoming',
    120,
    150,
    'Free',
    'Environment Committee',
    'environment@ansarudeen.org',
    '+1 (555) 123-4571'
);

-- Insert event media (images)
INSERT INTO public.event_media (event_id, type, uri, is_primary, display_order) VALUES
-- Event 1: Annual Fundraising Gala
(1, 'image', 'https://picsum.photos/seed/event1/800/500', true, 1),
(1, 'image', 'https://picsum.photos/seed/event1-1/800/500', false, 2),
(1, 'image', 'https://picsum.photos/seed/event1-2/800/500', false, 3),
(1, 'image', 'https://picsum.photos/seed/event1-3/800/500', false, 4),

-- Event 2: Youth Leadership Workshop
(2, 'image', 'https://picsum.photos/seed/event2/800/500', true, 1),
(2, 'image', 'https://picsum.photos/seed/event2-1/800/500', false, 2),
(2, 'image', 'https://picsum.photos/seed/event2-2/800/500', false, 3),

-- Event 3: Ramadan Iftar Gathering
(3, 'image', 'https://picsum.photos/seed/event3/800/500', true, 1),
(3, 'image', 'https://picsum.photos/seed/event3-1/800/500', false, 2),
(3, 'image', 'https://picsum.photos/seed/event3-2/800/500', false, 3),
(3, 'image', 'https://picsum.photos/seed/event3-3/800/500', false, 4),

-- Event 4: Health & Wellness Fair
(4, 'image', 'https://picsum.photos/seed/event4/800/500', true, 1),
(4, 'image', 'https://picsum.photos/seed/event4-1/800/500', false, 2),
(4, 'image', 'https://picsum.photos/seed/event4-2/800/500', false, 3),

-- Event 5: Eid Al-Fitr Celebration
(5, 'image', 'https://picsum.photos/seed/event5/800/500', true, 1),
(5, 'image', 'https://picsum.photos/seed/event5-1/800/500', false, 2),
(5, 'image', 'https://picsum.photos/seed/event5-2/800/500', false, 3),
(5, 'image', 'https://picsum.photos/seed/event5-3/800/500', false, 4),
(5, 'image', 'https://picsum.photos/seed/event5-4/800/500', false, 5),

-- Event 6: Community Clean-Up Drive
(6, 'image', 'https://picsum.photos/seed/event6/800/500', true, 1),
(6, 'image', 'https://picsum.photos/seed/event6-1/800/500', false, 2),
(6, 'image', 'https://picsum.photos/seed/event6-2/800/500', false, 3);
