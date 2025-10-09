import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Resource {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  type: 'audio' | 'video' | 'pdf' | 'link';
  category: string;
  url?: string;
  fileSize?: string;
  duration?: string;
  downloads?: number;
}

export default function IslamicKnowledgeScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'quran', name: 'Quran', icon: 'book' as keyof typeof Ionicons.glyphMap },
    { id: 'hadith', name: 'Hadith', icon: 'document-text' as keyof typeof Ionicons.glyphMap },
    { id: 'tafsir', name: 'Tafsir', icon: 'reader' as keyof typeof Ionicons.glyphMap },
    { id: 'lectures', name: 'Lectures', icon: 'mic' as keyof typeof Ionicons.glyphMap },
  ];

  // Sample data - will be replaced with actual data from database
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Tafsir Surah Al-Fatiha',
      titleArabic: 'تفسير سورة الفاتحة',
      description: 'Complete explanation of the opening chapter of the Quran',
      type: 'video',
      category: 'tafsir',
      duration: '45:30',
      downloads: 234,
    },
    {
      id: '2',
      title: 'Sahih Bukhari - Chapter on Faith',
      titleArabic: 'صحيح البخاري - كتاب الإيمان',
      description: 'Collection of authentic Hadith on faith and belief',
      type: 'pdf',
      category: 'hadith',
      fileSize: '2.4 MB',
      downloads: 189,
    },
    {
      id: '3',
      title: 'Quran Recitation - Juz Amma',
      titleArabic: 'تلاوة القرآن - جزء عم',
      description: 'Beautiful recitation of the 30th part of the Quran',
      type: 'audio',
      category: 'quran',
      duration: '1:23:45',
      downloads: 567,
    },
    {
      id: '4',
      title: 'The Importance of Prayer in Islam',
      titleArabic: 'أهمية الصلاة في الإسلام',
      description: 'Weekly lecture on the significance of Salah',
      type: 'video',
      category: 'lectures',
      duration: '52:15',
      downloads: 421,
    },
    {
      id: '5',
      title: 'Understanding Tawheed',
      titleArabic: 'فهم التوحيد',
      description: 'Fundamental principles of Islamic monotheism explained',
      type: 'video',
      category: 'lectures',
      duration: '38:22',
      downloads: 312,
    },
    {
      id: '6',
      title: 'Tafsir Surah Al-Baqarah',
      titleArabic: 'تفسير سورة البقرة',
      description: 'Detailed commentary on the longest chapter of the Quran',
      type: 'pdf',
      category: 'tafsir',
      fileSize: '8.5 MB',
      downloads: 445,
    },
    {
      id: '7',
      title: 'Riyad as-Salihin',
      titleArabic: 'رياض الصالحين',
      description: 'The Gardens of the Righteous - compilation of Hadith',
      type: 'pdf',
      category: 'hadith',
      fileSize: '3.2 MB',
      downloads: 678,
    },
    {
      id: '8',
      title: 'Quran Recitation - Surah Yaseen',
      titleArabic: 'تلاوة سورة يس',
      description: 'Beautiful recitation of the heart of the Quran',
      type: 'audio',
      category: 'quran',
      duration: '18:45',
      downloads: 892,
    },
    {
      id: '9',
      title: 'Stories of the Prophets',
      titleArabic: 'قصص الأنبياء',
      description: 'Inspiring stories from the lives of the Prophets',
      type: 'video',
      category: 'lectures',
      duration: '2:15:30',
      downloads: 534,
    },
    {
      id: '10',
      title: 'The Life of Prophet Muhammad',
      titleArabic: 'سيرة النبي محمد',
      description: 'Complete biography of the final messenger',
      type: 'pdf',
      category: 'hadith',
      fileSize: '6.7 MB',
      downloads: 721,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return 'musical-notes';
      case 'video':
        return 'videocam';
      case 'pdf':
        return 'document';
      case 'link':
        return 'link';
      default:
        return 'document';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio':
        return '#8B5CF6';
      case 'video':
        return '#EF4444';
      case 'pdf':
        return '#F59E0B';
      case 'link':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  const filteredResources = resources.filter(
    (resource) =>
      (selectedCategory === 'all' || resource.category === selectedCategory) &&
      (searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.titleArabic?.includes(searchQuery))
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#065f46', '#047857', '#059669']}
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
              <Ionicons name="book" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Islamic Knowledge</Text>
          <Text className="text-emerald-100 text-lg font-semibold">علم إسلامي</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search resources..."
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

      {/* Category Filter */}
      <View className="px-4 py-3 bg-white border-b border-slate-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mr-3 px-5 py-3 rounded-2xl ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 border border-emerald-700'
                  : 'bg-white border border-emerald-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category.id ? 'text-white' : 'text-emerald-700'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resources List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {filteredResources.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="search-outline" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg mt-4">No resources found</Text>
          </View>
        ) : (
          filteredResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start">
                {/* Type Icon */}
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: `${getTypeColor(resource.type)}20` }}
                >
                  <Ionicons
                    name={getTypeIcon(resource.type) as any}
                    size={24}
                    color={getTypeColor(resource.type)}
                  />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-base mb-1">
                    {resource.title}
                  </Text>
                  {resource.titleArabic && (
                    <Text className="text-emerald-600 font-semibold text-sm mb-2">
                      {resource.titleArabic}
                    </Text>
                  )}
                  <Text className="text-slate-600 text-sm mb-3" numberOfLines={2}>
                    {resource.description}
                  </Text>

                  {/* Meta Info */}
                  <View className="flex-row items-center gap-4">
                    {resource.duration && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#64748B" />
                        <Text className="text-slate-500 text-xs ml-1">
                          {resource.duration}
                        </Text>
                      </View>
                    )}
                    {resource.fileSize && (
                      <View className="flex-row items-center">
                        <Ionicons name="document-outline" size={14} color="#64748B" />
                        <Text className="text-slate-500 text-xs ml-1">
                          {resource.fileSize}
                        </Text>
                      </View>
                    )}
                    {resource.downloads && (
                      <View className="flex-row items-center">
                        <Ionicons name="download-outline" size={14} color="#64748B" />
                        <Text className="text-slate-500 text-xs ml-1">
                          {resource.downloads}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                  className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center ml-2"
                  onPress={() => {
                    // Handle download/view action
                  }}
                >
                  <Ionicons name="download" size={20} color="#059669" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
