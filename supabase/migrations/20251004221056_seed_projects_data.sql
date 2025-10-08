-- Seed data for projects

-- Insert project data
INSERT INTO public.projects (id, title, title_arabic, description, full_description, category, icon, status, progress, budget, target_amount, raised_amount, start_date, donors) VALUES
(1, 'Sanitation Infrastructure', 'البنية التحتية للصرف الصحي', 'Modern pipeline network with automatic pumping system', 'Setting up a synchronized and modern pipeline network with large pipes in the main arteries, connected to households through an automatic pumping system. Equipped with recovery stations connected to the ONAS network, discharging into the sea or designated locations. This comprehensive infrastructure project will significantly improve community health and sanitation standards.', 'Infrastructure', '🚰', 'planning', 25, '$2.5M', 2500000, 625000, 'Q3 2025', 145),
(2, 'Environment & Beautification', 'البيئة والتجميل', 'Creating public spaces and reforesting with shade trees', 'Creating public spaces, reforesting with shade trees and flowers to beautify the holy city. Planting coconut trees around the mosque and along the main avenues to enhance the spiritual atmosphere. This initiative will transform our community into a green paradise while providing shade and beauty for generations to come.', 'Environment', '🌳', 'ongoing', 60, '$850K', 850000, 510000, 'Jan 2025', 298),
(3, 'Agriculture with Tool Baye', 'الزراعة مع أداة باي', 'Modern agricultural practices to support local farmers', 'Implementing modern agricultural practices and tools to support local farmers and enhance food security for the community. Using innovative farming techniques and sustainable methods. This project empowers our farming community with cutting-edge tools and knowledge to increase productivity and sustainability.', 'Agriculture', '🌾', 'ongoing', 45, '$450K', 450000, 202500, 'Mar 2025', 187),
(4, 'Grand Mosque Renovation', 'تجديد المسجد الكبير', 'Comprehensive renovation while preserving historical significance', 'Comprehensive renovation and modernization of the Grand Mosque while preserving its historical and spiritual significance. Upgrading facilities, restoring architectural elements, and improving accessibility for worshippers. This sacred project honors our heritage while embracing modern amenities for enhanced worship experience.', 'Religious', '🕌', 'planning', 15, '$3.2M', 3200000, 480000, 'Q4 2025', 342);

-- Insert project media
INSERT INTO public.project_media (project_id, type, uri, display_order) VALUES
(1, 'image', 'https://placehold.co/400x250/059669/FFFFFF?text=Pipeline+Network', 1),
(1, 'image', 'https://placehold.co/400x250/047857/FFFFFF?text=Pumping+System', 2),
(1, 'image', 'https://placehold.co/400x250/065f46/FFFFFF?text=Recovery+Station', 3),
(2, 'image', 'https://placehold.co/400x250/10b981/FFFFFF?text=Public+Spaces', 1),
(2, 'image', 'https://placehold.co/400x250/059669/FFFFFF?text=Tree+Planting', 2),
(2, 'image', 'https://placehold.co/400x250/047857/FFFFFF?text=Flowers+Garden', 3),
(3, 'image', 'https://placehold.co/400x250/f59e0b/FFFFFF?text=Farming+Tools', 1),
(3, 'image', 'https://placehold.co/400x250/d97706/FFFFFF?text=Crop+Fields', 2),
(3, 'image', 'https://placehold.co/400x250/b45309/FFFFFF?text=Harvest+Season', 3),
(4, 'image', 'https://placehold.co/400x250/059669/FFFFFF?text=Mosque+Exterior', 1),
(4, 'image', 'https://placehold.co/400x250/047857/FFFFFF?text=Interior+Design', 2),
(4, 'image', 'https://placehold.co/400x250/065f46/FFFFFF?text=Minaret+Restoration', 3),
(4, 'image', 'https://placehold.co/400x250/10b981/FFFFFF?text=Prayer+Hall', 4);
