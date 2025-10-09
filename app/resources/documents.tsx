import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Document {
  id: string;
  title: string;
  titleArabic: string;
  type: string;
  size: string;
  category: string;
  downloads: number;
  lastUpdated: string;
}

export default function DocumentsScreen() {
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'forms', name: 'Forms', icon: 'document' as keyof typeof Ionicons.glyphMap },
    { id: 'policies', name: 'Policies', icon: 'shield-checkmark' as keyof typeof Ionicons.glyphMap },
    { id: 'reports', name: 'Reports', icon: 'bar-chart' as keyof typeof Ionicons.glyphMap },
    { id: 'bylaws', name: 'Bylaws', icon: 'book' as keyof typeof Ionicons.glyphMap },
  ];

  const documents: Document[] = [
    {
      id: '1',
      title: 'Membership Application Form',
      titleArabic: 'نموذج طلب العضوية',
      type: 'PDF',
      size: '245 KB',
      category: 'forms',
      downloads: 567,
      lastUpdated: 'Jan 2024',
    },
    {
      id: '2',
      title: 'Community Bylaws 2024',
      titleArabic: 'لوائح المجتمع 2024',
      type: 'PDF',
      size: '1.2 MB',
      category: 'bylaws',
      downloads: 234,
      lastUpdated: 'Jan 2024',
    },
    {
      id: '3',
      title: 'Event Registration Form',
      titleArabic: 'نموذج تسجيل الحدث',
      type: 'PDF',
      size: '189 KB',
      category: 'forms',
      downloads: 892,
      lastUpdated: 'Feb 2024',
    },
    {
      id: '4',
      title: 'Donation Receipt Template',
      titleArabic: 'نموذج إيصال التبرع',
      type: 'PDF',
      size: '156 KB',
      category: 'forms',
      downloads: 445,
      lastUpdated: 'Dec 2023',
    },
    {
      id: '5',
      title: 'Privacy Policy',
      titleArabic: 'سياسة الخصوصية',
      type: 'PDF',
      size: '678 KB',
      category: 'policies',
      downloads: 123,
      lastUpdated: 'Jan 2024',
    },
    {
      id: '6',
      title: 'Annual Report 2023',
      titleArabic: 'التقرير السنوي 2023',
      type: 'PDF',
      size: '3.4 MB',
      category: 'reports',
      downloads: 789,
      lastUpdated: 'Jan 2024',
    },
    {
      id: '7',
      title: 'Financial Statement 2023',
      titleArabic: 'البيان المالي 2023',
      type: 'PDF',
      size: '1.8 MB',
      category: 'reports',
      downloads: 456,
      lastUpdated: 'Feb 2024',
    },
    {
      id: '8',
      title: 'Volunteer Agreement',
      titleArabic: 'اتفاقية المتطوع',
      type: 'PDF',
      size: '234 KB',
      category: 'forms',
      downloads: 321,
      lastUpdated: 'Nov 2023',
    },
    {
      id: '9',
      title: 'Code of Conduct',
      titleArabic: 'مدونة قواعد السلوك',
      type: 'PDF',
      size: '456 KB',
      category: 'policies',
      downloads: 654,
      lastUpdated: 'Dec 2023',
    },
    {
      id: '10',
      title: 'Meeting Minutes Template',
      titleArabic: 'نموذج محضر الاجتماع',
      type: 'DOCX',
      size: '89 KB',
      category: 'forms',
      downloads: 234,
      lastUpdated: 'Oct 2023',
    },
  ];

  const filteredDocuments = documents.filter(
    (doc) =>
      (selectedCategory === 'all' || doc.category === selectedCategory) &&
      (searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.titleArabic.includes(searchQuery))
  );

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#D97706', '#F59E0B', '#FBBF24'] as [string, string, string]}
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
              <Ionicons name="document-text" size={24} color="#fff" />
            </View>
          </View>

          <Text className="text-white text-3xl font-extrabold mb-2">Documents & Forms</Text>
          <Text className="text-amber-100 text-lg font-semibold">وثائق ونماذج</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-base"
            placeholder="Search documents..."
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
                  ? 'bg-amber-600 border border-amber-700'
                  : 'bg-white border border-amber-200/60'
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  selectedCategory === category.id ? 'text-white' : 'text-amber-700'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Documents List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {filteredDocuments.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="document-outline" size={64} color="#CBD5E1" />
            <Text className="text-slate-400 text-lg mt-4">No documents found</Text>
          </View>
        ) : (
          filteredDocuments.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-amber-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="document-text" size={24} color="#F59E0B" />
                </View>

                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-base mb-1">
                    {doc.title}
                  </Text>
                  <Text className="text-amber-600 font-semibold text-sm mb-2">
                    {doc.titleArabic}
                  </Text>

                  {/* Meta Info */}
                  <View className="flex-row items-center gap-4 mb-2">
                    <View className="flex-row items-center">
                      <Ionicons name="document-outline" size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs ml-1">
                        {doc.type} • {doc.size}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="download-outline" size={14} color="#64748B" />
                      <Text className="text-slate-500 text-xs ml-1">{doc.downloads}</Text>
                    </View>
                  </View>

                  <Text className="text-slate-400 text-xs">
                    Updated {doc.lastUpdated}
                  </Text>
                </View>

                {/* Download Button */}
                <TouchableOpacity
                  className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center ml-2"
                  onPress={() => {
                    // Handle download
                  }}
                >
                  <Ionicons name="download" size={20} color="#F59E0B" />
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
