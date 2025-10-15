-- Seed messages data with static content
-- This will populate the messages table with initial announcements and communications
-- All messages are sent by the admin: mamadiankha@gmail.com
-- Note: sender_id will be NULL for now since auth users are created separately
-- In production, messages should be created with the actual admin user ID

INSERT INTO public.messages (
    title,
    content,
    category,
    priority,
    sender_name,
    sender_role,
    created_at,
    published_at,
    is_published
) VALUES
(
    'Welcome to Ansarudeen Digital',
    'Assalamu Alaikum! We are thrilled to have you join the Ansarudeen Digital community. This platform serves as our primary communication channel for all important announcements, event updates, and community reminders. Stay connected and engaged with our activities.',
    'announcement',
    'high',
    'Admin',
    'Administrator',
    '2024-01-15 10:00:00+00',
    '2024-01-15 10:00:00+00',
    true
),
(
    'Upcoming Maulid Celebration',
    'Join us for the annual Maulid celebration commemorating the birth of Prophet Muhammad (PBUH). The event will feature special lectures, recitations, and communal prayers. All members and their families are warmly invited to participate in this blessed occasion.',
    'event',
    'high',
    'Admin',
    'Administrator',
    '2024-01-14 15:30:00+00',
    '2024-01-14 15:30:00+00',
    true
),
(
    'Membership Renewal Reminder',
    'This is a friendly reminder that annual membership renewals are now open. Please renew your membership to continue enjoying all the benefits and supporting our community initiatives. You can renew directly through the Membership tab.',
    'reminder',
    'normal',
    'Admin',
    'Administrator',
    '2024-01-13 09:00:00+00',
    '2024-01-13 09:00:00+00',
    true
),
(
    'New Library Resources Available',
    'We are excited to announce the addition of new Islamic literature and digital resources to our community library. The collection includes works on Tijaniyya teachings, Quranic tafsir, and contemporary Islamic scholarship. Visit the Resources section to explore.',
    'update',
    'normal',
    'Admin',
    'Administrator',
    '2024-01-12 14:20:00+00',
    '2024-01-12 14:20:00+00',
    true
),
(
    'Weekly Dhikr Session - Time Change',
    'Please note that our weekly Dhikr sessions will now be held every Friday at 7:00 PM instead of 6:00 PM. This change is effective immediately and will allow more members to participate after Maghrib prayers.',
    'announcement',
    'high',
    'Admin',
    'Administrator',
    '2024-01-11 11:45:00+00',
    '2024-01-11 11:45:00+00',
    true
),
(
    'Community Iftar Planning',
    'As Ramadan approaches, we are beginning preparations for our community Iftar programs. We welcome volunteers to help with organization, cooking, and setup. If you would like to contribute, please contact the events committee.',
    'event',
    'normal',
    'Admin',
    'Administrator',
    '2024-01-10 16:00:00+00',
    '2024-01-10 16:00:00+00',
    true
),
(
    'Donation Receipt Updates',
    'All donors will now receive digital receipts via email for tax purposes. Please ensure your email address is up to date in your profile settings. Thank you for your continued support of our community projects.',
    'update',
    'low',
    'Admin',
    'Administrator',
    '2024-01-09 13:30:00+00',
    '2024-01-09 13:30:00+00',
    true
),
(
    'Youth Program Launch',
    'We are launching a new youth mentorship program designed to engage young members in Islamic education and community service. Sessions will include Quran study, Arabic language classes, and leadership development. Registration opens next week.',
    'announcement',
    'normal',
    'Admin',
    'Administrator',
    '2024-01-08 10:15:00+00',
    '2024-01-08 10:15:00+00',
    true
);

-- Add more sample messages for variety
INSERT INTO public.messages (
    title,
    content,
    category,
    priority,
    sender_name,
    sender_role,
    created_at,
    published_at,
    is_published
) VALUES
(
    'Zakat Collection Drive',
    'Our annual Zakat collection campaign has begun. We are collecting Zakat al-Fitr and general Zakat to support underprivileged families in our community. You can donate through the app or visit our office. May Allah accept your contributions.',
    'announcement',
    'high',
    'Admin',
    'Administrator',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    true
),
(
    'Islamic Studies Classes Schedule',
    'New semester of Islamic studies classes begins next month. Classes include Tajweed, Arabic language, Hadith studies, and Fiqh. Registration is now open for all age groups. Limited seats available.',
    'event',
    'normal',
    'Admin',
    'Administrator',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    true
),
(
    'Community Service Day',
    'Join us for our monthly community service day this Saturday. We will be cleaning the masjid grounds, organizing the library, and preparing care packages for the elderly. Volunteers of all ages are welcome.',
    'event',
    'normal',
    'Admin',
    'Administrator',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days',
    true
),
(
    'Prayer Times Update',
    'Please note that prayer times have been updated for the new season. Check the app for the latest Salah times. We encourage everyone to pray in congregation whenever possible.',
    'reminder',
    'normal',
    'Admin',
    'Administrator',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days',
    true
);

-- Log the number of messages inserted
DO $$
DECLARE
    message_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO message_count FROM public.messages;
    RAISE NOTICE 'Successfully inserted messages. Total messages in database: %', message_count;
END $$;
