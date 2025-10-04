import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

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

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveSlide(index);
  };

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % 2; // 2 slides total
        carouselRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44;

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header Carousel */}
        <View className="flex-1">
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
          >
            {/* Slide 1: Header */}
            <View style={{ width }}>
              <View className="h-full overflow-hidden">
                <LinearGradient
                  colors={['#059669', '#047857', '#065f46']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="flex-1"
                >

                <View className="items-center justify-center h-full relative z-10">
                  {/* Crescent and Star Symbol */}
                  <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
                    <Text className="text-3xl">☪️</Text>
                  </View>
                  <Text className="text-white text-3xl font-bold tracking-wide mb-1" style={{ fontFamily: 'serif' }}>
                    Ansarudeen International
                  </Text>
                  <Text className="text-emerald-100 text-sm font-medium mb-2">
                    أنصار الدين • Helpers of the Faith
                  </Text>
                  <Text className="text-white text-base font-medium">
                    {isAuthenticated && user?.profile?.first_name
                      ? `As-salamu alaykum, ${user.profile.first_name}!`
                      : 'Building a stronger Muslim community'}
                  </Text>
                </View>
              </LinearGradient>
              </View>
            </View>

            {/* Slide 2: Fundraising */}
            <View style={{ width }}>
              <View className="h-full rounded-b-2xl overflow-hidden">
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="flex-1"
                >
                {/* Decorative Islamic pattern overlay */}
                <View className="absolute inset-0 opacity-10">
                  <View className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
                  <View className="absolute top-16 right-16 w-24 h-24 border-4 border-white rounded-full" />
                  <View className="absolute bottom-8 left-8 w-28 h-28 border-4 border-white rounded-full" />
                </View>
                  {/* Decorative Islamic pattern overlay */}
                  <View className="absolute inset-0 opacity-10">
                    <View className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full" />
                    <View className="absolute top-16 right-16 w-24 h-24 border-4 border-white rounded-full" />
                    <View className="absolute bottom-8 left-8 w-28 h-28 border-4 border-white rounded-full" />
                  </View>

                  <View className="flex-1">
                    {/* Project Card */}
                    <View className="bg-amber-50 rounded-b-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
                      {/* Project Header */}
                      <View className="p-3 border-b border-slate-100">
                        <View className="h-12 mb-2"></View>
                        <View className="flex-row items-center justify-between mb-2">
                          <View className="flex-row items-center flex-1">
                            <View className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl items-center justify-center mr-3 border-2 border-emerald-300 shadow-sm">
                              <Text className="text-2xl">🕌</Text>
                            </View>
                            <View>
                              <Text className="text-slate-800 text-base font-extrabold">Masjid Expansion</Text>
                              <Text className="text-emerald-600 text-xs font-semibold">توسعة المسجد</Text>
                            </View>
                          </View>
                          <View className="px-3 py-1.5 rounded-full border-2 bg-emerald-100 border-emerald-300 shadow-sm">
                            <Text className="text-xs font-extrabold text-emerald-700">
                              Active
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Progress Section */}
                      <View className="p-3">
                        <View className="mb-1.5">
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-slate-600 text-xs font-bold">Progress</Text>
                            <Text className="text-emerald-600 text-xs font-extrabold">45%</Text>
                          </View>
                          <View className="bg-slate-200 rounded-full h-1.5">
                            <View
                              className="bg-emerald-600 h-1.5 rounded-full"
                              style={{ width: '45%' }}
                            />
                          </View>
                        </View>

                        {/* Project Info */}
                        <View className="flex-row justify-between space-x-2 mb-3">
                          <View className="bg-emerald-50 rounded-lg p-2 flex-1 border border-emerald-200">
                            <Text className="text-emerald-600 text-xs font-bold">Raised</Text>
                            <Text className="text-slate-800 text-sm font-extrabold">{formatCurrency(45000)}</Text>
                          </View>
                          <View className="bg-amber-50 rounded-lg p-2 flex-1 border border-amber-200 ml-2">
                            <Text className="text-amber-600 text-xs font-bold">Goal</Text>
                            <Text className="text-slate-800 text-sm font-extrabold">{formatCurrency(100000)}</Text>
                          </View>
                        </View>

                        {/* Donate Button */}
                        <Link href="/projects" asChild>
                          <TouchableOpacity>
                            <LinearGradient
                              colors={['#059669', '#047857']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              className="py-4 rounded-2xl shadow-xl"
                              style={{
                                shadowColor: '#059669',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                              }}
                            >
                              <View className="flex-row items-center justify-center">
                                <Text className="text-white text-center font-extrabold text-lg mr-2">Donate Now</Text>
                                <Text className="text-white text-xl">💝</Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Link>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

          </ScrollView>

          {/* Pagination Dots */}
          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
            {[0, 1].map((index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  index === activeSlide ? 'bg-white w-6' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </View>
        </View>

        {/* Horizontal Quick Access Bar */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {/* Projects Card */}
            <Link href="/projects" asChild>
              <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-teal-100 shadow-sm mr-3 w-28">
                <View className="w-10 h-10 bg-teal-100 rounded-xl items-center justify-center mb-1.5">
                  <Text className="text-xl">🏗️</Text>
                </View>
                <Text className="text-slate-800 font-bold text-xs mb-0.5">Projects</Text>
                <Text className="text-slate-500 text-xs">Work</Text>
              </TouchableOpacity>
            </Link>

            {/* News/Blog Card */}
            <Link href="/news" asChild>
              <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-emerald-100 shadow-sm mr-3 w-28">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl items-center justify-center mb-1.5">
                  <Text className="text-xl">📰</Text>
                </View>
                <Text className="text-slate-800 font-bold text-xs mb-0.5">News</Text>
                <Text className="text-slate-500 text-xs">Updates</Text>
              </TouchableOpacity>
            </Link>

            {/* Events Card */}
            <TouchableOpacity className="bg-white rounded-2xl p-3 border-2 border-sky-100 shadow-sm mr-3 w-28">
              <View className="w-10 h-10 bg-sky-100 rounded-xl items-center justify-center mb-1.5">
                <Text className="text-xl">📅</Text>
              </View>
              <Text className="text-slate-800 font-bold text-xs mb-0.5">Events</Text>
              <Text className="text-slate-500 text-xs">Gatherings</Text>
            </TouchableOpacity>

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
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4 border-2 border-white/40">
                <Text className="text-4xl">🤝</Text>
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