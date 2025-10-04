import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

interface NewsMedia {
  type: 'image' | 'video';
  uri: string;
}

interface NewsArticle {
  id: number;
  title: string;
  titleArabic: string;
  excerpt: string;
  content: string;
  category: string;
  media: NewsMedia[];
  author: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  featured: boolean;
}

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const categories = ['All', 'Announcements', 'Events', 'Community', 'Education', 'Projects'];

  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'Grand Mosque Renovation Project Announced',
      titleArabic: 'الإعلان عن مشروع تجديد المسجد الكبير',
      excerpt: 'We are excited to announce the commencement of the Grand Mosque renovation project, bringing modern facilities while preserving our spiritual heritage.',
      content: 'Our community has come together to support this monumental project that will enhance the worship experience for all members...',
      category: 'Announcements',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Mosque+Exterior' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/047857/FFFFFF?text=Interior+View' },
      ],
      author: 'Admin Team',
      date: '2 days ago',
      readTime: '5 min read',
      likes: 234,
      comments: 45,
      featured: true,
    },
    {
      id: 2,
      title: 'Community Iftar - Join Us This Ramadan',
      titleArabic: 'إفطار جماعي - انضم إلينا هذا رمضان',
      excerpt: 'Daily community Iftar throughout Ramadan. All members and families are welcome to break fast together in unity and brotherhood.',
      content: 'We invite all community members to join us for daily Iftar gatherings during the blessed month of Ramadan...',
      category: 'Events',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/10b981/FFFFFF?text=Iftar+Gathering' },
      ],
      author: 'Events Committee',
      date: '5 days ago',
      readTime: '3 min read',
      likes: 189,
      comments: 32,
      featured: false,
    },
    {
      id: 3,
      title: 'Youth Islamic Studies Program Success',
      titleArabic: 'نجاح برنامج الدراسات الإسلامية للشباب',
      excerpt: 'Our youth program has successfully completed its first semester with over 150 students learning Quran, Arabic, and Islamic studies.',
      content: 'The inaugural semester of our Youth Islamic Studies Program has concluded with remarkable success...',
      category: 'Education',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/f59e0b/FFFFFF?text=Students+Learning' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/d97706/FFFFFF?text=Graduation+Day' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/b45309/FFFFFF?text=Certificates' },
      ],
      author: 'Education Team',
      date: '1 week ago',
      readTime: '4 min read',
      likes: 312,
      comments: 67,
      featured: true,
    },
    {
      id: 4,
      title: 'Tree Planting Initiative Results',
      titleArabic: 'نتائج مبادرة زراعة الأشجار',
      excerpt: '500+ trees planted around our community in the environment beautification project. Thank you to all volunteers!',
      content: 'Our community came together last weekend to plant over 500 trees as part of our environment beautification initiative...',
      category: 'Community',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Tree+Planting' },
      ],
      author: 'Community Team',
      date: '1 week ago',
      readTime: '2 min read',
      likes: 276,
      comments: 41,
      featured: false,
    },
    {
      id: 5,
      title: 'New Agricultural Tools Distributed',
      titleArabic: 'توزيع الأدوات الزراعية الجديدة',
      excerpt: 'Modern farming equipment distributed to local farmers as part of the Tool Baye Agriculture Project.',
      content: 'In partnership with Tool Baye, we successfully distributed modern agricultural equipment to support our farming community...',
      category: 'Projects',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/10b981/FFFFFF?text=Farming+Tools' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Distribution+Day' },
      ],
      author: 'Projects Team',
      date: '2 weeks ago',
      readTime: '3 min read',
      likes: 198,
      comments: 28,
      featured: false,
    },
  ];

  const filteredNews = selectedCategory === 'All'
    ? newsArticles
    : newsArticles.filter(article => article.category === selectedCategory);

  const featuredNews = newsArticles.filter(article => article.featured);

  const toggleLike = (id: number) => {
    setLikedPosts(prev =>
      prev.includes(id) ? prev.filter(postId => postId !== id) : [...prev, id]
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Islamic-themed Header */}
        <View className="h-64">
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
            {/* Header Content */}
            <View className="items-center">
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
                <Text className="text-3xl">📰</Text>
              </View>
              <Text className="text-white text-3xl font-bold mb-1">
                News & Updates
              </Text>
              <Text className="text-emerald-100 text-sm font-medium">
                الأخبار والتحديثات • Stay Connected
              </Text>
            </View>
          </View>
          </LinearGradient>
        </View>

        <View className="px-5 -mt-4">
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
                  className={`mr-3 px-5 py-3 rounded-2xl border-2 ${
                    selectedCategory === category
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'bg-white border-emerald-200'
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

          {/* Featured News Section */}
          {selectedCategory === 'All' && featuredNews.length > 0 && (
            <View className="mb-5">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-2">
                  <Text className="text-amber-600 text-lg">⭐</Text>
                </View>
                <Text className="text-xl font-bold text-slate-800">Featured Stories</Text>
              </View>

              {featuredNews.map((article) => (
                <View key={article.id} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl overflow-hidden border-2 border-amber-200 mb-4 shadow-lg">
                  {/* Featured Image */}
                  {article.media.length > 0 && (
                    <Image
                      source={{ uri: article.media[0].uri }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                  )}

                  <View className="p-5">
                    {/* Category Badge */}
                    <View className="bg-amber-500 self-start px-3 py-1 rounded-full mb-3">
                      <Text className="text-white text-xs font-extrabold">{article.category}</Text>
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-slate-800 mb-1">{article.title}</Text>
                    <Text className="text-amber-600 text-xs font-medium mb-3">{article.titleArabic}</Text>

                    {/* Excerpt */}
                    <Text className="text-slate-700 text-sm leading-5 mb-4">{article.excerpt}</Text>

                    {/* Meta Info */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-emerald-600 rounded-full items-center justify-center mr-2">
                          <Text className="text-white text-xs font-bold">{article.author[0]}</Text>
                        </View>
                        <View>
                          <Text className="text-slate-800 text-xs font-bold">{article.author}</Text>
                          <Text className="text-slate-500 text-xs">{article.date}</Text>
                        </View>
                      </View>
                      <Text className="text-slate-500 text-xs font-semibold">{article.readTime}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row items-center justify-between pt-4 border-t border-amber-200">
                      <TouchableOpacity
                        onPress={() => toggleLike(article.id)}
                        className="flex-row items-center"
                      >
                        <Text className={`text-xl mr-1 ${likedPosts.includes(article.id) ? '' : 'opacity-40'}`}>
                          ❤️
                        </Text>
                        <Text className="text-slate-700 font-bold text-sm">
                          {article.likes + (likedPosts.includes(article.id) ? 1 : 0)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center">
                        <Text className="text-xl mr-1">💬</Text>
                        <Text className="text-slate-700 font-bold text-sm">{article.comments}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <LinearGradient
                          colors={['#f59e0b', '#d97706']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="px-6 py-2 rounded-xl"
                        >
                          <Text className="text-white font-extrabold text-sm">Read More</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Regular News Articles */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-emerald-100 rounded-full items-center justify-center mr-2">
                <Text className="text-emerald-600 text-lg">📋</Text>
              </View>
              <Text className="text-xl font-bold text-slate-800">
                {selectedCategory === 'All' ? 'All Updates' : selectedCategory}
              </Text>
            </View>

            {filteredNews.filter(article => !article.featured || selectedCategory !== 'All').map((article) => (
              <View key={article.id} className="bg-white rounded-3xl overflow-hidden border-2 border-emerald-100 mb-4 shadow-md">
                {/* Article Image Gallery */}
                {article.media.length > 0 && (
                  <View>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                    >
                      {article.media.map((media, index) => (
                        <Image
                          key={index}
                          source={{ uri: media.uri }}
                          style={{ width: width - 40 }}
                          className="h-48"
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                    {article.media.length > 1 && (
                      <View className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">
                          1/{article.media.length}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View className="p-5">
                  {/* Category Badge */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      <Text className="text-emerald-700 text-xs font-extrabold">{article.category}</Text>
                    </View>
                    <Text className="text-slate-400 text-xs font-semibold">{article.date}</Text>
                  </View>

                  {/* Title */}
                  <Text className="text-xl font-bold text-slate-800 mb-1">{article.title}</Text>
                  <Text className="text-emerald-600 text-xs font-medium mb-3">{article.titleArabic}</Text>

                  {/* Excerpt */}
                  <Text className="text-slate-600 text-sm leading-5 mb-4">{article.excerpt}</Text>

                  {/* Meta Info */}
                  <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
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
                    <TouchableOpacity
                      onPress={() => toggleLike(article.id)}
                      className="flex-row items-center"
                    >
                      <Text className={`text-lg mr-1 ${likedPosts.includes(article.id) ? '' : 'opacity-40'}`}>
                        ❤️
                      </Text>
                      <Text className="text-slate-700 font-bold text-sm">
                        {article.likes + (likedPosts.includes(article.id) ? 1 : 0)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-lg mr-1">💬</Text>
                      <Text className="text-slate-700 font-bold text-sm">{article.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-lg mr-1">📤</Text>
                      <Text className="text-slate-700 font-bold text-sm">Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View className="bg-emerald-600 px-5 py-2 rounded-xl">
                        <Text className="text-white font-extrabold text-sm">Read</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Load More Button */}
          <TouchableOpacity className="mb-6">
            <View className="bg-slate-100 py-4 rounded-2xl border-2 border-slate-200">
              <Text className="text-slate-700 text-center font-bold">Load More Articles</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
