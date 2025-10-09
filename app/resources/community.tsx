import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CommunityResource {
  id: string;
  title: string;
  titleArabic: string;
  type: 'video' | 'pdf';
  duration?: string;
  size?: string;
  downloads: number;
  category: string;
}

export default function CommunityScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'volunteer', name: 'Volunteer', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { id: 'youth', name: 'Youth', icon: 'people' as keyof typeof Ionicons.glyphMap },
    { id: 'leadership', name: 'Leadership', icon: 'ribbon' as keyof typeof Ionicons.glyphMap },
    { id: 'events', name: 'Events', icon: 'calendar' as keyof typeof Ionicons.glyphMap },
  ];

  const resources: CommunityResource[] = [
    { id: '1', title: 'Volunteer Training Module', titleArabic: 'وحدة تدريب المتطوعين', type: 'video', duration: '1:15:30', downloads: 145, category: 'volunteer' },
    { id: '2', title: 'Youth Program Curriculum 2024', titleArabic: 'منهج برنامج الشباب 2024', type: 'pdf', size: '3.8 MB', downloads: 234, category: 'youth' },
    { id: '3', title: 'Community Leadership Workshop', titleArabic: 'ورشة القيادة المجتمعية', type: 'video', duration: '2:10:45', downloads: 198, category: 'leadership' },
    { id: '4', title: 'Event Planning Guide', titleArabic: 'دليل تخطيط الفعاليات', type: 'pdf', size: '2.1 MB', downloads: 312, category: 'events' },
    { id: '5', title: 'Interfaith Dialogue Training', titleArabic: 'تدريب الحوار بين الأديان', type: 'video', duration: '45:20', downloads: 87, category: 'leadership' },
    { id: '6', title: 'Social Media Management Course', titleArabic: 'دورة إدارة وسائل التواصل', type: 'video', duration: '1:32:15', downloads: 276, category: 'youth' },
  ];

  const filteredResources = resources.filter(
    (resource) =>
      (selectedCategory === 'all' || resource.category === selectedCategory) &&
      (searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.titleArabic.includes(searchQuery))
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#6D28D9', '#7C3AED', '#8B5CF6'] as [string, string, string]}
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
              <Ionicons name="people" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Community Learning</Text>
          <Text className="text-purple-100 text-lg font-semibold">تعلم المجتمع</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search community resources..."
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
                  ? 'bg-purple-600 border border-purple-700'
                  : 'bg-white border border-purple-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category.id ? 'text-white' : 'text-purple-700'
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
            <Ionicons name="people-outline" size={64} color="#CBD5E1" />
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
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${
                    resource.type === 'video' ? 'bg-purple-100' : 'bg-amber-100'
                  }`}
                >
                  <Ionicons
                    name={resource.type === 'video' ? 'videocam' : 'document-text'}
                    size={24}
                    color={resource.type === 'video' ? '#8B5CF6' : '#F59E0B'}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-base mb-1">
                    {resource.title}
                  </Text>
                  <Text className="text-purple-600 font-semibold text-sm mb-2">
                    {resource.titleArabic}
                  </Text>

                  <View className="flex-row items-center gap-4">
                    {resource.duration && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#64748B" />
                        <Text className="text-slate-500 text-xs ml-1">{resource.duration}</Text>
                      </View>
                    )}
                    {resource.size && (
                      <View className="flex-row items-center">
                        <Ionicons name="document-outline" size={14} color="#64748B" />
                        <Text className="text-slate-500 text-xs ml-1">{resource.size}</Text>
                      </View>
                    )}
                    <View className="flex-row items-center">
                      <Ionicons name="download-outline" size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs ml-1">{resource.downloads}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center ml-2">
                  <Ionicons name="download" size={20} color="#8B5CF6" />
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
