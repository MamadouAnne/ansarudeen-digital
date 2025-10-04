import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

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
  category: string;
  icon: string;
  media: MediaItem[];
  status: 'ongoing' | 'planning' | 'completed';
  progress: number;
  budget: string;
  startDate: string;
}

export default function ProjectsScreen() {
  const [activeMediaIndex, setActiveMediaIndex] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const projects: Project[] = [
    {
      id: 1,
      title: 'Sanitation Infrastructure',
      titleArabic: 'البنية التحتية للصرف الصحي',
      description: 'Setting up a synchronized and modern pipeline network with large pipes in the main arteries, connected to households through an automatic pumping system. Equipped with recovery stations connected to the ONAS network, discharging into the sea or designated locations.',
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
      startDate: 'Q3 2025',
    },
    {
      id: 2,
      title: 'Environment & Beautification',
      titleArabic: 'البيئة والتجميل',
      description: 'Creating public spaces, reforesting with shade trees and flowers to beautify the holy city. Planting coconut trees around the mosque and along the main avenues to enhance the spiritual atmosphere.',
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
      startDate: 'Jan 2025',
    },
    {
      id: 3,
      title: 'Agriculture with Tool Baye',
      titleArabic: 'الزراعة مع أداة باي',
      description: 'Implementing modern agricultural practices and tools to support local farmers and enhance food security for the community. Using innovative farming techniques and sustainable methods.',
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
      startDate: 'Mar 2025',
    },
    {
      id: 4,
      title: 'Grand Mosque Renovation',
      titleArabic: 'تجديد المسجد الكبير',
      description: 'Comprehensive renovation and modernization of the Grand Mosque while preserving its historical and spiritual significance. Upgrading facilities, restoring architectural elements, and improving accessibility for worshippers.',
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
      startDate: 'Q4 2025',
    },
  ];

  const handleMediaScroll = (projectId: number, index: number) => {
    setActiveMediaIndex((prev) => ({ ...prev, [projectId]: index }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-emerald-100 border-emerald-300 text-emerald-700';
      case 'planning':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      case 'completed':
        return 'bg-sky-100 border-sky-300 text-sky-700';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-700';
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

          {/* Back Button - positioned absolutely */}
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
                <Text className="text-3xl">🏗️</Text>
              </View>
              <Text className="text-white text-3xl font-bold mb-1">
                Community Projects
              </Text>
              <Text className="text-emerald-100 text-sm font-medium">
                المشاريع المجتمعية • Building Our Future
              </Text>
            </View>
          </View>
          </LinearGradient>
        </View>

        <View className="px-5 -mt-4">
          {/* Projects Summary */}
          <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border-2 border-emerald-200 mb-5">
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">📊</Text>
              <Text className="text-xl font-bold text-emerald-900">Overview</Text>
            </View>
            <View className="flex-row justify-between">
              <View className="bg-white rounded-2xl p-4 flex-1 mr-2">
                <Text className="text-3xl font-extrabold text-emerald-600">{projects.length}</Text>
                <Text className="text-slate-600 text-xs font-bold mt-1">Total Projects</Text>
              </View>
              <View className="bg-white rounded-2xl p-4 flex-1 mx-1">
                <Text className="text-3xl font-extrabold text-amber-600">
                  {projects.filter((p) => p.status === 'ongoing').length}
                </Text>
                <Text className="text-slate-600 text-xs font-bold mt-1">In Progress</Text>
              </View>
              <View className="bg-white rounded-2xl p-4 flex-1 ml-2">
                <Text className="text-3xl font-extrabold text-sky-600">
                  {projects.filter((p) => p.status === 'planning').length}
                </Text>
                <Text className="text-slate-600 text-xs font-bold mt-1">Planning</Text>
              </View>
            </View>
          </View>

          {/* Projects List */}
          <View className="space-y-5 mb-6">
            {projects.map((project) => (
              <View
                key={project.id}
                className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 overflow-hidden"
              >
                {/* Project Header */}
                <View className="p-5 border-b border-slate-100">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 bg-emerald-100 rounded-2xl items-center justify-center mr-3">
                        <Text className="text-2xl">{project.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-slate-800">{project.title}</Text>
                        <Text className="text-emerald-600 text-xs font-medium">{project.titleArabic}</Text>
                      </View>
                    </View>
                    <View className={`px-3 py-1.5 rounded-full border-2 ${getStatusColor(project.status)}`}>
                      <Text className={`text-xs font-extrabold ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-slate-50 rounded-xl px-3 py-2">
                    <Text className="text-slate-600 text-xs font-semibold">{project.category}</Text>
                  </View>
                </View>

                {/* Media Carousel */}
                <View className="relative">
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                      const index = Math.round(e.nativeEvent.contentOffset.x / width);
                      handleMediaScroll(project.id, index);
                    }}
                  >
                    {project.media.map((media, index) => (
                      <View key={index} style={{ width: width - 40 }}>
                        <Image
                          source={{ uri: media.uri }}
                          className="h-48 bg-slate-200"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>

                  {/* Media Indicators */}
                  <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
                    {project.media.map((_, index) => (
                      <View
                        key={index}
                        className={`h-2 rounded-full mx-1 ${
                          activeMediaIndex[project.id] === index
                            ? 'w-6 bg-white'
                            : 'w-2 bg-white/50'
                        }`}
                      />
                    ))}
                  </View>
                </View>

                {/* Project Details */}
                <View className="p-5">
                  <Text className="text-slate-700 text-sm leading-6 mb-4">{project.description}</Text>

                  {/* Progress Bar */}
                  <View className="mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-slate-600 text-xs font-bold">Progress</Text>
                      <Text className="text-emerald-600 text-xs font-extrabold">{project.progress}%</Text>
                    </View>
                    <View className="bg-slate-200 rounded-full h-2">
                      <View
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </View>
                  </View>

                  {/* Project Info Grid */}
                  <View className="flex-row justify-between space-x-2">
                    <View className="bg-emerald-50 rounded-xl p-3 flex-1 border border-emerald-200">
                      <Text className="text-emerald-600 text-xs font-bold mb-1">Budget</Text>
                      <Text className="text-slate-800 text-base font-extrabold">{project.budget}</Text>
                    </View>
                    <View className="bg-amber-50 rounded-xl p-3 flex-1 border border-amber-200 ml-2">
                      <Text className="text-amber-600 text-xs font-bold mb-1">Start Date</Text>
                      <Text className="text-slate-800 text-base font-extrabold">{project.startDate}</Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity className="mt-4">
                    <LinearGradient
                      colors={['#059669', '#047857']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="py-3 rounded-xl shadow-md"
                    >
                      <Text className="text-white text-center font-extrabold">Learn More</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Support CTA */}
          <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border-2 border-amber-200 mb-6">
            <View className="items-center">
              <Text className="text-3xl mb-3">💝</Text>
              <Text className="text-2xl font-bold text-amber-900 mb-2 text-center">
                Support Our Projects
              </Text>
              <Text className="text-amber-700 text-sm text-center mb-4 font-medium">
                Your contribution helps us build a better community
              </Text>
              <Link href="/(tabs)/donate" asChild>
                <TouchableOpacity className="w-full">
                  <LinearGradient
                    colors={['#f59e0b', '#d97706']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 rounded-2xl shadow-lg"
                  >
                    <Text className="text-white text-lg font-extrabold text-center">
                      Donate Now
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
