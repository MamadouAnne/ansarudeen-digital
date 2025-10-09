import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ResourceCategory {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradientColors: [string, string, string];
  route: string;
}

const resourceCategories: ResourceCategory[] = [
  {
    id: 'islamic-knowledge',
    title: 'Islamic Knowledge',
    titleArabic: 'علم إسلامي',
    description: 'Quran, Hadith, Tafsir & Lectures',
    icon: 'book',
    color: '#059669',
    gradientColors: ['#065f46', '#047857', '#059669'],
    route: '/resources/islamic-knowledge',
  },
  {
    id: 'educational',
    title: 'Educational Materials',
    titleArabic: 'مواد تعليمية',
    description: 'Arabic learning, History & Courses',
    icon: 'school',
    color: '#3B82F6',
    gradientColors: ['#1E40AF', '#2563EB', '#3B82F6'],
    route: '/resources/educational',
  },
  {
    id: 'community',
    title: 'Community Learning',
    titleArabic: 'تعلم المجتمع',
    description: 'Workshops, Training & Programs',
    icon: 'people',
    color: '#8B5CF6',
    gradientColors: ['#6D28D9', '#7C3AED', '#8B5CF6'],
    route: '/resources/community',
  },
  {
    id: 'documents',
    title: 'Documents & Forms',
    titleArabic: 'وثائق ونماذج',
    description: 'Applications, Policies & Reports',
    icon: 'document-text',
    color: '#F59E0B',
    gradientColors: ['#D97706', '#F59E0B', '#FBBF24'],
    route: '/resources/documents',
  },
  {
    id: 'media',
    title: 'Media Library',
    titleArabic: 'مكتبة الوسائط',
    description: 'Photos, Videos & Newsletters',
    icon: 'images',
    color: '#EF4444',
    gradientColors: ['#DC2626', '#EF4444', '#F87171'],
    route: '/resources/media',
  },
  {
    id: 'spiritual',
    title: 'Spiritual Resources',
    titleArabic: 'موارد روحية',
    description: 'Dhikr, Prayers & Supplications',
    icon: 'moon',
    color: '#10B981',
    gradientColors: ['#059669', '#10B981', '#34D399'],
    route: '/resources/spiritual',
  },
  {
    id: 'downloads',
    title: 'Downloads',
    titleArabic: 'التحميلات',
    description: 'Wallpapers, Art & Directories',
    icon: 'download',
    color: '#06B6D4',
    gradientColors: ['#0891B2', '#06B6D4', '#22D3EE'],
    route: '/resources/downloads',
  },
];

export default function ResourcesScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;

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
        {/* Decorative Islamic pattern */}
        <View className="absolute inset-0 opacity-10">
          <View className="absolute top-4 right-4 w-24 h-24 border-4 border-white rounded-full" />
          <View className="absolute top-12 right-12 w-16 h-16 border-4 border-white rounded-full" />
          <View className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
        </View>

        <View className="px-6 relative z-10">
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Resources</Text>
          <Text className="text-emerald-100 text-lg font-semibold mb-1">موارد المجتمع</Text>
          <Text className="text-emerald-50 text-sm">
            Explore our collection of Islamic and community resources
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {resourceCategories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => router.push(category.route as any)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={category.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl p-6 shadow-lg"
              style={{
                shadowColor: category.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {/* Decorative pattern */}
              <View className="absolute inset-0 opacity-10 overflow-hidden rounded-3xl">
                <View className="absolute -top-4 -right-4 w-24 h-24 border-4 border-white rounded-full" />
                <View className="absolute -bottom-4 -left-4 w-28 h-28 border-4 border-white rounded-full" />
              </View>

              <View className="flex-row items-center relative z-10">
                {/* Icon */}
                <View className="w-16 h-16 bg-white/25 rounded-xl items-center justify-center mr-4 border-2 border-white/30">
                  <Ionicons name={category.icon} size={32} color="#fff" />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text className="text-white text-xl font-extrabold mb-1">
                    {category.title}
                  </Text>
                  <Text className="text-white/90 text-sm font-semibold mb-1">
                    {category.titleArabic}
                  </Text>
                  <Text className="text-white/80 text-sm">
                    {category.description}
                  </Text>
                </View>

                {/* Arrow */}
                <View className="w-10 h-10 bg-white/25 rounded-full items-center justify-center ml-2">
                  <Ionicons name="chevron-forward" size={22} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* Bottom Spacing */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
