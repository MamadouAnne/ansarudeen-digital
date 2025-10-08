import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { supabase } from '@/lib/supabase';
import MedinaBayeProjectCard from '@/components/MedinaBayeProjectCard';

const { width } = Dimensions.get('window');

interface Project {
  id: number;
  title: string;
  title_arabic: string;
  raised_amount: number;
  target_amount: number;
  status: string;
}

interface Event {
  id: number;
  title: string;
  title_arabic: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  capacity: number;
  category: string;
}

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const carouselRef = useRef<ScrollView>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const quickStats = {
    totalMembers: 1247,
    totalDonations: 125750,
    activeProjects: 8,
    upcomingEvents: 3
  };

  const recentActivity = [
    { id: 1, action: 'New member joined', time: '2 hours ago', type: 'member' },
    { id: 2, action: '$500 donated to Education Fund', time: '4 hours ago', type: 'donation' },
    { id: 3, action: 'Community meeting scheduled', time: '1 day ago', type: 'event' },
    { id: 4, action: '$250 donated to Healthcare Initiative', time: '2 days ago', type: 'donation' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };


  // Fetch featured content on mount
  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  // Refresh featured content when screen comes into focus (e.g., after returning from admin)
  useFocusEffect(
    useCallback(() => {
      fetchFeaturedContent();
    }, [])
  );

  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);

      // Fetch featured projects regardless of status (planning, ongoing, or completed)
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, title_arabic, raised_amount, target_amount, status, featured')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (projectsError) {
        console.error('Error fetching featured projects:', projectsError);
      } else {
        console.log('Featured projects found:', projects?.length || 0, projects);
      }

      // Fetch featured events (upcoming events with featured = true, limit 3)
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, title_arabic, date, time, location, attendees, capacity, category, featured')
        .eq('status', 'upcoming')
        .eq('featured', true)
        .order('date', { ascending: true })
        .limit(3);

      if (eventsError) {
        console.error('Error fetching featured events:', eventsError);
      } else {
        console.log('Featured UPCOMING events found:', events?.length || 0, events);
      }

      setFeaturedProjects(projects || []);
      setFeaturedEvents(events || []);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll carousel
  useEffect(() => {
    const totalSlides = 1 + featuredProjects.length + featuredEvents.length; // 1 founder + projects + events
    if (totalSlides <= 1) return; // Don't auto-scroll if only founder slide

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % totalSlides;
        carouselRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [featuredProjects.length, featuredEvents.length, width]);

  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 54 : 64;

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header Carousel */}
        <View style={{ height: Platform.OS === 'android' ? 280 : 256 }}>
          {loading ? (
            <LinearGradient
              colors={['#059669', '#047857', '#065f46']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 items-center justify-center"
              style={{ paddingTop }}
            >
              <View className="absolute inset-0 opacity-10">
                <View className="absolute top-4 right-4 w-28 h-28 border-4 border-white rounded-full" />
                <View className="absolute top-12 right-12 w-20 h-20 border-4 border-white rounded-full" />
                <View className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
              </View>
              <ActivityIndicator size="large" color="#ffffff" />
            </LinearGradient>
          ) : (
            <>
              <ScrollView
                ref={carouselRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                className="h-64"
              >
              {/* Slide 1: Founder */}
              <View style={{ width, height: Platform.OS === 'android' ? 280 : 256 }}>
                <View style={{ height: Platform.OS === 'android' ? 280 : 256 }} className="overflow-hidden">
                  <LinearGradient
                    colors={['#065f46', '#047857', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ height: Platform.OS === 'android' ? 280 : 256 }}
                  >
                    {/* Decorative Islamic pattern overlay */}
                    <View className="absolute inset-0 opacity-10">
                      <View className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
                      <View className="absolute top-16 right-16 w-24 h-24 border-4 border-white rounded-full" />
                      <View className="absolute bottom-8 left-8 w-28 h-28 border-4 border-white rounded-full" />
                    </View>

                    {/* Galactic symbols */}
                    <View className="absolute inset-0 opacity-20">
                      <Text className="absolute top-12 left-8 text-white text-2xl">✨</Text>
                      <Text className="absolute top-24 right-12 text-white text-xl">⭐</Text>
                      <Text className="absolute top-32 left-16 text-white text-base">✦</Text>
                      <Text className="absolute top-40 right-20 text-white text-sm">★</Text>
                      <Text className="absolute bottom-20 left-12 text-white text-lg">✧</Text>
                      <Text className="absolute bottom-28 right-16 text-white text-base">◆</Text>
                      <Text className="absolute top-20 right-24 text-white text-xs">✦</Text>
                      <Text className="absolute bottom-32 left-20 text-white text-sm">⋆</Text>
                    </View>

                    <View className="items-center justify-center relative z-10 px-6" style={{ height: Platform.OS === 'android' ? 280 : 256, paddingTop: paddingTop - 10 }}>
                      <View className="items-center">
                        {/* Decorative top line */}
                        <View className="flex-row items-center mb-3">
                          <View className="w-12 h-0.5 bg-white/50"></View>
                          <View className="mx-2 w-1.5 h-1.5 bg-white/70 rounded-full"></View>
                          <View className="w-12 h-0.5 bg-white/50"></View>
                        </View>

                        {/* Founder Image with glow effect */}
                        <View className="mb-1.5">
                          <View className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-emerald-50 p-2 shadow-2xl">
                            <View className="w-full h-full rounded-full bg-white p-1">
                              <View className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-200">
                                <Image
                                  source={require('@/assets/images/founder.webp')}
                                  className="w-full h-full"
                                  resizeMode="cover"
                                />
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* App Name with letter spacing */}
                        <Text className="text-white text-xl font-extrabold tracking-wide mb-0.5" style={{ fontFamily: 'serif', letterSpacing: 2 }}>
                          ANSARUDEEN
                        </Text>
                        <Text className="text-emerald-50 text-xs font-bold tracking-widest mb-1" style={{ letterSpacing: 3 }}>
                          INTERNATIONAL
                        </Text>

                        {/* Arabic text with decorative borders */}
                        <View className="flex-row items-center">
                          <View className="w-6 h-px bg-white/30"></View>
                          <Text className="text-emerald-100 text-sm font-semibold mx-2">
                            أنصار الدين
                          </Text>
                          <View className="w-6 h-px bg-white/30"></View>
                        </View>

                        {/* Decorative bottom line */}
                        <View className="flex-row items-center mt-3">
                          <View className="w-8 h-0.5 bg-white/50"></View>
                          <View className="mx-2 w-1.5 h-1.5 bg-white/70 rounded-full"></View>
                          <View className="w-8 h-0.5 bg-white/50"></View>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              {/* Featured Projects */}
              {console.log('RENDERING carousel - featuredProjects.length:', featuredProjects.length)}
              {featuredProjects.map((project) => {
                console.log('RENDERING project card:', project.id, project.title);
                const progress = (project.raised_amount / project.target_amount) * 100;
                return (
                  <TouchableOpacity
                    key={`project-${project.id}`}
                    style={{ width, height: Platform.OS === 'android' ? 280 : 256 }}
                    onPress={() => router.push(`/projects/${project.id}`)}
                  >
                    <View style={{ height: Platform.OS === 'android' ? 280 : 256, paddingTop, paddingHorizontal: 20 }} className="overflow-hidden">
                      {/* Project Card - Exact match from projects list */}
                      <View className="rounded-3xl shadow-lg border-2 border-emerald-400 overflow-hidden">
                        <LinearGradient
                          colors={['#ffffff', '#f0fdf4', '#dcfce7']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          {/* Project Header */}
                          <View className="p-3">
                            <View className="flex-row items-center mb-2">
                              <View className="w-12 h-12 bg-emerald-100 rounded-2xl items-center justify-center mr-3 shadow-sm">
                                <Text className="text-2xl">🏗️</Text>
                              </View>
                              <View className="flex-1">
                                <Text className="text-base font-extrabold text-slate-800 mb-0.5" numberOfLines={1}>
                                  {project.title}
                                </Text>
                                <Text className="text-emerald-600 text-xs font-semibold" numberOfLines={1}>
                                  {project.title_arabic}
                                </Text>
                              </View>
                            </View>

                            {/* Status Badge */}
                            <View className="bg-amber-100 border-2 border-amber-300 rounded-full px-3 py-1 self-start mb-2">
                              <Text className="text-amber-700 text-xs font-extrabold">
                                {project.status === 'planning' ? 'Planning' : project.status === 'ongoing' ? 'In Progress' : 'Completed'}
                              </Text>
                            </View>

                            {/* Progress Bar */}
                            <View className="mb-2">
                              <View className="flex-row justify-between mb-1">
                                <Text className="text-slate-600 text-xs font-bold">Progress</Text>
                                <Text className="text-emerald-600 text-xs font-extrabold">{Math.round(progress)}%</Text>
                              </View>
                              <View className="bg-slate-200 rounded-full h-2">
                                <View
                                  className="bg-emerald-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </View>
                            </View>

                            {/* Fundraising Info */}
                            <View className="flex-row justify-between items-center">
                              <View>
                                <Text className="text-slate-500 text-xs font-semibold mb-0.5">Raised</Text>
                                <Text className="text-emerald-600 text-base font-extrabold">
                                  {formatCurrency(project.raised_amount)}
                                </Text>
                              </View>
                              <View className="items-end">
                                <Text className="text-slate-500 text-xs font-semibold mb-0.5">Goal</Text>
                                <Text className="text-slate-700 text-base font-extrabold">
                                  {formatCurrency(project.target_amount)}
                                </Text>
                              </View>
                              <View className="flex-row items-center bg-emerald-600 px-3 py-2 rounded-full">
                                <Text className="text-white font-extrabold text-xs mr-1">View</Text>
                                <Text className="text-white text-sm">→</Text>
                              </View>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Featured Events */}
              {featuredEvents.map((event) => {
                const getCategoryColor = (category: string) => {
                  switch (category) {
                    case 'Fundraising': return '#8B5CF6';
                    case 'Education': return '#3B82F6';
                    case 'Religious': return '#10B981';
                    case 'Healthcare': return '#EF4444';
                    case 'Environment': return '#059669';
                    default: return '#6B7280';
                  }
                };

                return (
                  <TouchableOpacity
                    key={`event-${event.id}`}
                    style={{ width, height: Platform.OS === 'android' ? 280 : 256 }}
                    onPress={() => router.push(`/events/${event.id}`)}
                  >
                    <View style={{ height: Platform.OS === 'android' ? 280 : 256, paddingTop, paddingHorizontal: 20 }} className="overflow-hidden">
                      {/* Event Card - Exact match from events page */}
                      <View className="bg-white rounded-3xl overflow-hidden border-2 border-emerald-200/60 shadow-lg">
                        {/* Category badge - Top Right */}
                        <View
                          className="absolute top-2 right-2 z-10 px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: getCategoryColor(event.category) }}
                        >
                          <Text className="text-white font-bold text-xs">
                            {event.category}
                          </Text>
                        </View>

                        {/* Event Title at top */}
                        <View className="p-3 pb-2">
                          <Text className="text-slate-900 text-base font-bold mb-1" numberOfLines={1}>
                            {event.title}
                          </Text>
                          <Text className="text-emerald-600 text-xs font-semibold" numberOfLines={1}>
                            {event.title_arabic}
                          </Text>
                        </View>

                        {/* Event Details */}
                        <View className="px-3 pb-3">
                          {/* Info Cards Row */}
                          <View className="flex-row mb-2">
                            {/* Date Card */}
                            <View className="flex-1 bg-emerald-50 rounded-2xl p-2 mr-1 border border-emerald-200/50">
                              <View className="flex-row items-center mb-0.5">
                                <Text className="text-emerald-600 text-xs font-bold">📅 Date</Text>
                              </View>
                              <Text className="text-slate-800 font-bold text-xs" numberOfLines={1}>
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Text>
                              <Text className="text-slate-500 text-xs" numberOfLines={1}>
                                {event.time.split(' - ')[0]}
                              </Text>
                            </View>

                            {/* Location Card */}
                            <View className="flex-1 bg-purple-50 rounded-2xl p-2 ml-1 border border-purple-200/50">
                              <View className="flex-row items-center mb-0.5">
                                <Text className="text-purple-600 text-xs font-bold">📍 Location</Text>
                              </View>
                              <Text className="text-slate-800 font-bold text-xs" numberOfLines={2}>
                                {event.location}
                              </Text>
                            </View>
                          </View>

                          {/* Attendees */}
                          <View className="flex-row items-center bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                            <Text className="text-emerald-700 text-xs font-bold flex-1">
                              👥 {event.attendees} attending
                            </Text>
                            <View className="bg-emerald-600 px-3 py-1 rounded-full">
                              <Text className="text-white font-bold text-xs">View →</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              </ScrollView>
            </>
          )}
        </View>

        {/* Horizontal Quick Access Bar */}
        <View className="mb-10 mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {/* Projects Card */}
            <Link href="/projects/" asChild>
              <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-teal-100 shadow-sm mr-3 w-28">
                <View className="w-10 h-10 bg-teal-100 rounded-xl items-center justify-center mb-1.5">
                  <Text className="text-xl">🏗️</Text>
                </View>
                <Text className="text-slate-800 font-bold text-xs mb-0.5">Projects</Text>
                <Text className="text-slate-500 text-xs">Work</Text>
              </TouchableOpacity>
            </Link>

            {/* News/Blog Card */}
            <Link href="/news/" asChild>
              <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-emerald-100 shadow-sm mr-3 w-28">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl items-center justify-center mb-1.5">
                  <Text className="text-xl">📰</Text>
                </View>
                <Text className="text-slate-800 font-bold text-xs mb-0.5">News</Text>
                <Text className="text-slate-500 text-xs">Updates</Text>
              </TouchableOpacity>
            </Link>

            {/* Events Card */}
            <Link href="/events/" asChild>
              <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-sky-100 shadow-sm mr-3 w-28">
                <View className="w-10 h-10 bg-sky-100 rounded-xl items-center justify-center mb-1.5">
                  <Text className="text-xl">📅</Text>
                </View>
                <Text className="text-slate-800 font-bold text-xs mb-0.5">Events</Text>
                <Text className="text-slate-500 text-xs">Gatherings</Text>
              </TouchableOpacity>
            </Link>

            {/* Resources Card */}
            <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-amber-100 shadow-sm mr-3 w-28">
              <View className="w-10 h-10 bg-amber-100 rounded-xl items-center justify-center mb-1.5">
                <Text className="text-xl">📚</Text>
              </View>
              <Text className="text-slate-800 font-bold text-xs mb-0.5">Resources</Text>
              <Text className="text-slate-500 text-xs">Library</Text>
            </TouchableOpacity>

            {/* About Us Card */}
            <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-purple-100 shadow-sm mr-3 w-28">
              <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center mb-1.5">
                <Text className="text-xl">🕌</Text>
              </View>
              <Text className="text-slate-800 font-bold text-xs mb-0.5">About Us</Text>
              <Text className="text-slate-500 text-xs">Mission</Text>
            </TouchableOpacity>

            {/* Contact Card */}
            <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-rose-100 shadow-sm mr-3 w-28">
              <View className="w-10 h-10 bg-rose-100 rounded-xl items-center justify-center mb-1.5">
                <Text className="text-xl">📞</Text>
              </View>
              <Text className="text-slate-800 font-bold text-xs mb-0.5">Contact</Text>
              <Text className="text-slate-500 text-xs">Get in touch</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Medina Baye Project Section */}
        <MedinaBayeProjectCard />

        <View className="px-4">
          {/* Community Overview with Islamic Design */}
          <View className="mb-6">
            <View className="bg-white rounded-3xl shadow-lg border border-emerald-100 p-6">
              <View className="flex-row items-center mb-5">
                <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-emerald-600 text-xl">🕌</Text>
                </View>
                <Text className="text-2xl font-bold text-slate-800">Community Impact</Text>
              </View>
              <View className="grid grid-cols-2 gap-3">
                {/* Members */}
                <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border-2 border-emerald-200">
                  <View className="flex-row items-center mb-2">
                    <View className="w-9 h-9 bg-emerald-600 rounded-full items-center justify-center mr-2">
                      <Text className="text-white text-base">👥</Text>
                    </View>
                    <Text className="text-emerald-900 font-bold text-sm">Members</Text>
                  </View>
                  <Text className="text-3xl font-extrabold text-emerald-800">{quickStats.totalMembers.toLocaleString()}</Text>
                  <Text className="text-emerald-600 text-xs mt-1 font-medium">مُؤْمِنُونَ • Believers</Text>
                </View>

                {/* Donations */}
                <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border-2 border-amber-200">
                  <View className="flex-row items-center mb-2">
                    <View className="w-9 h-9 bg-amber-500 rounded-full items-center justify-center mr-2">
                      <Text className="text-white text-base">💝</Text>
                    </View>
                    <Text className="text-amber-900 font-bold text-sm">Sadaqah</Text>
                  </View>
                  <Text className="text-3xl font-extrabold text-amber-800">{formatCurrency(quickStats.totalDonations)}</Text>
                  <Text className="text-amber-600 text-xs mt-1 font-medium">صَدَقَة • Charity</Text>
                </View>

                {/* Projects */}
                <View className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-4 border-2 border-teal-200">
                  <View className="flex-row items-center mb-2">
                    <View className="w-9 h-9 bg-teal-600 rounded-full items-center justify-center mr-2">
                      <Text className="text-white text-base">🏗️</Text>
                    </View>
                    <Text className="text-teal-900 font-bold text-sm">Projects</Text>
                  </View>
                  <Text className="text-3xl font-extrabold text-teal-800">{quickStats.activeProjects}</Text>
                  <Text className="text-teal-600 text-xs mt-1 font-medium">عَمَل • Works</Text>
                </View>

                {/* Events */}
                <View className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-4 border-2 border-sky-200">
                  <View className="flex-row items-center mb-2">
                    <View className="w-9 h-9 bg-sky-600 rounded-full items-center justify-center mr-2">
                      <Text className="text-white text-base">📅</Text>
                    </View>
                    <Text className="text-sky-900 font-bold text-sm">Events</Text>
                  </View>
                  <Text className="text-3xl font-extrabold text-sky-800">{quickStats.upcomingEvents}</Text>
                  <Text className="text-sky-600 text-xs mt-1 font-medium">مَجْلِس • Gatherings</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions with Islamic Theme */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4 px-1">
              <Text className="text-2xl font-bold text-slate-800 flex-1">Quick Actions</Text>
              <Text className="text-emerald-600 text-sm font-medium">عَمَل • Actions</Text>
            </View>
            <View className="space-y-3">
              <Link href="/(tabs)/donate" asChild>
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#059669', '#047857']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded-2xl p-5 shadow-lg"
                  >
                    <View className="flex-row items-center">
                      <View className="w-14 h-14 bg-white/25 rounded-2xl items-center justify-center mr-4 border border-white/30">
                        <Text className="text-white text-3xl">💝</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-extrabold text-lg mb-1">Give Sadaqah</Text>
                        <Text className="text-emerald-50 text-sm font-medium">Support our community initiatives</Text>
                      </View>
                      <View className="w-9 h-9 bg-white/25 rounded-full items-center justify-center">
                        <Text className="text-white text-xl font-bold">→</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>

              <Link href="/donation-tracker" asChild>
                <TouchableOpacity className="bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-sm">
                  <View className="flex-row items-center">
                    <View className="w-14 h-14 bg-emerald-100 rounded-2xl items-center justify-center mr-4">
                      <Text className="text-emerald-600 text-3xl">📊</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-bold text-lg mb-1">Donation Tracker</Text>
                      <Text className="text-slate-600 text-sm">Track community contributions</Text>
                    </View>
                    <View className="w-9 h-9 bg-emerald-100 rounded-full items-center justify-center">
                      <Text className="text-emerald-600 text-xl font-bold">→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>

              <Link href="/(tabs)/membership" asChild>
                <TouchableOpacity className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-sm">
                  <View className="flex-row items-center">
                    <View className="w-14 h-14 bg-amber-100 rounded-2xl items-center justify-center mr-4">
                      <Text className="text-amber-600 text-3xl">🎫</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-bold text-lg mb-1">My Membership</Text>
                      <Text className="text-slate-600 text-sm">View your digital ID card</Text>
                    </View>
                    <View className="w-9 h-9 bg-amber-100 rounded-full items-center justify-center">
                      <Text className="text-amber-600 text-xl font-bold">→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Recent Activity with Islamic Theme */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4 px-1">
              <Text className="text-2xl font-bold text-slate-800 flex-1">Recent Activity</Text>
              <Text className="text-emerald-600 text-sm font-medium">أَخْبَار • News</Text>
            </View>
            <View className="bg-white rounded-3xl border-2 border-emerald-100 shadow-md overflow-hidden">
              {recentActivity.map((activity, index) => (
                <View key={activity.id} className={`p-4 flex-row items-center ${index < recentActivity.length - 1 ? 'border-b-2 border-slate-50' : ''}`}>
                  <View className={`w-12 h-12 rounded-2xl mr-4 items-center justify-center ${
                    activity.type === 'member' ? 'bg-emerald-100' :
                    activity.type === 'donation' ? 'bg-amber-100' :
                    'bg-sky-100'
                  }`}>
                    <Text className="text-2xl">
                      {activity.type === 'member' ? '👤' : activity.type === 'donation' ? '💰' : '📅'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-bold text-base">{activity.action}</Text>
                    <Text className="text-slate-500 text-sm mt-0.5">{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Call to Action with Islamic Design */}
          <LinearGradient
            colors={['#047857', '#059669', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-8 mb-8 items-center overflow-hidden"
          >
            {/* Decorative Islamic pattern */}
            <View className="absolute inset-0 opacity-10">
              <View className="absolute top-4 right-6 w-24 h-24 border-4 border-white rounded-full" />
              <View className="absolute top-12 right-14 w-16 h-16 border-4 border-white rounded-full" />
              <View className="absolute bottom-4 left-6 w-20 h-20 border-4 border-white rounded-full" />
              <View className="absolute bottom-12 left-14 w-12 h-12 border-4 border-white rounded-full" />
            </View>

            <View className="relative z-10">
              {/* Founder Image */}
              <View className="w-20 h-20 rounded-full bg-white p-1 mb-4 shadow-2xl">
                <View className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-200">
                  <Image
                    source={require('@/assets/images/founder.webp')}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>
              <Text className="text-white font-extrabold text-3xl mb-2 tracking-tight text-center">
                Spread the Word
              </Text>
              <Text className="text-emerald-50 text-base mb-1 text-center font-medium">
                ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ
              </Text>
              <Text className="text-emerald-100 text-base mb-6 leading-6 text-center px-2">
                Invite friends and family to join our blessed community
              </Text>
              <TouchableOpacity className="bg-white py-4 px-10 rounded-full shadow-xl">
                <Text className="text-emerald-700 font-extrabold text-lg">Share Invite Link</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View className="h-4"></View>
        </View>
      </ScrollView>
    </View>
  );
}