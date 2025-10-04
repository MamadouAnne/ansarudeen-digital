import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

interface NewsMedia {
  type: 'image' | 'video';
  uri: string;
}

interface NewsArticle {
  id: number;
  title: string;
  titleArabic: string;
  content: string;
  category: string;
  media: NewsMedia[];
  author: string;
  authorBio: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  tags: string[];
}

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Mock news data - in a real app, this would come from an API
  const newsData: { [key: string]: NewsArticle } = {
    '1': {
      id: 1,
      title: 'Grand Mosque Renovation Project Announced',
      titleArabic: 'الإعلان عن مشروع تجديد المسجد الكبير',
      content: `Our community has come together to support this monumental project that will enhance the worship experience for all members. The Grand Mosque renovation project represents a significant milestone in our community's development.

The renovation will include:
• Modern climate control systems for year-round comfort
• Upgraded audio and lighting systems
• Restoration of traditional architectural elements
• Expanded prayer areas to accommodate more worshippers
• Improved accessibility features for elderly and disabled members
• Beautiful landscaping around the mosque grounds

This project has been in planning for over two years, with extensive consultations with community members, Islamic scholars, and architectural experts. We are committed to preserving the spiritual essence and historical significance of our beloved mosque while incorporating modern amenities that will serve our growing community for generations to come.

The estimated timeline for completion is 18 months, and we invite all community members to participate in this blessed endeavor through donations, volunteering, and prayers for its successful completion.`,
      category: 'Announcements',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Mosque+Exterior' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/047857/FFFFFF?text=Interior+Design' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/065f46/FFFFFF?text=Prayer+Hall' },
      ],
      author: 'Admin Team',
      authorBio: 'Official community administration',
      date: 'March 15, 2025',
      readTime: '5 min read',
      likes: 234,
      comments: 45,
      tags: ['Mosque', 'Renovation', 'Community'],
    },
    '2': {
      id: 2,
      title: 'Community Iftar - Join Us This Ramadan',
      titleArabic: 'إفطار جماعي - انضم إلينا هذا رمضان',
      content: `We invite all community members to join us for daily Iftar gatherings during the blessed month of Ramadan. This is a wonderful opportunity to strengthen our bonds of brotherhood and sisterhood while sharing the spiritual experience of breaking fast together.

Schedule and Details:
• Daily Iftar from Maghrib prayer
• Delicious traditional meals prepared by community volunteers
• Special programs for children during Taraweeh
• Weekend lectures by visiting scholars
• Charity drive for those in need

Everyone is welcome, and we especially encourage families to attend. There is no cost to participate, though donations are welcome to help cover expenses and support our charitable initiatives.

Please register in advance so we can prepare adequate food and seating arrangements. Registration forms are available at the mosque office or online through our community portal.

Join us in making this Ramadan a truly memorable and spiritually enriching experience for our entire community.`,
      category: 'Events',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/10b981/FFFFFF?text=Iftar+Gathering' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Community+Meal' },
      ],
      author: 'Events Committee',
      authorBio: 'Organizing community events and gatherings',
      date: 'March 12, 2025',
      readTime: '3 min read',
      likes: 189,
      comments: 32,
      tags: ['Ramadan', 'Iftar', 'Events'],
    },
    '3': {
      id: 3,
      title: 'Youth Islamic Studies Program Success',
      titleArabic: 'نجاح برنامج الدراسات الإسلامية للشباب',
      content: `The inaugural semester of our Youth Islamic Studies Program has concluded with remarkable success. Over 150 students participated in comprehensive courses covering Quran recitation, Arabic language, Islamic history, and moral education.

Program Highlights:
• 95% attendance rate throughout the semester
• 40 students memorized full Surahs
• 60 students achieved proficiency in Arabic reading
• Weekly interactive sessions with Islamic scholars
• Community service projects integrated into curriculum

Our dedicated teachers have worked tirelessly to create an engaging and enriching learning environment. Students ranged from ages 8 to 18, with classes tailored to different age groups and skill levels.

The graduation ceremony was a joyous occasion, with students demonstrating their knowledge through Quran recitation, Arabic presentations, and Islamic quiz competitions. Parents expressed overwhelming satisfaction with their children's progress and enthusiasm for continuing their Islamic education.

Registration for the next semester begins April 1st. We are expanding our program to include advanced courses in Tafsir and Islamic jurisprudence for older students.`,
      category: 'Education',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/f59e0b/FFFFFF?text=Students+Learning' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/d97706/FFFFFF?text=Graduation+Day' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/b45309/FFFFFF?text=Certificates' },
      ],
      author: 'Education Team',
      authorBio: 'Dedicated to Islamic education excellence',
      date: 'March 8, 2025',
      readTime: '4 min read',
      likes: 312,
      comments: 67,
      tags: ['Education', 'Youth', 'Quran'],
    },
    '4': {
      id: 4,
      title: 'Tree Planting Initiative Results',
      titleArabic: 'نتائج مبادرة زراعة الأشجار',
      content: `Our community came together last weekend to plant over 500 trees as part of our environment beautification initiative. This remarkable achievement demonstrates our commitment to environmental stewardship and creating a greener, more beautiful community for future generations.

The tree planting event saw participation from:
• Over 200 volunteers of all ages
• Local schools and youth groups
• Environmental organizations
• Community families

Types of trees planted include shade trees, fruit trees, and flowering species native to our region. Each tree was carefully selected for its environmental benefits and aesthetic appeal.

Volunteers worked in teams, with experienced arborists providing guidance on proper planting techniques. Children enthusiastically participated, learning about the importance of trees in Islam and environmental conservation.

This initiative is part of our larger environmental beautification project, which also includes creating public gardens, maintaining green spaces, and promoting sustainable practices within our community.

We plan to organize quarterly tree planting events and encourage all members to participate in these blessed activities.`,
      category: 'Community',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Tree+Planting' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/047857/FFFFFF?text=Volunteers' },
      ],
      author: 'Community Team',
      authorBio: 'Building stronger community connections',
      date: 'March 8, 2025',
      readTime: '2 min read',
      likes: 276,
      comments: 41,
      tags: ['Environment', 'Community', 'Volunteer'],
    },
    '5': {
      id: 5,
      title: 'New Agricultural Tools Distributed',
      titleArabic: 'توزيع الأدوات الزراعية الجديدة',
      content: `In partnership with Tool Baye, we successfully distributed modern agricultural equipment to support our farming community. This initiative aims to enhance agricultural productivity and improve the livelihoods of local farmers.

Equipment distributed includes:
• Modern plowing tools
• Irrigation systems
• Quality seeds and fertilizers
• Harvesting equipment
• Training manuals and guides

Over 50 farming families received these tools during a special distribution ceremony. Agricultural experts were present to provide training on the proper use and maintenance of the equipment.

The Tool Baye Agriculture Project represents our commitment to supporting sustainable farming practices and ensuring food security for our community. This is the first phase of a comprehensive agricultural development program that will continue throughout the year.

Farmers expressed gratitude for the support and are excited to implement modern techniques that will increase yields while preserving traditional farming wisdom passed down through generations.

We will continue monitoring the project's impact and providing ongoing support to ensure its success.`,
      category: 'Projects',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x300/10b981/FFFFFF?text=Farming+Tools' },
        { type: 'image', uri: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Distribution+Day' },
      ],
      author: 'Projects Team',
      authorBio: 'Managing community development projects',
      date: 'March 1, 2025',
      readTime: '3 min read',
      likes: 198,
      comments: 28,
      tags: ['Agriculture', 'Projects', 'Development'],
    },
  };

  const article = newsData[id as string];

  if (!article) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-600 text-lg">Article not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
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
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
            <Text className="text-emerald-600 text-sm font-bold mb-4">{article.titleArabic}</Text>

            {/* Author Info */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-emerald-600 text-lg font-bold">{article.author[0]}</Text>
                </View>
                <View>
                  <Text className="text-slate-800 text-sm font-bold">{article.author}</Text>
                  <Text className="text-slate-500 text-xs">{article.authorBio}</Text>
                </View>
              </View>
              <Text className="text-slate-500 text-xs font-semibold">{article.readTime}</Text>
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
