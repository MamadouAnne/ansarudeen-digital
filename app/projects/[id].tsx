import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams, useRouter, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

interface MediaItem {
  type: 'image' | 'video';
  uri: string;
}

interface Project {
  id: number;
  title: string;
  titleArabic: string;
  description: string;
  fullDescription: string;
  category: string;
  icon: string;
  media: MediaItem[];
  status: 'ongoing' | 'planning' | 'completed';
  progress: number;
  budget: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  donors: number;
}

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Mock project data - in a real app, this would come from an API
  const projectsData: { [key: string]: Project } = {
    '1': {
      id: 1,
      title: 'Sanitation Infrastructure',
      titleArabic: 'البنية التحتية للصرف الصحي',
      description: 'Modern pipeline network with automatic pumping system',
      fullDescription: 'Setting up a synchronized and modern pipeline network with large pipes in the main arteries, connected to households through an automatic pumping system. Equipped with recovery stations connected to the ONAS network, discharging into the sea or designated locations. This comprehensive infrastructure project will significantly improve community health and sanitation standards.',
      category: 'Infrastructure',
      icon: '🚰',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x250/059669/FFFFFF?text=Pipeline+Network' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/047857/FFFFFF?text=Pumping+System' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/065f46/FFFFFF?text=Recovery+Station' },
      ],
      status: 'planning',
      progress: 25,
      budget: '$2.5M',
      targetAmount: 2500000,
      raisedAmount: 625000,
      startDate: 'Q3 2025',
      donors: 145,
    },
    '2': {
      id: 2,
      title: 'Environment & Beautification',
      titleArabic: 'البيئة والتجميل',
      description: 'Creating public spaces and reforesting with shade trees',
      fullDescription: 'Creating public spaces, reforesting with shade trees and flowers to beautify the holy city. Planting coconut trees around the mosque and along the main avenues to enhance the spiritual atmosphere. This initiative will transform our community into a green paradise while providing shade and beauty for generations to come.',
      category: 'Environment',
      icon: '🌳',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x250/10b981/FFFFFF?text=Public+Spaces' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/059669/FFFFFF?text=Tree+Planting' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/047857/FFFFFF?text=Flowers+Garden' },
      ],
      status: 'ongoing',
      progress: 60,
      budget: '$850K',
      targetAmount: 850000,
      raisedAmount: 510000,
      startDate: 'Jan 2025',
      donors: 298,
    },
    '3': {
      id: 3,
      title: 'Agriculture with Tool Baye',
      titleArabic: 'الزراعة مع أداة باي',
      description: 'Modern agricultural practices to support local farmers',
      fullDescription: 'Implementing modern agricultural practices and tools to support local farmers and enhance food security for the community. Using innovative farming techniques and sustainable methods. This project empowers our farming community with cutting-edge tools and knowledge to increase productivity and sustainability.',
      category: 'Agriculture',
      icon: '🌾',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x250/f59e0b/FFFFFF?text=Farming+Tools' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/d97706/FFFFFF?text=Crop+Fields' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/b45309/FFFFFF?text=Harvest+Season' },
      ],
      status: 'ongoing',
      progress: 45,
      budget: '$450K',
      targetAmount: 450000,
      raisedAmount: 202500,
      startDate: 'Mar 2025',
      donors: 187,
    },
    '4': {
      id: 4,
      title: 'Grand Mosque Renovation',
      titleArabic: 'تجديد المسجد الكبير',
      description: 'Comprehensive renovation while preserving historical significance',
      fullDescription: 'Comprehensive renovation and modernization of the Grand Mosque while preserving its historical and spiritual significance. Upgrading facilities, restoring architectural elements, and improving accessibility for worshippers. This sacred project honors our heritage while embracing modern amenities for enhanced worship experience.',
      category: 'Religious',
      icon: '🕌',
      media: [
        { type: 'image', uri: 'https://via.placeholder.com/400x250/059669/FFFFFF?text=Mosque+Exterior' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/047857/FFFFFF?text=Interior+Design' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/065f46/FFFFFF?text=Minaret+Restoration' },
        { type: 'image', uri: 'https://via.placeholder.com/400x250/10b981/FFFFFF?text=Prayer+Hall' },
      ],
      status: 'planning',
      progress: 15,
      budget: '$3.2M',
      targetAmount: 3200000,
      raisedAmount: 480000,
      startDate: 'Q4 2025',
      donors: 342,
    },
  };

  const project = projectsData[id as string];

  if (!project) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-600 text-lg">Project not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-emerald-600 font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' };
      case 'planning':
        return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' };
      case 'completed':
        return { bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-700' };
      default:
        return { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'In Progress';
      case 'planning':
        return 'Planning';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const statusColors = getStatusColor(project.status);

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
            {project.media.map((media, index) => (
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
            {project.media.map((_, index) => (
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
          {/* Project Header */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-5 mb-5">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-start flex-1">
                <View className="w-16 h-16 bg-emerald-100 rounded-2xl items-center justify-center mr-3 shadow-sm">
                  <Text className="text-4xl">{project.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-extrabold text-slate-800 mb-1">{project.title}</Text>
                  <Text className="text-emerald-600 text-sm font-bold">{project.titleArabic}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-slate-50 rounded-xl px-3 py-2">
                <Text className="text-slate-600 text-xs font-bold">{project.category}</Text>
              </View>
              <View className={`px-4 py-2 rounded-full border-2 ${statusColors.bg} ${statusColors.border}`}>
                <Text className={`text-sm font-extrabold ${statusColors.text}`}>
                  {getStatusText(project.status)}
                </Text>
              </View>
            </View>

            <Text className="text-slate-700 text-base leading-6 mb-4">{project.fullDescription}</Text>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-600 text-sm font-bold">Progress</Text>
                <Text className="text-emerald-600 text-sm font-extrabold">{project.progress}%</Text>
              </View>
              <View className="bg-slate-200 rounded-full h-3">
                <View
                  className="bg-emerald-600 h-3 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </View>
            </View>

            {/* Fundraising Stats */}
            <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border-2 border-emerald-200">
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className="text-emerald-600 text-xs font-bold mb-1">Raised</Text>
                  <Text className="text-emerald-700 text-2xl font-extrabold">
                    {formatCurrency(project.raisedAmount)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-emerald-600 text-xs font-bold mb-1">Goal</Text>
                  <Text className="text-slate-700 text-2xl font-extrabold">
                    {formatCurrency(project.targetAmount)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="text-emerald-600 text-2xl mr-2">👥</Text>
                <Text className="text-slate-700 text-sm font-bold">
                  {project.donors.toLocaleString()} donors supporting this project
                </Text>
              </View>
            </View>
          </View>

          {/* Project Details Grid */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-5 mb-5">
            <Text className="text-xl font-bold text-slate-800 mb-4">Project Details</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
                <Text className="text-slate-600 font-semibold">Budget</Text>
                <Text className="text-slate-800 font-extrabold text-lg">{project.budget}</Text>
              </View>
              <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
                <Text className="text-slate-600 font-semibold">Start Date</Text>
                <Text className="text-slate-800 font-extrabold text-lg">{project.startDate}</Text>
              </View>
              <View className="flex-row justify-between items-center py-3">
                <Text className="text-slate-600 font-semibold">Category</Text>
                <Text className="text-slate-800 font-extrabold text-lg">{project.category}</Text>
              </View>
            </View>
          </View>

          {/* Donate Button */}
          <Link href="/(tabs)/donate" asChild>
            <TouchableOpacity>
              <LinearGradient
                colors={['#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 rounded-3xl shadow-xl"
                style={{
                  shadowColor: '#059669',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-xl font-extrabold mr-2">Donate to this Project</Text>
                  <Text className="text-white text-2xl">💝</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
