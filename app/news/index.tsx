import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, Stack } from 'expo-router';

interface NewsArticle {
  id: number;
  title: string;
  titleArabic: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
}

export default function NewsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Announcements', 'Events', 'Community', 'Education', 'Projects'];

  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'Grand Mosque Renovation Project Announced',
      titleArabic: 'الإعلان عن مشروع تجديد المسجد الكبير',
      excerpt: 'We are excited to announce the commencement of the Grand Mosque renovation project, bringing modern facilities while preserving our spiritual heritage.',
      category: 'Announcements',
      image: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Mosque+Exterior',
      author: 'Admin Team',
      date: '2 days ago',
      readTime: '5 min read',
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      title: 'Community Iftar - Join Us This Ramadan',
      titleArabic: 'إفطار جماعي - انضم إلينا هذا رمضان',
      excerpt: 'Daily community Iftar throughout Ramadan. All members and families are welcome to break fast together in unity and brotherhood.',
      category: 'Events',
      image: 'https://via.placeholder.com/400x300/10b981/FFFFFF?text=Iftar+Gathering',
      author: 'Events Committee',
      date: '5 days ago',
      readTime: '3 min read',
      likes: 189,
      comments: 32,
    },
    {
      id: 3,
      title: 'Youth Islamic Studies Program Success',
      titleArabic: 'نجاح برنامج الدراسات الإسلامية للشباب',
      excerpt: 'Our youth program has successfully completed its first semester with over 150 students learning Quran, Arabic, and Islamic studies.',
      category: 'Education',
      image: 'https://via.placeholder.com/400x300/f59e0b/FFFFFF?text=Students+Learning',
      author: 'Education Team',
      date: '1 week ago',
      readTime: '4 min read',
      likes: 312,
      comments: 67,
    },
    {
      id: 4,
      title: 'Tree Planting Initiative Results',
      titleArabic: 'نتائج مبادرة زراعة الأشجار',
      excerpt: '500+ trees planted around our community in the environment beautification project. Thank you to all volunteers!',
      category: 'Community',
      image: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Tree+Planting',
      author: 'Community Team',
      date: '1 week ago',
      readTime: '2 min read',
      likes: 276,
      comments: 41,
    },
    {
      id: 5,
      title: 'New Agricultural Tools Distributed',
      titleArabic: 'توزيع الأدوات الزراعية الجديدة',
      excerpt: 'Modern farming equipment distributed to local farmers as part of the Tool Baye Agriculture Project.',
      category: 'Projects',
      image: 'https://via.placeholder.com/400x300/10b981/FFFFFF?text=Farming+Tools',
      author: 'Projects Team',
      date: '2 weeks ago',
      readTime: '3 min read',
      likes: 198,
      comments: 28,
    },
  ];

  const filteredNews = selectedCategory === 'All'
    ? newsArticles
    : newsArticles.filter(article => article.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Announcements':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Events':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Community':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Education':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Projects':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Islamic-themed Header */}
        <View className="h-56">
          <LinearGradient
            colors={['#059669', '#047857', '#065f46']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 h-full relative overflow-hidden"
            style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}
          >
          {/* Decorative Islamic pattern */}
          <View className="absolute inset-0 opacity-10">
            <View className="absolute top-4 right-4 w-28 h-28 border-4 border-white rounded-full" />
            <View className="absolute top-12 right-12 w-20 h-20 border-4 border-white rounded-full" />
            <View className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
          </View>

          {/* Back Button */}
          <View className="absolute top-20 left-4 z-20">
            <Link href="/(tabs)" asChild>
              <TouchableOpacity>
                <View className="flex-row items-center">
                  <Text className="text-white text-lg font-bold mr-2">←</Text>
                  <Text className="text-white text-base font-semibold">Back</Text>
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="relative z-10 mt-8">
            <View className="items-center">
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
                <Text className="text-3xl">📰</Text>
              </View>
              <Text className="text-white text-3xl font-bold mb-1">
                News & Updates
              </Text>
              <Text className="text-emerald-100 text-sm font-medium mb-2">
                الأخبار والتحديثات • Stay Connected
              </Text>
            </View>
          </View>
          </LinearGradient>
        </View>

        <View className="px-5 -mt-6">
          {/* Category Filter */}
          <View className="mb-5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`mr-3 px-5 py-3 rounded-2xl ${
                    selectedCategory === category
                      ? 'bg-emerald-600 border border-emerald-700'
                      : 'bg-white border border-emerald-200/60'
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      selectedCategory === category ? 'text-white' : 'text-emerald-700'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* News Articles */}
          <View className="mb-6">
            {filteredNews.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => router.push(`/news/${article.id}`)}
                className="bg-white rounded-3xl shadow-md border border-emerald-200/60 overflow-hidden mb-4"
              >
                {/* Article Image */}
                <Image
                  source={{ uri: article.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />

                <View className="p-4">
                  {/* Category Badge and Date */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className={`px-3 py-1 rounded-full border ${getCategoryColor(article.category)}`}>
                      <Text className="text-xs font-extrabold">{article.category}</Text>
                    </View>
                    <Text className="text-slate-400 text-xs font-semibold">{article.date}</Text>
                  </View>

                  {/* Title */}
                  <Text className="text-xl font-bold text-slate-800 mb-1">{article.title}</Text>
                  <Text className="text-emerald-600 text-xs font-semibold mb-3">{article.titleArabic}</Text>

                  {/* Excerpt */}
                  <Text className="text-slate-600 text-sm leading-5 mb-4" numberOfLines={2}>
                    {article.excerpt}
                  </Text>

                  {/* Meta Info */}
                  <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-emerald-100 rounded-full items-center justify-center mr-2">
                        <Text className="text-emerald-600 text-xs font-bold">{article.author[0]}</Text>
                      </View>
                      <Text className="text-slate-700 text-xs font-bold">{article.author}</Text>
                    </View>
                    <Text className="text-slate-500 text-xs font-semibold">{article.readTime}</Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-1">❤️</Text>
                      <Text className="text-slate-700 font-bold text-sm">{article.likes}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-1">💬</Text>
                      <Text className="text-slate-700 font-bold text-sm">{article.comments}</Text>
                    </View>
                    <View className="flex-row items-center bg-emerald-600 px-4 py-2 rounded-full">
                      <Text className="text-white font-extrabold text-sm mr-1">Read More</Text>
                      <Text className="text-white text-base">→</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
