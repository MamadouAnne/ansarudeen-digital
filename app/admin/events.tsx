import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StatusBar, Platform, ActivityIndicator, Modal, Image, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  capacity: number;
  price: string;
  organizer: string;
  contact_email: string;
  contact_phone: string;
  featured: boolean;
}

export default function AdminEventsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [activeField, setActiveField] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    description: '',
    full_description: '',
    date: '',
    time: '',
    location: '',
    location_arabic: '',
    address: '',
    category: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
    capacity: 100,
    price: 'Free',
    organizer: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setCheckingAuth(true);

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        Alert.alert('Access Denied', 'Please sign in to access this page', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();

      if (error || profile?.role !== 'admin') {
        Alert.alert('Access Denied', 'You do not have permission to access this page', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      setCheckingAuth(false);
      loadEvents();
    } catch (error) {
      console.error('Exception in checkAdminAccess:', error);
      Alert.alert('Error', 'An error occurred', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
      ]);
      setCheckingAuth(false);
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, title_arabic, description, full_description, date, time, location, location_arabic, address, category, status, attendees, capacity, price, organizer, contact_email, contact_phone, featured')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);

      // Load categories
      const uniqueCategories = Array.from(
        new Set(data?.map(event => event.category) || [])
      ).sort();
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);
      setSelectedImages([...selectedImages, ...uris]);
    }
  };

  const uploadImages = async (eventId: number) => {
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const uri = selectedImages[i];
        const filename = `event_${eventId}_${Date.now()}_${i}.jpg`;

        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from('event-media')
          .upload(filename, arrayBuffer, {
            contentType: 'image/jpeg',
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('event-media')
          .getPublicUrl(filename);

        // Insert into event_media table
        const { error: dbError } = await supabase
          .from('event_media')
          .insert({
            event_id: eventId,
            type: 'image',
            uri: publicUrl,
            is_primary: i === 0,
            display_order: i + 1,
          });

        if (dbError) throw dbError;
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleAddEvent = async () => {
    try {
      if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Create a clean event object without any id field
      const eventData = {
        title: formData.title,
        title_arabic: formData.title_arabic,
        description: formData.description,
        full_description: formData.full_description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        location_arabic: formData.location_arabic,
        address: formData.address,
        category: formData.category,
        status: formData.status,
        capacity: formData.capacity,
        price: formData.price,
        organizer: formData.organizer,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        attendees: 0,
      };

      console.log('Inserting event data:', eventData);

      const { data, error } = await supabase
        .from('events')
        // @ts-ignore - Supabase type inference issue
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      if (selectedImages.length > 0 && data) {
        await uploadImages(data.id);
      }

      Alert.alert('Success', 'Event created successfully');
      setShowAddModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      if (!selectedEvent) return;

      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', selectedEvent.id);

      if (error) throw error;

      if (selectedImages.length > 0) {
        await uploadImages(selectedEvent.id);
      }

      Alert.alert('Success', 'Event updated successfully');
      setShowEditModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId);

              if (error) throw error;
              Alert.alert('Success', 'Event deleted successfully');
              loadEvents();
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          }
        }
      ]
    );
  };

  const handleUpdateStatus = async (eventId: number, newStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('events')
        // @ts-ignore - Supabase type inference issue
        .update({ status: newStatus })
        .eq('id', eventId);

      if (error) throw error;
      Alert.alert('Success', 'Status updated successfully');
      loadEvents();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        // @ts-ignore - Supabase type inference issue
        .update({ featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      Alert.alert('Success', `${!currentStatus ? 'Featured' : 'Unfeatured'} successfully`);
      loadEvents();
    } catch (error) {
      console.error('Error toggling featured:', error);
      Alert.alert('Error', 'Failed to update featured status');
    }
  };

  const handleShareToMessages = async (event: Event) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to share messages.');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', currentUser.id)
        .single();

      const { error } = await supabase
        .from('messages')
        .insert({
          title: `Upcoming Event: ${event.title}`,
          content: `Join us for ${event.title} on ${event.date} at ${event.time}. Location: ${event.location}`,
          category: 'event',
          priority: 'high',
          sender_id: currentUser.id,
          sender_name: (profile as any)?.full_name || 'Admin',
          sender_role: 'Administrator',
          published_at: new Date().toISOString(),
          is_published: true,
          event_id: event.id,
        } as any);

      if (error) throw error;

      Alert.alert('Success!', 'Event has been shared to the Messages chat screen.', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Error sharing to messages:', error);
      Alert.alert('Error', 'Failed to share event to messages.');
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      title_arabic: event.title_arabic,
      description: event.description,
      full_description: event.full_description,
      date: event.date,
      time: event.time,
      location: event.location,
      location_arabic: event.location_arabic,
      address: event.address,
      category: event.category,
      status: event.status,
      capacity: event.capacity,
      price: event.price,
      organizer: event.organizer,
      contact_email: event.contact_email,
      contact_phone: event.contact_phone,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_arabic: '',
      description: '',
      full_description: '',
      date: '',
      time: '',
      location: '',
      location_arabic: '',
      address: '',
      category: '',
      status: 'upcoming',
      capacity: 100,
      price: 'Free',
      organizer: '',
      contact_email: '',
      contact_phone: '',
    });
    setSelectedImages([]);
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setCustomCategory('');
    setShowCategoryDropdown(false);
    setStartTime(new Date());
    setEndTime(new Date());
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  };

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
    if (Platform.OS === 'android') {
      setActiveField(null);
    }
  };

  const handleStartTimeChange = (_event: any, time?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (time) {
      setStartTime(time);
      updateTimeRange(time, endTime);
    }
    if (Platform.OS === 'android') {
      setActiveField(null);
    }
  };

  const handleEndTimeChange = (_event: any, time?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (time) {
      setEndTime(time);
      updateTimeRange(startTime, time);
    }
    if (Platform.OS === 'android') {
      setActiveField(null);
    }
  };

  const openStartTimePicker = () => {
    setShowEndTimePicker(false);
    setActiveField('startTime');
    setShowStartTimePicker(true);
  };

  const openEndTimePicker = () => {
    setShowStartTimePicker(false);
    setActiveField('endTime');
    setShowEndTimePicker(true);
  };

  const updateTimeRange = (start: Date, end: Date) => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    const timeRange = `${formatTime(start)} - ${formatTime(end)}`;
    setFormData(prev => ({ ...prev, time: timeRange }));
  };

  const EventForm = useMemo(() => (
    <ScrollView className="p-6" contentContainerStyle={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60, paddingBottom: 100 }}>
      <Text className="text-slate-800 font-bold mb-2">Title *</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
        placeholder="Event Title"
      />

      <Text className="text-slate-800 font-bold mb-2">Arabic Title</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.title_arabic}
        onChangeText={(text) => setFormData({ ...formData, title_arabic: text })}
        placeholder="العنوان بالعربية (optional)"
      />

      <Text className="text-slate-800 font-bold mb-2">Short Description *</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Brief description"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text className="text-slate-800 font-bold mb-2">Full Description *</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.full_description}
        onChangeText={(text) => setFormData({ ...formData, full_description: text })}
        placeholder="Detailed description"
        multiline
        numberOfLines={10}
        style={{ minHeight: 200, maxHeight: 300 }}
        textAlignVertical="top"
        scrollEnabled={true}
      />

      <Text className="text-slate-800 font-bold mb-2">Date *</Text>
      <TouchableOpacity
        className={`border-2 rounded-xl px-4 py-3 mb-4 ${activeField === 'date' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'}`}
        onPress={() => {
          setActiveField('date');
          setShowDatePicker(true);
        }}
      >
        <Text className={activeField === 'date' ? 'text-emerald-700 font-semibold' : 'text-slate-800'}>
          {formData.date || 'Select Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
          {Platform.OS === 'ios' && (
            <View className="flex-row mb-4 space-x-2">
              <TouchableOpacity
                className="bg-red-500 py-3 rounded-xl flex-1 mr-2"
                onPress={() => {
                  setShowDatePicker(false);
                  setActiveField(null);
                }}
              >
                <Text className="text-white text-center font-bold">✕ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-emerald-600 py-3 rounded-xl flex-1"
                onPress={() => {
                  setShowDatePicker(false);
                  setActiveField(null);
                }}
              >
                <Text className="text-white text-center font-bold">✓ Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <Text className="text-slate-800 font-bold mb-2">Time *</Text>
      <View className="flex-row mb-4 space-x-2">
        <View className="flex-1 mr-2">
          <Text className="text-slate-600 text-xs mb-1">Start Time</Text>
          <TouchableOpacity
            className={`border-2 rounded-xl px-4 py-3 ${activeField === 'startTime' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'}`}
            onPress={openStartTimePicker}
          >
            <Text className={activeField === 'startTime' ? 'text-emerald-700 font-semibold' : 'text-slate-800'}>
              {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Text className="text-slate-600 text-xs mb-1">End Time</Text>
          <TouchableOpacity
            className={`border-2 rounded-xl px-4 py-3 ${activeField === 'endTime' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'}`}
            onPress={openEndTimePicker}
          >
            <Text className={activeField === 'endTime' ? 'text-emerald-700 font-semibold' : 'text-slate-800'}>
              {endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartTimePicker && (
        <>
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartTimeChange}
          />
          {Platform.OS === 'ios' && (
            <View className="flex-row mb-4 space-x-2">
              <TouchableOpacity
                className="bg-red-500 py-3 rounded-xl flex-1 mr-2"
                onPress={() => {
                  setShowStartTimePicker(false);
                  setActiveField(null);
                }}
              >
                <Text className="text-white text-center font-bold">✕ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-emerald-600 py-3 rounded-xl flex-1"
                onPress={() => {
                  setShowStartTimePicker(false);
                  setActiveField(null);
                }}
              >
                <Text className="text-white text-center font-bold">✓ Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {showEndTimePicker && (
        <>
          <DateTimePicker
            value={endTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndTimeChange}
          />
          {Platform.OS === 'ios' && (
            <View className="flex-row mb-4 space-x-2">
              <TouchableOpacity
                className="bg-red-500 py-3 rounded-xl flex-1 mr-2"
                onPress={() => {
                  setShowEndTimePicker(false);
                  setActiveField(null);
                }}
              >
                <Text className="text-white text-center font-bold">✕ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-emerald-600 py-3 rounded-xl flex-1"
                onPress={() => {
                  setShowEndTimePicker(false);
                  setActiveField(null);
                }}
              >
                <Text className="text-white text-center font-bold">✓ Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <Text className="text-slate-800 font-bold mb-2">Location (City, Country) *</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
        placeholder="e.g. Lagos, Nigeria"
      />

      <Text className="text-slate-800 font-bold mb-2">Venue/Address *</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
        placeholder="Venue name or full address"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
      />

      <Text className="text-slate-800 font-bold mb-2">Category *</Text>

      {/* Category Selection */}
      <View className="mb-4">
        <TouchableOpacity
          className={`border-2 rounded-xl px-4 py-3 mb-2 ${activeField === 'category' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'}`}
          onPress={() => {
            setActiveField('category');
            setShowCategoryDropdown(!showCategoryDropdown);
          }}
        >
          <Text className={activeField === 'category' ? 'text-emerald-700 font-semibold' : 'text-slate-800'}>
            {formData.category || 'Select Category'}
          </Text>
        </TouchableOpacity>

        {showCategoryDropdown && (
          <View className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                className="px-4 py-3 border-b border-slate-100"
                onPress={() => {
                  setFormData({ ...formData, category: cat });
                  setShowCategoryDropdown(false);
                  setCustomCategory('');
                  setActiveField(null);
                }}
              >
                <Text className="text-slate-800">{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="px-4 py-3 bg-emerald-50"
              onPress={() => {
                setFormData({ ...formData, category: '' });
                setShowCategoryDropdown(false);
                setCustomCategory('custom');
              }}
            >
              <Text className="text-emerald-700 font-bold">+ Custom Category</Text>
            </TouchableOpacity>
          </View>
        )}

        {customCategory === 'custom' && (
          <TextInput
            className="bg-slate-50 border border-emerald-300 rounded-xl px-4 py-3 text-slate-800"
            value={formData.category}
            onChangeText={(text) => {
              setFormData({ ...formData, category: text });
            }}
            placeholder="Enter custom category"
            autoFocus
          />
        )}
      </View>

      <Text className="text-slate-800 font-bold mb-2">Capacity *</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.capacity.toString()}
        onChangeText={(text) => setFormData({ ...formData, capacity: parseInt(text) || 0 })}
        placeholder="100"
        keyboardType="numeric"
      />

      <Text className="text-slate-800 font-bold mb-2">Price</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        placeholder="Free or $10"
      />

      <Text className="text-slate-800 font-bold mb-2">Organizer</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.organizer}
        onChangeText={(text) => setFormData({ ...formData, organizer: text })}
        placeholder="Organization Name"
      />

      <Text className="text-slate-800 font-bold mb-2">Contact Email</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.contact_email}
        onChangeText={(text) => setFormData({ ...formData, contact_email: text })}
        placeholder="contact@email.com"
        keyboardType="email-address"
      />

      <Text className="text-slate-800 font-bold mb-2">Contact Phone</Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-slate-800"
        value={formData.contact_phone}
        onChangeText={(text) => setFormData({ ...formData, contact_phone: text })}
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
      />


      <TouchableOpacity
        className="bg-purple-600 py-3 rounded-xl mb-4"
        onPress={pickImages}
      >
        <Text className="text-white text-center font-bold">
          {selectedImages.length > 0 ? `${selectedImages.length} Images Selected` : 'Pick Images'}
        </Text>
      </TouchableOpacity>

      {selectedImages.length > 0 && (
        <ScrollView horizontal className="mb-4">
          {selectedImages.map((uri, index) => (
            <View key={index} className="mr-2">
              <Image source={{ uri }} className="w-24 h-24 rounded-xl" />
              <TouchableOpacity
                className="absolute top-1 right-1 bg-red-600 rounded-full p-1"
                onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
              >
                <Text className="text-white text-xs px-1">✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View className="flex-row justify-between mb-8">
        <TouchableOpacity
          className="bg-red-500 py-4 px-6 rounded-xl flex-1 mr-2"
          onPress={() => {
            showAddModal ? setShowAddModal(false) : setShowEditModal(false);
            resetForm();
          }}
        >
          <Text className="text-white text-center font-bold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-emerald-600 py-4 px-6 rounded-xl flex-1 ml-2"
          onPress={showAddModal ? handleAddEvent : handleUpdateEvent}
        >
          <Text className="text-white text-center font-bold">
            {showAddModal ? 'Create Event' : 'Update Event'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ), [formData, selectedImages, showAddModal, selectedEvent, showDatePicker, selectedDate, showCategoryDropdown, customCategory, categories, showStartTimePicker, showEndTimePicker, startTime, endTime, activeField]);

  if (checkingAuth || (loading && events.length === 0)) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-slate-500 mt-4">Loading...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        className="rounded-b-3xl shadow-xl"
        style={{
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60,
          paddingBottom: 24,
        }}
      >
        <View className="absolute top-0 right-0 opacity-10" pointerEvents="none">
          <Text className="text-white text-9xl">📅</Text>
        </View>

        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-xl"
            >
              <Text className="text-white text-xl">←</Text>
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Event Management</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Add button pressed');
                resetForm();
                setShowAddModal(true);
                console.log('Modal should be visible:', true);
              }}
              className="bg-white/20 p-2 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="text-white text-xl font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Events List */}
      <ScrollView className="flex-1 px-4 mt-4">
        {events.map((event) => (
          <View
            key={event.id}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-emerald-100"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-xl font-bold text-slate-800 mb-1">{event.title}</Text>
                <Text className="text-sm text-slate-500">{event.title_arabic}</Text>
                <Text className="text-sm text-slate-600 mt-2">{event.description}</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <Text className="text-slate-600 text-sm">📅 {event.date} • {event.time}</Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Text className="text-slate-600 text-sm">📍 {event.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Text className="text-slate-600 text-sm">
                👥 {event.attendees}/{event.capacity} • {event.category} • {event.price}
              </Text>
            </View>

            {/* Status badges */}
            <View className="flex-row mb-3">
              <View className={`px-3 py-1 rounded-full ${
                event.status === 'upcoming' ? 'bg-blue-100' :
                event.status === 'ongoing' ? 'bg-green-100' :
                event.status === 'completed' ? 'bg-gray-100' :
                'bg-red-100'
              }`}>
                <Text className={`text-xs font-bold ${
                  event.status === 'upcoming' ? 'text-blue-700' :
                  event.status === 'ongoing' ? 'text-green-700' :
                  event.status === 'completed' ? 'text-gray-700' :
                  'text-red-700'
                }`}>
                  {event.status.toUpperCase()}
                </Text>
              </View>
              {event.featured && (
                <View className="px-3 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 ml-2">
                  <Text className="text-xs font-extrabold text-amber-700">⭐ FEATURED</Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View className="flex-row space-x-2 mb-2">
              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-xl flex-1 mr-2"
                onPress={() => openEditModal(event)}
              >
                <Text className="text-white text-center font-bold text-sm">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-amber-600 py-2 px-4 rounded-xl flex-1 mr-2"
                onPress={() => {
                  Alert.alert('Update Status', 'Choose new status', [
                    { text: 'Upcoming', onPress: () => handleUpdateStatus(event.id, 'upcoming') },
                    { text: 'Ongoing', onPress: () => handleUpdateStatus(event.id, 'ongoing') },
                    { text: 'Completed', onPress: () => handleUpdateStatus(event.id, 'completed') },
                    { text: 'Cancelled', onPress: () => handleUpdateStatus(event.id, 'cancelled') },
                    { text: 'Dismiss', style: 'destructive' },
                  ]);
                }}
              >
                <Text className="text-white text-center font-bold text-sm">Status</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded-xl flex-1"
                onPress={() => handleDeleteEvent(event.id)}
              >
                <Text className="text-white text-center font-bold text-sm">Delete</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`${event.featured ? 'bg-amber-600' : 'bg-slate-400'} py-2 rounded-lg flex-1 mr-2`}
                onPress={() => handleToggleFeatured(event.id, event.featured)}
              >
                <Text className="text-white text-center font-bold text-sm">
                  {event.featured ? '⭐ Featured' : 'Feature'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShareToMessages(event)}
                className="bg-blue-600 py-2 rounded-lg flex-1"
              >
                <Text className="text-white font-bold text-center text-sm">💬 Share to Messages</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white"
        >
          {EventForm}
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white"
        >
          {EventForm}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
