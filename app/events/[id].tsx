import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Same hardcoded data as index page
const EVENTS_DATA = [
  {
    id: 1,
    title: 'Annual Fundraising Gala',
    title_arabic: 'حفل جمع التبرعات السنوي',
    description: 'Join us for an elegant evening of community, culture, and charity. Experience traditional performances, delicious cuisine, and connect with fellow members.',
    full_description: 'Join us for an unforgettable evening at our Annual Fundraising Gala. This elegant event brings together community members, supporters, and friends for a night of celebration and giving.\n\nThe evening will feature:\n• Traditional cultural performances\n• Gourmet cuisine prepared by renowned chefs\n• Silent auction with exclusive items\n• Keynote speeches from community leaders\n• Networking opportunities\n• Live entertainment and music\n\nAll proceeds will support our ongoing community projects including education, healthcare, and infrastructure development. Your attendance makes a direct impact on the lives of those we serve.\n\nDress code: Formal attire\nParking: Valet service available',
    date: '2025-11-15',
    time: '6:00 PM - 10:00 PM',
    location: 'Grand Ballroom, Community Center',
    location_arabic: 'القاعة الكبرى، مركز المجتمع',
    address: '123 Community Drive, Downtown District',
    category: 'Fundraising',
    image: 'https://picsum.photos/seed/event1/800/500',
    images: [
      'https://picsum.photos/seed/event1-1/800/500',
      'https://picsum.photos/seed/event1-2/800/500',
      'https://picsum.photos/seed/event1-3/800/500',
    ],
    status: 'upcoming',
    attendees: 250,
    capacity: 300,
    price: 'Free',
    organizer: 'Ansarudeen Digital',
    contact_email: 'events@ansarudeen.org',
    contact_phone: '+1 (555) 123-4567',
  },
  {
    id: 2,
    title: 'Youth Leadership Workshop',
    title_arabic: 'ورشة القيادة الشبابية',
    description: 'Empowering the next generation with leadership skills, mentorship opportunities, and networking sessions with community leaders.',
    full_description: 'Empower yourself with essential leadership skills at our Youth Leadership Workshop. This comprehensive program is designed for young adults aged 16-25 who aspire to become future community leaders.\n\nWorkshop Highlights:\n• Interactive leadership training sessions\n• One-on-one mentorship with established leaders\n• Team building activities and exercises\n• Public speaking and communication skills\n• Project management fundamentals\n• Certificate of completion\n\nLearn from experienced professionals and connect with like-minded peers. This workshop provides practical tools and strategies to help you lead with confidence and make a positive impact in your community.\n\nLimited seats available. Registration required.',
    date: '2025-10-20',
    time: '2:00 PM - 5:00 PM',
    location: 'Education Hall, Main Campus',
    location_arabic: 'قاعة التعليم، الحرم الرئيسي',
    address: '456 Learning Avenue, Education District',
    category: 'Education',
    image: 'https://picsum.photos/seed/event2/800/500',
    images: [
      'https://picsum.photos/seed/event2-1/800/500',
      'https://picsum.photos/seed/event2-2/800/500',
    ],
    status: 'upcoming',
    attendees: 80,
    capacity: 100,
    price: 'Free',
    organizer: 'Youth Committee',
    contact_email: 'youth@ansarudeen.org',
    contact_phone: '+1 (555) 123-4568',
  },
  {
    id: 3,
    title: 'Ramadan Iftar Gathering',
    title_arabic: 'إفطار رمضان الجماعي',
    description: 'Break your fast with the community in a spirit of unity and brotherhood. Traditional iftar meal and Taraweeh prayers included.',
    full_description: 'Experience the blessed month of Ramadan with our community at this special Iftar gathering. Join fellow believers in breaking the fast together in an atmosphere of spiritual reflection and unity.\n\nEvent Features:\n• Traditional iftar meal with dates and water\n• Delicious halal dinner buffet\n• Maghrib prayer in congregation\n• Taraweeh prayers (8 rakats)\n• Short Islamic lecture\n• Children\'s activities area\n• Free copies of the Quran\n\nThis gathering exemplifies the spirit of Ramadan - community, generosity, and spiritual growth. Bring your family and friends to share in this blessed occasion.\n\nAll are welcome regardless of background. Please arrive before sunset for iftar preparation.',
    date: '2026-03-25',
    time: '6:30 PM - 9:00 PM',
    location: 'Grand Mosque',
    location_arabic: 'المسجد الكبير',
    address: '789 Spiritual Way, Holy District',
    category: 'Religious',
    image: 'https://picsum.photos/seed/event3/800/500',
    images: [
      'https://picsum.photos/seed/event3-1/800/500',
      'https://picsum.photos/seed/event3-2/800/500',
      'https://picsum.photos/seed/event3-3/800/500',
    ],
    status: 'upcoming',
    attendees: 500,
    capacity: 600,
    price: 'Free',
    organizer: 'Religious Affairs Committee',
    contact_email: 'religious@ansarudeen.org',
    contact_phone: '+1 (555) 123-4569',
  },
  {
    id: 4,
    title: 'Health & Wellness Fair',
    title_arabic: 'معرض الصحة والعافية',
    description: 'Free health screenings, wellness workshops, and consultations with healthcare professionals. Learn about healthy living and disease prevention.',
    full_description: 'Take charge of your health at our comprehensive Health & Wellness Fair. This free community event offers valuable health resources, screenings, and expert advice to help you live a healthier life.\n\nServices Offered:\n• Free blood pressure and glucose screenings\n• BMI and body composition analysis\n• Vision and hearing tests\n• Dental check-ups and consultations\n• Nutrition counseling\n• Mental health awareness sessions\n• Fitness demonstrations and tips\n• Free health education materials\n\nOur team of licensed healthcare professionals will be available throughout the day to answer questions and provide personalized recommendations. Don\'t miss this opportunity to prioritize your well-being.\n\nBring your health insurance card if available. All services are free regardless of insurance status.',
    date: '2025-11-08',
    time: '10:00 AM - 4:00 PM',
    location: 'Community Sports Complex',
    location_arabic: 'مجمع الرياضة المجتمعي',
    address: '321 Wellness Boulevard, Healthcare District',
    category: 'Healthcare',
    image: 'https://picsum.photos/seed/event4/800/500',
    images: [
      'https://picsum.photos/seed/event4-1/800/500',
      'https://picsum.photos/seed/event4-2/800/500',
    ],
    status: 'upcoming',
    attendees: 150,
    capacity: 200,
    price: 'Free',
    organizer: 'Healthcare Initiative',
    contact_email: 'health@ansarudeen.org',
    contact_phone: '+1 (555) 123-4570',
  },
  {
    id: 5,
    title: 'Eid Al-Fitr Celebration',
    title_arabic: 'احتفال عيد الفطر',
    description: 'Celebrate the joyous occasion of Eid with prayers, festivities, cultural performances, and traditional sweets. Family-friendly activities for all ages.',
    full_description: 'Join us for a grand celebration of Eid Al-Fitr, marking the end of the blessed month of Ramadan. This joyous occasion brings together families and friends in a spirit of gratitude, unity, and celebration.\n\nCelebration Highlights:\n• Eid prayer at 8:00 AM\n• Traditional Eid breakfast\n• Cultural performances and music\n• Children\'s carnival with games and prizes\n• Henna art station\n• Face painting and balloon art\n• Traditional sweets and refreshments\n• Eid gifts for children\n• Photo booth with Eid decorations\n\nDress in your finest traditional attire and bring the whole family for a day of joy and celebration. This is a wonderful opportunity to strengthen community bonds and create lasting memories.\n\nEid Mubarak to all! May this blessed day bring peace and prosperity to our community.',
    date: '2026-04-01',
    time: '8:00 AM - 2:00 PM',
    location: 'Open Grounds, City Center',
    location_arabic: 'الساحة المفتوحة، وسط المدينة',
    address: '555 Festival Plaza, Central District',
    category: 'Religious',
    image: 'https://picsum.photos/seed/event5/800/500',
    images: [
      'https://picsum.photos/seed/event5-1/800/500',
      'https://picsum.photos/seed/event5-2/800/500',
      'https://picsum.photos/seed/event5-3/800/500',
      'https://picsum.photos/seed/event5-4/800/500',
    ],
    status: 'upcoming',
    attendees: 800,
    capacity: 1000,
    price: 'Free',
    organizer: 'Ansarudeen Digital',
    contact_email: 'events@ansarudeen.org',
    contact_phone: '+1 (555) 123-4567',
  },
  {
    id: 6,
    title: 'Community Clean-Up Drive',
    title_arabic: 'حملة التنظيف المجتمعية',
    description: 'Join hands to beautify our neighborhood. Bring your family and friends for a day of community service and environmental stewardship.',
    full_description: 'Make a difference in our community by participating in our quarterly Clean-Up Drive. This hands-on environmental initiative brings neighbors together to beautify our shared spaces and promote sustainable practices.\n\nWhat to Expect:\n• Organized clean-up teams\n• All equipment and supplies provided\n• Trash bags, gloves, and safety vests\n• Recycling education and sorting\n• Tree planting activity\n• Community gardening session\n• Refreshments and snacks\n• Volunteer certificate\n\nNo experience necessary - just bring your enthusiasm and willingness to serve. This is a great opportunity for families to work together and teach children about environmental responsibility.\n\nWear comfortable clothes and closed-toe shoes. Sunscreen and water bottles recommended.',
    date: '2025-10-15',
    time: '7:00 AM - 12:00 PM',
    location: 'Various Locations',
    location_arabic: 'مواقع متعددة',
    address: 'Meeting Point: Community Center Parking Lot',
    category: 'Environment',
    image: 'https://picsum.photos/seed/event6/800/500',
    images: [
      'https://picsum.photos/seed/event6-1/800/500',
      'https://picsum.photos/seed/event6-2/800/500',
    ],
    status: 'upcoming',
    attendees: 120,
    capacity: 150,
    price: 'Free',
    organizer: 'Environment Committee',
    contact_email: 'environment@ansarudeen.org',
    contact_phone: '+1 (555) 123-4571',
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Fundraising': return '#8B5CF6';
    case 'Education': return '#3B82F6';
    case 'Religious': return '#10B981';
    case 'Healthcare': return '#EF4444';
    case 'Environment': return '#059669';
    default: return '#6B7280';
  }
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);

  const event = EVENTS_DATA.find(e => e.id === Number(id));

  if (!event) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={64} color="#CBD5E1" />
        <Text className="text-slate-400 text-lg mt-4">Event not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-emerald-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleRegister = () => {
    if (isRegistered) {
      Alert.alert(
        'Cancel Registration',
        'Are you sure you want to cancel your registration for this event?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              setIsRegistered(false);
              Alert.alert('Success', 'Your registration has been cancelled.');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Register for Event',
        `Confirm your registration for "${event.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Register',
            onPress: () => {
              setIsRegistered(true);
              Alert.alert('Success', 'You have been registered for this event!');
            }
          }
        ]
      );
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n${event.description}\n\nDate: ${formatDate(event.date)}\nTime: ${event.time}\nLocation: ${event.location}`,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image with gradient overlay */}
        <View className="relative">
          <Image
            source={{ uri: event.image }}
            className="w-full h-80"
            resizeMode="cover"
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-40"
          />

          {/* Back and Share buttons */}
          <View
            className="absolute top-0 left-0 right-0 flex-row justify-between px-4"
            style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-black/50 p-3 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="bg-black/50 p-3 rounded-full"
            >
              <Ionicons name="share-social" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Category badge */}
          <View
            className="absolute top-24 right-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: getCategoryColor(event.category) }}
          >
            <Text className="text-white font-bold">
              {event.category}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Title */}
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            {event.title}
          </Text>
          <Text className="text-xl text-slate-500 mb-6 font-arabic">
            {event.title_arabic}
          </Text>

          {/* Stats row */}
          <View className="flex-row items-center mb-6">
            <View className="bg-emerald-50 px-4 py-2 rounded-xl mr-3 flex-row items-center">
              <Ionicons name="people" size={18} color="#059669" />
              <Text className="text-emerald-700 font-semibold ml-2">
                {event.attendees}/{event.capacity}
              </Text>
            </View>

            <View className="bg-purple-50 px-4 py-2 rounded-xl flex-row items-center">
              <Ionicons name="pricetag" size={18} color="#8B5CF6" />
              <Text className="text-purple-700 font-semibold ml-2">
                {event.price}
              </Text>
            </View>
          </View>

          {/* Date & Time */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="bg-emerald-100 p-3 rounded-xl mr-4">
                <Ionicons name="calendar" size={24} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm mb-1">Date</Text>
                <Text className="text-slate-800 font-semibold text-lg">
                  {formatDate(event.date)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-blue-100 p-3 rounded-xl mr-4">
                <Ionicons name="time" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm mb-1">Time</Text>
                <Text className="text-slate-800 font-semibold text-lg">
                  {event.time}
                </Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-start">
              <View className="bg-purple-100 p-3 rounded-xl mr-4">
                <Ionicons name="location" size={24} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm mb-1">Location</Text>
                <Text className="text-slate-800 font-semibold text-lg mb-1">
                  {event.location}
                </Text>
                <Text className="text-slate-500 text-sm">
                  {event.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Organizer */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-start">
              <View className="bg-amber-100 p-3 rounded-xl mr-4">
                <Ionicons name="business" size={24} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm mb-1">Organized by</Text>
                <Text className="text-slate-800 font-semibold text-lg mb-2">
                  {event.organizer}
                </Text>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="mail" size={16} color="#6B7280" />
                  <Text className="text-slate-600 text-sm ml-2">
                    {event.contact_email}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="call" size={16} color="#6B7280" />
                  <Text className="text-slate-600 text-sm ml-2">
                    {event.contact_phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* About */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-xl font-bold text-slate-800 mb-3">
              About This Event
            </Text>
            <Text className="text-slate-600 leading-7">
              {event.full_description}
            </Text>
          </View>

          {/* Event Gallery */}
          {event.images && event.images.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-bold text-slate-800 mb-4">
                Event Gallery
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {event.images.map((imageUri, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    className="w-64 h-40 rounded-2xl mr-4"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Register button - fixed at bottom */}
      <View className="bg-white border-t border-slate-200 px-6 py-4">
        <TouchableOpacity
          onPress={handleRegister}
          className={`py-4 rounded-2xl ${
            isRegistered ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isRegistered ? 'Cancel Registration' : 'Register for Event'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
