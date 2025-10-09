import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DownloadItem {
  id: string;
  title: string;
  titleArabic: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: string;
  size?: string;
  preview?: string;
}

export default function DownloadsScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'wallpapers', name: 'Wallpapers', icon: 'images' as keyof typeof Ionicons.glyphMap },
    { id: 'calligraphy', name: 'Calligraphy', icon: 'brush' as keyof typeof Ionicons.glyphMap },
    { id: 'directories', name: 'Directories', icon: 'people' as keyof typeof Ionicons.glyphMap },
    { id: 'maps', name: 'Maps', icon: 'map' as keyof typeof Ionicons.glyphMap },
  ];

  const downloadItems: DownloadItem[] = [
    {
      id: '1',
      title: 'Islamic Wallpapers',
      titleArabic: 'خلفيات إسلامية',
      count: 24,
      icon: 'images',
      color: '#8B5CF6',
      category: 'wallpapers',
      size: '45 MB',
      preview: 'https://picsum.photos/seed/wallpapers/400/300',
    },
    {
      id: '2',
      title: 'Arabic Calligraphy Art',
      titleArabic: 'فن الخط العربي',
      count: 18,
      icon: 'brush',
      color: '#F59E0B',
      category: 'calligraphy',
      size: '32 MB',
      preview: 'https://picsum.photos/seed/calligraphy/400/300',
    },
    {
      id: '3',
      title: 'Community Directory 2024',
      titleArabic: 'دليل المجتمع 2024',
      count: 1,
      icon: 'people',
      color: '#10B981',
      category: 'directories',
      size: '2.5 MB',
    },
    {
      id: '4',
      title: 'Facility Maps',
      titleArabic: 'خرائط المرافق',
      count: 3,
      icon: 'map',
      color: '#3B82F6',
      category: 'maps',
      size: '5.8 MB',
    },
    {
      id: '5',
      title: 'Quranic Verses Wallpapers',
      titleArabic: 'خلفيات الآيات القرآنية',
      count: 15,
      icon: 'book',
      color: '#059669',
      category: 'wallpapers',
      size: '28 MB',
      preview: 'https://picsum.photos/seed/quran-wallpaper/400/300',
    },
    {
      id: '6',
      title: 'Masjid Calligraphy Collection',
      titleArabic: 'مجموعة خط المسجد',
      count: 12,
      icon: 'create',
      color: '#EF4444',
      category: 'calligraphy',
      size: '18 MB',
      preview: 'https://picsum.photos/seed/masjid-calligraphy/400/300',
    },
    {
      id: '7',
      title: 'Event Organizers Contact List',
      titleArabic: 'قائمة منظمي الفعاليات',
      count: 1,
      icon: 'document-text',
      color: '#6366F1',
      category: 'directories',
      size: '890 KB',
    },
    {
      id: '8',
      title: 'Ramadan Wallpaper Pack',
      titleArabic: 'حزمة خلفيات رمضان',
      count: 20,
      icon: 'moon',
      color: '#7C3AED',
      category: 'wallpapers',
      size: '38 MB',
      preview: 'https://picsum.photos/seed/ramadan-wallpaper/400/300',
    },
    {
      id: '9',
      title: 'Islamic Geometric Patterns',
      titleArabic: 'الأنماط الهندسية الإسلامية',
      count: 16,
      icon: 'shapes',
      color: '#EC4899',
      category: 'calligraphy',
      size: '22 MB',
      preview: 'https://picsum.photos/seed/geometric/400/300',
    },
    {
      id: '10',
      title: 'Parking & Venue Maps',
      titleArabic: 'خرائط مواقف السيارات والأماكن',
      count: 5,
      icon: 'navigate',
      color: '#14B8A6',
      category: 'maps',
      size: '3.2 MB',
    },
  ];

  const filteredItems = downloadItems.filter(
    (item) =>
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      (searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.titleArabic.includes(searchQuery))
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#0891B2', '#06B6D4', '#22D3EE'] as [string, string, string]}
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
              <Ionicons name="download" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Downloads</Text>
          <Text className="text-cyan-100 text-lg font-semibold">التحميلات</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search downloads..."
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
                  ? 'bg-cyan-600 border border-cyan-700'
                  : 'bg-white border border-cyan-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category.id ? 'text-white' : 'text-cyan-700'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Downloads List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {filteredItems.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="download-outline" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg mt-4">No downloads found</Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
              activeOpacity={0.7}
            >
              {item.preview && (
                <View className="relative">
                  <Image
                    source={{ uri: item.preview }}
                    className="w-full h-32"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)'] as [string, string]}
                    className="absolute bottom-0 left-0 right-0 h-16"
                  />
                </View>
              )}

              <View className="p-4">
                <View className="flex-row items-center">
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-base mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-cyan-600 font-semibold text-sm mb-2">
                      {item.titleArabic}
                    </Text>

                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center">
                        <Ionicons name="folder-outline" size={14} color="#64748B" />
                        <Text className="text-slate-500 text-xs ml-1">
                          {item.count} {item.count === 1 ? 'item' : 'items'}
                        </Text>
                      </View>
                      {item.size && (
                        <View className="flex-row items-center">
                          <Ionicons name="cloud-download-outline" size={14} color="#64748B" />
                          <Text className="text-slate-500 text-xs ml-1">{item.size}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View className="bg-cyan-100 rounded-full px-3 py-2">
                    <Ionicons name="download" size={20} color="#06B6D4" />
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
