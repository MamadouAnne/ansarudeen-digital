import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MediaItem {
  id: string;
  title: string;
  titleArabic: string;
  type: 'photo' | 'video' | 'newsletter';
  thumbnail: string;
  count?: number;
  duration?: string;
  date?: string;
  views: number;
}

export default function MediaScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const types = [
    { id: 'all', name: 'All', icon: 'apps' as keyof typeof Ionicons.glyphMap },
    { id: 'photo', name: 'Photos', icon: 'images' as keyof typeof Ionicons.glyphMap },
    { id: 'video', name: 'Videos', icon: 'videocam' as keyof typeof Ionicons.glyphMap },
    { id: 'newsletter', name: 'Newsletters', icon: 'newspaper' as keyof typeof Ionicons.glyphMap },
  ];

  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Ramadan 2024 Gallery',
      titleArabic: 'معرض رمضان 2024',
      type: 'photo',
      count: 45,
      thumbnail: 'https://picsum.photos/seed/ramadan2024/800/600',
      views: 1234,
    },
    {
      id: '2',
      title: 'Community Iftar Highlights',
      titleArabic: 'أبرز إفطار المجتمع',
      type: 'video',
      duration: '5:32',
      thumbnail: 'https://picsum.photos/seed/iftar2024/800/600',
      views: 892,
    },
    {
      id: '3',
      title: 'Monthly Newsletter - March 2024',
      titleArabic: 'النشرة الشهرية - مارس 2024',
      type: 'newsletter',
      date: 'March 2024',
      thumbnail: 'https://picsum.photos/seed/newsletter-mar/800/600',
      views: 567,
    },
    {
      id: '4',
      title: 'Eid Celebration 2024',
      titleArabic: 'احتفال العيد 2024',
      type: 'photo',
      count: 67,
      thumbnail: 'https://picsum.photos/seed/eid2024/800/600',
      views: 2156,
    },
    {
      id: '5',
      title: 'Friday Prayer Khutbah',
      titleArabic: 'خطبة صلاة الجمعة',
      type: 'video',
      duration: '18:45',
      thumbnail: 'https://picsum.photos/seed/khutbah/800/600',
      views: 1567,
    },
    {
      id: '6',
      title: 'Youth Program Recap',
      titleArabic: 'ملخص برنامج الشباب',
      type: 'video',
      duration: '8:22',
      thumbnail: 'https://picsum.photos/seed/youth-program/800/600',
      views: 734,
    },
    {
      id: '7',
      title: 'Annual Report Newsletter 2023',
      titleArabic: 'نشرة التقرير السنوي 2023',
      type: 'newsletter',
      date: 'January 2024',
      thumbnail: 'https://picsum.photos/seed/annual-report/800/600',
      views: 923,
    },
    {
      id: '8',
      title: 'Community Service Day',
      titleArabic: 'يوم الخدمة المجتمعية',
      type: 'photo',
      count: 38,
      thumbnail: 'https://picsum.photos/seed/service-day/800/600',
      views: 645,
    },
  ];

  const filteredMedia = mediaItems.filter(
    (item) =>
      (selectedType === 'all' || item.type === selectedType) &&
      (searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.titleArabic.includes(searchQuery))
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return 'images';
      case 'video': return 'videocam';
      case 'newsletter': return 'newspaper';
      default: return 'document';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return '#EF4444';
      case 'video': return '#8B5CF6';
      case 'newsletter': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#DC2626', '#EF4444', '#F87171'] as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop }}
        className="pb-6"
      >
        <View className="absolute inset-0 opacity-10">
          <View className="absolute top-4 right-4 w-24 h-24 border-4 border-white rounded-full" />
          <View className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
        </View>

        <View className="px-6 relative z-10">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="images" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Media Library</Text>
          <Text className="text-red-100 text-lg font-semibold">مكتبة الوسائط</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search media..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Type Filter */}
      <View className="px-4 py-3 bg-white border-b border-slate-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {types.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`mr-3 px-5 py-3 rounded-2xl ${
                selectedType === type.id
                  ? 'bg-red-600 border border-red-700'
                  : 'bg-white border border-red-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedType === type.id ? 'text-white' : 'text-red-700'
                }`}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Media Grid */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {filteredMedia.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="images-outline" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg mt-4">No media found</Text>
          </View>
        ) : (
          filteredMedia.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
              activeOpacity={0.7}
            >
              {/* Thumbnail */}
              <View className="relative">
                <Image
                  source={{ uri: item.thumbnail }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                {/* Gradient Overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)'] as [string, string]}
                  className="absolute bottom-0 left-0 right-0 h-20"
                />
                {/* Type Badge */}
                <View
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full flex-row items-center"
                  style={{ backgroundColor: getTypeColor(item.type) }}
                >
                  <Ionicons name={getTypeIcon(item.type) as any} size={14} color="#fff" />
                  <Text className="text-white font-bold text-xs ml-1.5">
                    {item.count ? `${item.count} photos` : item.duration || item.date}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View className="p-4">
                <Text className="text-slate-900 font-bold text-base mb-1">
                  {item.title}
                </Text>
                <Text className="text-red-600 font-semibold text-sm mb-3">
                  {item.titleArabic}
                </Text>

                {/* Meta Info */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="eye-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-1.5">
                      {item.views} views
                    </Text>
                  </View>
                  <View className="bg-red-100 px-3 py-1.5 rounded-full">
                    <Text className="text-red-600 font-bold text-xs">
                      View {item.type === 'photo' ? 'Gallery' : item.type === 'video' ? 'Video' : 'Newsletter'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
