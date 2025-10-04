import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface NewsMedia {
  type: 'image' | 'video';
  uri: string;
}

interface NewsArticle {
  id: number;
  title: string;
  title_arabic: string;
  content: string;
  category: string;
  media: NewsMedia[];
  author: string;
  author_bio: string;
  date: string;
  read_time: string;
  likes: number;
  comments: number;
  tags: string[];
}

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  async function fetchArticle() {
    try {
      setLoading(true);
      const { data: articleData, error: articleError } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (articleError) throw articleError;

      const { data: mediaData, error: mediaError } = await supabase
        .from('news_media')
        .select('*')
        .eq('news_article_id', id)
        .order('display_order', { ascending: true });

      if (mediaError) throw mediaError;

      const { data: tagsData, error: tagsError } = await supabase
        .from('news_tags')
        .select('*')
        .eq('news_article_id', id);

      if (tagsError) throw tagsError;

      const transformedArticle: NewsArticle = {
        id: articleData.id,
        title: articleData.title,
        title_arabic: articleData.title_arabic,
        content: articleData.content,
        category: articleData.category,
        media: mediaData.map((m: any) => ({
          type: m.type,
          uri: m.uri,
        })),
        author: articleData.author,
        author_bio: articleData.author_bio,
        date: articleData.date,
        read_time: articleData.read_time,
        likes: articleData.likes,
        comments: articleData.comments,
        tags: tagsData.map((t: any) => t.tag),
      };

      setArticle(transformedArticle);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-emerald-600 items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: '#059669' }
          }}
        />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading article...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View className="flex-1 bg-emerald-600 items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: '#059669' }
          }}
        />
        <Text className="text-white text-lg">Article not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-white px-6 py-3 rounded-full">
          <Text className="text-emerald-600 font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Announcements':
        return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' };
      case 'Events':
        return { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' };
      case 'Community':
        return { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' };
      case 'Education':
        return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' };
      case 'Projects':
        return { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' };
      default:
        return { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' };
    }
  };

  const categoryColors = getCategoryColor(article.category);

  return (
    <View className="flex-1 bg-emerald-600">
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: '#059669' }
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: '#f8fafc' }}>
        {/* Header with Back Button */}
        <View className="h-20 bg-emerald-600" style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}>
          <View className="flex-row items-center px-4">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">←</Text>
                <Text className="text-white text-base font-semibold">Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Carousel */}
        <View className="relative bg-slate-200">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveMediaIndex(index);
            }}
          >
            {article.media.map((media, index) => (
              <View key={index} style={{ width }}>
                <Image
                  source={{ uri: media.uri }}
                  className="h-64 bg-slate-300"
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Media Indicators */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {article.media.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  activeMediaIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </View>
        </View>

        <View className="px-5 py-5">
          {/* Article Header */}
          <View className="bg-white rounded-3xl shadow-lg border border-emerald-200/60 p-5 mb-5">
            {/* Category and Date */}
            <View className="flex-row items-center justify-between mb-3">
              <View className={`px-4 py-2 rounded-full border-2 ${categoryColors.bg} ${categoryColors.border}`}>
                <Text className={`text-sm font-extrabold ${categoryColors.text}`}>
                  {article.category}
                </Text>
              </View>
              <Text className="text-slate-500 text-sm font-semibold">{article.date}</Text>
            </View>

            {/* Title */}
            <Text className="text-2xl font-extrabold text-slate-800 mb-1">{article.title}</Text>
            <Text className="text-emerald-600 text-sm font-bold mb-4">{article.title_arabic}</Text>

            {/* Author Info */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-emerald-600 text-lg font-bold">{article.author[0]}</Text>
                </View>
                <View>
                  <Text className="text-slate-800 text-sm font-bold">{article.author}</Text>
                  <Text className="text-slate-500 text-xs">{article.author_bio}</Text>
                </View>
              </View>
              <Text className="text-slate-500 text-xs font-semibold">{article.read_time}</Text>
            </View>

            {/* Article Content */}
            <Text className="text-slate-700 text-base leading-6 mb-4">
              {article.content}
            </Text>

            {/* Tags */}
            <View className="flex-row flex-wrap mb-4">
              {article.tags.map((tag, index) => (
                <View key={index} className="bg-slate-100 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-slate-600 text-xs font-semibold">#{tag}</Text>
                </View>
              ))}
            </View>

            {/* Engagement Stats */}
            <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-300/50">
              <View className="flex-row items-center justify-around">
                <TouchableOpacity
                  onPress={() => setIsLiked(!isLiked)}
                  className="flex-row items-center"
                >
                  <Text className={`text-2xl mr-2 ${isLiked ? '' : 'opacity-40'}`}>❤️</Text>
                  <Text className="text-slate-700 font-extrabold text-lg">
                    {article.likes + (isLiked ? 1 : 0)}
                  </Text>
                </TouchableOpacity>
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-2">💬</Text>
                  <Text className="text-slate-700 font-extrabold text-lg">{article.comments}</Text>
                </View>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-2xl mr-2">📤</Text>
                  <Text className="text-slate-700 font-extrabold text-sm">Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Related Articles */}
          <View className="bg-white rounded-3xl shadow-lg border border-emerald-200/60 p-5 mb-5">
            <Text className="text-xl font-bold text-slate-800 mb-3">Related Articles</Text>
            <Text className="text-slate-600 text-sm">More articles coming soon...</Text>
          </View>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
