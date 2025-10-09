import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SpiritualResource {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: string;
  downloads: number;
}

export default function SpiritualScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'dhikr', name: 'Dhikr', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { id: 'prayers', name: 'Prayers', icon: 'moon' as keyof typeof Ionicons.glyphMap },
    { id: 'guides', name: 'Guides', icon: 'book' as keyof typeof Ionicons.glyphMap },
    { id: 'dua', name: "Du'a", icon: 'hand-left' as keyof typeof Ionicons.glyphMap },
  ];

  const spiritualResources: SpiritualResource[] = [
    {
      id: '1',
      title: 'Morning & Evening Adhkar',
      titleArabic: 'أذكار الصباح والمساء',
      description: 'Daily remembrance and supplications for morning and evening',
      icon: 'sunny',
      color: '#F59E0B',
      category: 'dhikr',
      downloads: 2345,
    },
    {
      id: '2',
      title: 'Complete Prayer Guide',
      titleArabic: 'دليل الصلاة الكامل',
      description: 'Step-by-step guide for performing Salah correctly',
      icon: 'moon',
      color: '#8B5CF6',
      category: 'prayers',
      downloads: 1892,
    },
    {
      id: '3',
      title: 'Ramadan Preparation Guide',
      titleArabic: 'دليل التحضير لرمضان',
      description: 'Spiritual and practical preparation for the blessed month',
      icon: 'calendar',
      color: '#10B981',
      category: 'guides',
      downloads: 1567,
    },
    {
      id: '4',
      title: 'Hajj & Umrah Handbook',
      titleArabic: 'دليل الحج والعمرة',
      description: 'Complete guide for performing Hajj and Umrah',
      icon: 'navigate',
      color: '#3B82F6',
      category: 'guides',
      downloads: 987,
    },
    {
      id: '5',
      title: 'Dhikr After Salah',
      titleArabic: 'أذكار بعد الصلاة',
      description: 'Remembrance and supplications after prayer',
      icon: 'star',
      color: '#EF4444',
      category: 'dhikr',
      downloads: 2156,
    },
    {
      id: '6',
      title: "Du'a for Every Occasion",
      titleArabic: 'دعاء لكل مناسبة',
      description: 'Collection of authentic supplications for various situations',
      icon: 'hand-left',
      color: '#06B6D4',
      category: 'dua',
      downloads: 1734,
    },
    {
      id: '7',
      title: 'Tahajjud Prayer Guide',
      titleArabic: 'دليل صلاة التهجد',
      description: 'How to perform the night prayer and its virtues',
      icon: 'moon-outline',
      color: '#6366F1',
      category: 'prayers',
      downloads: 1234,
    },
    {
      id: '8',
      title: 'Fortress of the Muslim',
      titleArabic: 'حصن المسلم',
      description: 'Comprehensive collection of daily dhikr and supplications',
      icon: 'shield',
      color: '#059669',
      category: 'dhikr',
      downloads: 3421,
    },
    {
      id: '9',
      title: "Du'a of the Prophets",
      titleArabic: 'دعاء الأنبياء',
      description: 'Authentic supplications from the Prophets',
      icon: 'book-outline',
      color: '#7C3AED',
      category: 'dua',
      downloads: 1456,
    },
    {
      id: '10',
      title: 'Etiquette of Fasting',
      titleArabic: 'آداب الصيام',
      description: 'Spiritual etiquette and practices during fasting',
      icon: 'moon',
      color: '#D97706',
      category: 'guides',
      downloads: 1789,
    },
  ];

  const filteredResources = spiritualResources.filter(
    (resource) =>
      (selectedCategory === 'all' || resource.category === selectedCategory) &&
      (searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.titleArabic.includes(searchQuery) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#059669', '#10B981', '#34D399'] as [string, string, string]}
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
              <Ionicons name="moon" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Spiritual Resources</Text>
          <Text className="text-emerald-100 text-lg font-semibold">موارد روحية</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search spiritual resources..."
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
            <Ionicons name="moon-outline" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg mt-4">No resources found</Text>
          </View>
        ) : (
          filteredResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${resource.color}20` }}
                >
                  <Ionicons name={resource.icon} size={28} color={resource.color} />
                </View>

                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-base mb-1">
                    {resource.title}
                  </Text>
                  <Text className="text-emerald-600 font-semibold text-sm mb-2">
                    {resource.titleArabic}
                  </Text>
                  <Text className="text-slate-600 text-sm mb-2" numberOfLines={2}>
                    {resource.description}
                  </Text>

                  <View className="flex-row items-center">
                    <Ionicons name="download-outline" size={14} color="#64748B" />
                    <Text className="text-slate-500 text-xs ml-1">
                      {resource.downloads} downloads
                    </Text>
                  </View>
                </View>

                <TouchableOpacity className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center ml-2">
                  <Ionicons name="chevron-forward" size={24} color="#10B981" />
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
