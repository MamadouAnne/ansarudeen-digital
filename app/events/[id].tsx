import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  title_arabic: string;
  description: string;
  full_description: string;
  date: string;
  time: string;
  location: string;
  location_arabic: string;
  address: string;
  category: string;
  status: string;
  attendees: number;
  capacity: number;
  price: string;
  organizer: string;
  contact_email: string;
  contact_phone: string;
  image?: string;
  images?: string[];
}

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
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEvent();
      checkRegistrationStatus();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);

      // Fetch event data with all media in a single query
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          event_media(uri, is_primary, display_order)
        `)
        .eq('id', id)
        .single();

      if (eventError) throw eventError;

      // Extract images from the joined data
      const mediaData = eventData.event_media || [];
      const primaryImage = mediaData.find((m: any) => m.is_primary)?.uri || mediaData[0]?.uri;
      const galleryImages = mediaData.filter((m: any) => !m.is_primary).map((m: any) => m.uri);

      setEvent({
        ...eventData,
        image: primaryImage,
        images: galleryImages,
        event_media: undefined, // Remove nested data
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('event_registrations')
        .select('status')
        .eq('event_id', id)
        .eq('user_id', user.supabaseUser.id)
        .eq('status', 'registered')
        .single();

      setIsRegistered(!!data);
    } catch (error) {
      // User not registered - this is fine
      setIsRegistered(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to register for events');
      return;
    }

    if (isRegistered) {
      Alert.alert(
        'Cancel Registration',
        'Are you sure you want to cancel your registration for this event?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                const { error } = await supabase
                  .from('event_registrations')
                  .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
                  .eq('event_id', id)
                  .eq('user_id', user.supabaseUser.id);

                if (error) throw error;

                setIsRegistered(false);
                Alert.alert('Success', 'Your registration has been cancelled.');
                fetchEvent(); // Refresh to update attendee count
              } catch (error) {
                console.error('Error cancelling registration:', error);
                Alert.alert('Error', 'Failed to cancel registration');
              }
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Register for Event',
        `Confirm your registration for "${event?.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Register',
            onPress: async () => {
              try {
                // First check if a registration already exists
                const { data: existingReg } = await supabase
                  .from('event_registrations')
                  .select('id, status')
                  .eq('event_id', id)
                  .eq('user_id', user.supabaseUser.id)
                  .single();

                let error;

                if (existingReg) {
                  // Update existing registration
                  const result = await supabase
                    .from('event_registrations')
                    .update({
                      status: 'registered',
                      cancelled_at: null
                    })
                    .eq('id', existingReg.id);
                  error = result.error;
                } else {
                  // Insert new registration
                  const result = await supabase
                    .from('event_registrations')
                    .insert({
                      event_id: id,
                      user_id: user.supabaseUser.id,
                      status: 'registered',
                    });
                  error = result.error;
                }

                if (error) throw error;

                setIsRegistered(true);
                Alert.alert('Success', 'You have been registered for this event!');
                fetchEvent(); // Refresh to update attendee count
              } catch (error) {
                console.error('Error registering for event:', error);
                Alert.alert('Error', 'Failed to register for event');
              }
            }
          }
        ]
      );
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n${event.description}\n\nDate: ${formatDate(event.date)}\nTime: ${event.time}\nLocation: ${event.location}`,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-slate-500 mt-4">Loading event...</Text>
      </View>
    );
  }

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
