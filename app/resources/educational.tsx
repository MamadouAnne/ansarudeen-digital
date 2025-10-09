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

export default function EducationalScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'arabic', name: 'Arabic', icon: 'language' as keyof typeof Ionicons.glyphMap },
    { id: 'history', name: 'History', icon: 'time' as keyof typeof Ionicons.glyphMap },
    { id: 'courses', name: 'Courses', icon: 'school' as keyof typeof Ionicons.glyphMap },
    { id: 'books', name: 'Books', icon: 'book' as keyof typeof Ionicons.glyphMap },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Arabic for Beginners - Level 1',
      titleArabic: 'العربية للمبتدئين - المستوى الأول',
      description: 'Complete course for learning Arabic from scratch',
      type: 'video',
      category: 'arabic',
      duration: '3:45:20',
      downloads: 892,
    },
    {
      id: '2',
      title: 'Islamic History Timeline',
      titleArabic: 'الجدول الزمني للتاريخ الإسلامي',
      description: 'Comprehensive timeline of Islamic civilization',
      type: 'pdf',
      category: 'history',
      fileSize: '5.2 MB',
      downloads: 445,
    },
    {
      id: '3',
      title: 'Arabic Grammar Essentials',
      titleArabic: 'أساسيات النحو العربي',
      description: 'Master the fundamentals of Arabic grammar',
      type: 'pdf',
      category: 'arabic',
      fileSize: '4.1 MB',
      downloads: 623,
    },
    {
      id: '4',
      title: 'The Golden Age of Islam',
      titleArabic: 'العصر الذهبي للإسلام',
      description: 'Explore the achievements of Islamic civilization',
      type: 'video',
      category: 'history',
      duration: '1:28:15',
      downloads: 334,
    },
    {
      id: '5',
      title: 'Islamic Finance Course',
      titleArabic: 'دورة التمويل الإسلامي',
      description: 'Learn the principles of halal financial practices',
      type: 'video',
      category: 'courses',
      duration: '2:34:50',
      downloads: 567,
    },
    {
      id: '6',
      title: 'Selected Islamic Texts',
      titleArabic: 'نصوص إسلامية مختارة',
      description: 'Collection of important Islamic literature',
      type: 'pdf',
      category: 'books',
      fileSize: '12.3 MB',
      downloads: 234,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return 'musical-notes';
      case 'video': return 'videocam';
      case 'pdf': return 'document';
      case 'link': return 'link';
      default: return 'document';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return '#8B5CF6';
      case 'video': return '#EF4444';
      case 'pdf': return '#F59E0B';
      case 'link': return '#06B6D4';
      default: return '#6B7280';
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

      <LinearGradient
        colors={['#1E40AF', '#2563EB', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop }}
        className="pb-6"
      >
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="school" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Educational Materials</Text>
          <Text className="text-blue-100 text-lg font-semibold">مواد تعليمية</Text>
        </View>
      </LinearGradient>

      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search educational materials..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
                  ? 'bg-blue-600 border border-blue-700'
                  : 'bg-white border border-blue-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category.id ? 'text-white' : 'text-blue-700'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {filteredResources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <View className="flex-row items-start">
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

              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-base mb-1">
                  {resource.title}
                </Text>
                {resource.titleArabic && (
                  <Text className="text-blue-600 font-semibold text-sm mb-2">
                    {resource.titleArabic}
                  </Text>
                )}
                <Text className="text-slate-600 text-sm mb-3">
                  {resource.description}
                </Text>

                <View className="flex-row items-center gap-4">
                  {resource.duration && (
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs ml-1">{resource.duration}</Text>
                    </View>
                  )}
                  {resource.fileSize && (
                    <View className="flex-row items-center">
                      <Ionicons name="document-outline" size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs ml-1">{resource.fileSize}</Text>
                    </View>
                  )}
                  {resource.downloads && (
                    <View className="flex-row items-center">
                      <Ionicons name="download-outline" size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs ml-1">{resource.downloads}</Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center ml-2">
                <Ionicons name="download" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
