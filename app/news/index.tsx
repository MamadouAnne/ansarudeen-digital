import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface NewsArticle {
  id: number;
  title: string;
  title_arabic: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  read_time: string;
  likes: number;
  comments: number;
}

export default function NewsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Announcements', 'Events', 'Community', 'Education', 'Projects'];

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  async function fetchNewsArticles() {
    try {
      setLoading(true);
      const { data: articles, error } = await supabase
        .from('news_articles')
        .select(`
          *,
          news_media!inner (
            uri
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the expected format
      const transformedArticles = articles?.map((article: any) => ({
        id: article.id,
        title: article.title,
        title_arabic: article.title_arabic,
        excerpt: article.excerpt,
        category: article.category,
        image: article.news_media[0]?.uri || '',
        author: article.author,
        date: article.date,
        read_time: article.read_time,
        likes: article.likes,
        comments: article.comments,
      })) || [];

      setNewsArticles(transformedArticles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-slate-600 mt-4">Loading news...</Text>
      </View>
    );
  }

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
              <View
                key={article.id}
                className="rounded-3xl shadow-md border border-emerald-200/60 overflow-hidden mb-4"
              >
                <TouchableOpacity
                  onPress={() => router.push(`/news/${article.id}`)}
                >
                  {/* Article Image */}
                  <Image
                    source={{ uri: article.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />

                  <LinearGradient
                    colors={['#fffbeb', '#fef3c7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4"
                  >
                  {/* Category Badge and Date */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className={`px-3 py-1 rounded-full border ${getCategoryColor(article.category)}`}>
                      <Text className="text-xs font-extrabold">{article.category}</Text>
                    </View>
                    <Text className="text-slate-400 text-xs font-semibold">{article.date}</Text>
                  </View>

                  {/* Title */}
                  <Text className="text-xl font-bold text-slate-800 mb-1">{article.title}</Text>
                  <Text className="text-emerald-600 text-xs font-semibold mb-3">{article.title_arabic}</Text>

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
                    <Text className="text-slate-500 text-xs font-semibold">{article.read_time}</Text>
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
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
