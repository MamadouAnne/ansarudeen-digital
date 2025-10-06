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
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Hardcoded event data
const EVENTS_DATA = [
  {
    id: 1,
    title: 'Annual Fundraising Gala',
    title_arabic: 'حفل جمع التبرعات السنوي',
    description: 'Join us for an elegant evening of community, culture, and charity. Experience traditional performances, delicious cuisine, and connect with fellow members.',
    date: '2025-11-15',
    time: '6:00 PM - 10:00 PM',
    location: 'Grand Ballroom, Community Center',
    location_arabic: 'القاعة الكبرى، مركز المجتمع',
    category: 'Fundraising',
    image: 'https://picsum.photos/seed/event1/800/500',
    status: 'upcoming',
    attendees: 250,
    price: 'Free',
    organizer: 'Ansarudeen Digital',
  },
  {
    id: 2,
    title: 'Youth Leadership Workshop',
    title_arabic: 'ورشة القيادة الشبابية',
    description: 'Empowering the next generation with leadership skills, mentorship opportunities, and networking sessions with community leaders.',
    date: '2025-10-20',
    time: '2:00 PM - 5:00 PM',
    location: 'Education Hall, Main Campus',
    location_arabic: 'قاعة التعليم، الحرم الرئيسي',
    category: 'Education',
    image: 'https://picsum.photos/seed/event2/800/500',
    status: 'upcoming',
    attendees: 80,
    price: 'Free',
    organizer: 'Youth Committee',
  },
  {
    id: 3,
    title: 'Ramadan Iftar Gathering',
    title_arabic: 'إفطار رمضان الجماعي',
    description: 'Break your fast with the community in a spirit of unity and brotherhood. Traditional iftar meal and Taraweeh prayers included.',
    date: '2026-03-25',
    time: '6:30 PM - 9:00 PM',
    location: 'Grand Mosque',
    location_arabic: 'المسجد الكبير',
    category: 'Religious',
    image: 'https://picsum.photos/seed/event3/800/500',
    status: 'upcoming',
    attendees: 500,
    price: 'Free',
    organizer: 'Religious Affairs Committee',
  },
  {
    id: 4,
    title: 'Health & Wellness Fair',
    title_arabic: 'معرض الصحة والعافية',
    description: 'Free health screenings, wellness workshops, and consultations with healthcare professionals. Learn about healthy living and disease prevention.',
    date: '2025-11-08',
    time: '10:00 AM - 4:00 PM',
    location: 'Community Sports Complex',
    location_arabic: 'مجمع الرياضة المجتمعي',
    category: 'Healthcare',
    image: 'https://picsum.photos/seed/event4/800/500',
    status: 'upcoming',
    attendees: 150,
    price: 'Free',
    organizer: 'Healthcare Initiative',
  },
  {
    id: 5,
    title: 'Eid Al-Fitr Celebration',
    title_arabic: 'احتفال عيد الفطر',
    description: 'Celebrate the joyous occasion of Eid with prayers, festivities, cultural performances, and traditional sweets. Family-friendly activities for all ages.',
    date: '2026-04-01',
    time: '8:00 AM - 2:00 PM',
    location: 'Open Grounds, City Center',
    location_arabic: 'الساحة المفتوحة، وسط المدينة',
    category: 'Religious',
    image: 'https://picsum.photos/seed/event5/800/500',
    status: 'upcoming',
    attendees: 800,
    price: 'Free',
    organizer: 'Ansarudeen Digital',
  },
  {
    id: 6,
    title: 'Community Clean-Up Drive',
    title_arabic: 'حملة التنظيف المجتمعية',
    description: 'Join hands to beautify our neighborhood. Bring your family and friends for a day of community service and environmental stewardship.',
    date: '2025-10-15',
    time: '7:00 AM - 12:00 PM',
    location: 'Various Locations',
    location_arabic: 'مواقع متعددة',
    category: 'Environment',
    image: 'https://picsum.photos/seed/event6/800/500',
    status: 'upcoming',
    attendees: 120,
    price: 'Free',
    organizer: 'Environment Committee',
  },
];

const CATEGORIES = ['All', 'Fundraising', 'Education', 'Religious', 'Healthcare', 'Environment'];

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

export default function EventsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = selectedCategory === 'All'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(event => event.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        className="rounded-b-3xl shadow-xl"
        style={{
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60,
          paddingBottom: 24,
        }}
      >
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-xl"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-3xl font-bold">Events</Text>
            <View className="w-10" />
          </View>

          <Text className="text-emerald-50 text-base text-center">
            Discover and join community events
          </Text>
        </View>

        {/* Decorative pattern */}
        <View className="absolute top-0 right-0 opacity-10">
          <Ionicons name="calendar" size={120} color="white" />
        </View>
      </LinearGradient>

      {/* Category filters */}
      <View className="px-5 mb-5 -mt-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-3 px-5 py-3 rounded-2xl ${
                selectedCategory === category
                  ? 'bg-emerald-600 border border-emerald-700'
                  : 'bg-white border border-emerald-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category ? 'text-white' : 'text-emerald-700'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events list */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} asChild>
            <TouchableOpacity
              className="bg-white rounded-3xl mb-5 overflow-hidden border-2 border-emerald-200/60"
              style={{
                shadowColor: '#059669',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {/* Event image with gradient overlay */}
              <View className="relative">
                <Image
                  source={{ uri: event.image }}
                  className="w-full h-52"
                  resizeMode="cover"
                />

                {/* Gradient overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)']}
                  className="absolute bottom-0 left-0 right-0 h-24"
                />

                {/* Category badge */}
                <View
                  className="absolute top-4 right-4 px-4 py-2 rounded-full shadow-lg"
                  style={{
                    backgroundColor: getCategoryColor(event.category),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text className="text-white font-bold text-xs">
                    {event.category}
                  </Text>
                </View>

                {/* Event title on image */}
                <View className="absolute bottom-4 left-4 right-4">
                  <Text
                    style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}
                    numberOfLines={2}
                  >
                    {event.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' }}>
                    <Ionicons name="people" size={14} color="white" />
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 12, marginLeft: 6 }}>
                      {event.attendees} attending
                    </Text>
                  </View>
                </View>
              </View>

              {/* Event details */}
              <View className="p-5">
                {/* Price tag at top */}
                <View className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 self-start mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="pricetag" size={14} color="#059669" />
                    <Text className="text-emerald-700 font-bold text-xs ml-1.5">
                      {event.price}
                    </Text>
                  </View>
                </View>

                <Text className="text-slate-700 mb-4 leading-6" numberOfLines={3}>
                  {event.description}
                </Text>

                {/* Info Cards Row */}
                <View className="flex-row">
                  {/* Date Card */}
                  <View className="flex-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-3 mr-2 border border-emerald-200/50">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="calendar" size={16} color="#059669" />
                      <Text className="text-emerald-600 text-xs font-bold ml-1">Date</Text>
                    </View>
                    <Text className="text-slate-800 font-bold text-xs" numberOfLines={1}>
                      {formatDate(event.date)}
                    </Text>
                    <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
                      {event.time.split(' - ')[0]}
                    </Text>
                  </View>

                  {/* Location Card */}
                  <View className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-3 ml-2 border border-purple-200/50">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="location" size={16} color="#8B5CF6" />
                      <Text className="text-purple-600 text-xs font-bold ml-1">Location</Text>
                    </View>
                    <Text className="text-slate-800 font-bold text-xs" numberOfLines={2}>
                      {event.location}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}

        {filteredEvents.length === 0 && (
          <View className="items-center justify-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg mt-4">
              No events found in this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
