import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, Stack } from 'expo-router';
import { getAllProjects, Project } from '@/services/projects';

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
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
                <Text className="text-3xl">🏗️</Text>
              </View>
              <Text className="text-white text-3xl font-bold mb-1">
                Community Projects
              </Text>
              <Text className="text-emerald-100 text-sm font-medium mb-2">
                المشاريع المجتمعية • Building Our Future
              </Text>
            </View>
          </View>
          </LinearGradient>
        </View>

        <View className="px-5 -mt-6">
          {/* Loading State */}
          {loading && (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#059669" />
              <Text className="text-slate-600 mt-4">Loading projects...</Text>
            </View>
          )}

          {/* Projects Summary */}
          {!loading && (
          <>
          <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-300/50 mb-5 shadow-sm">
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

          {/* Project Cards Grid */}
          <View className="mb-6">
            {projects.map((project) => {
              const statusColors = getStatusColor(project.status);
              return (
                <TouchableOpacity
                  key={project.id}
                  onPress={() => router.push(`/projects/${project.id}`)}
                  className="bg-white rounded-3xl shadow-md border border-emerald-200/60 overflow-hidden mb-4"
                >
                  {/* Project Header */}
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View className="w-14 h-14 bg-emerald-100 rounded-2xl items-center justify-center mr-3 shadow-sm">
                          <Text className="text-3xl">{project.icon}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-extrabold text-slate-800 mb-0.5">{project.title}</Text>
                          <Text className="text-emerald-600 text-xs font-semibold">{project.titleArabic}</Text>
                        </View>
                      </View>
                      <View className={`px-3 py-1.5 rounded-full border-2 ${statusColors.bg} ${statusColors.border}`}>
                        <Text className={`text-xs font-extrabold ${statusColors.text}`}>
                          {getStatusText(project.status)}
                        </Text>
                      </View>
                    </View>

                    {/* Category Badge */}
                    <View className="bg-slate-50 rounded-xl px-3 py-2 mb-3 inline-flex self-start">
                      <Text className="text-slate-600 text-xs font-bold">{project.category}</Text>
                    </View>

                    {/* Description */}
                    <Text className="text-slate-600 text-sm leading-5 mb-3" numberOfLines={2}>
                      {project.description}
                    </Text>

                    {/* Progress Bar */}
                    <View className="mb-3">
                      <View className="flex-row justify-between mb-1.5">
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

                    {/* Fundraising Info */}
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-slate-500 text-xs font-semibold mb-0.5">Raised</Text>
                        <Text className="text-emerald-600 text-lg font-extrabold">
                          {formatCurrency(project.raisedAmount)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-slate-500 text-xs font-semibold mb-0.5">Goal</Text>
                        <Text className="text-slate-700 text-lg font-extrabold">
                          {formatCurrency(project.targetAmount)}
                        </Text>
                      </View>
                      <View className="flex-row items-center bg-emerald-600 px-4 py-2 rounded-full">
                        <Text className="text-white font-extrabold text-sm mr-1">View Details</Text>
                        <Text className="text-white text-base">→</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Support CTA */}
          <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border border-amber-300/50 mb-6 shadow-sm">
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
          </>
          )}
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
