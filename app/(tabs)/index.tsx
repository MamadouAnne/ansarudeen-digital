import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-blue-950 px-6 py-12">
          <View className="items-center text-center">
            <View className="w-20 h-20 bg-white/10 rounded-3xl items-center justify-center mb-4 border-2 border-blue-500/50">
              <Text className="text-white text-3xl font-bold">AD</Text>
            </View>
            <Text className="text-white text-4xl font-extrabold tracking-tight mb-2">Ansarudeen Digital</Text>
            <Text className="text-gray-100 text-xl font-medium">
              {isAuthenticated && user?.profile?.first_name 
                ? `Welcome back, ${user.profile.first_name}!` 
                : 'Building stronger communities together'}
            </Text>
            {isAuthenticated && user?.profile?.membership_id && (
              <Text className="text-white text-base font-semibold text-center mt-3 bg-white/10 rounded-full px-4 py-1">
                Member ID: {user.profile.membership_id}
              </Text>
            )}
          </View>
        </View>

        <View className="px-4 -mt-8">
          {/* Community Overview */}
          <View className="mb-8">
            <View className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-5">
              <Text className="text-xl font-bold text-gray-900 mb-4">Community Overview</Text>
              <View className="grid grid-cols-2 gap-4">
                {/* Members */}
                <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200/50">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg">👥</Text>
                    </View>
                    <Text className="text-blue-900 font-bold text-base">Members</Text>
                  </View>
                  <Text className="text-3xl font-bold text-blue-900">{quickStats.totalMembers.toLocaleString()}</Text>
                  <Text className="text-blue-700 text-sm mt-1">Active community</Text>
                </View>

                {/* Donations */}
                <View className="bg-green-50 rounded-2xl p-4 border border-green-200/50">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg">💰</Text>
                    </View>
                    <Text className="text-green-900 font-bold text-base">Donations</Text>
                  </View>
                  <Text className="text-3xl font-bold text-green-900">{formatCurrency(quickStats.totalDonations)}</Text>
                  <Text className="text-green-700 text-sm mt-1">Total raised</Text>
                </View>

                {/* Projects */}
                <View className="bg-purple-50 rounded-2xl p-4 border border-purple-200/50">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg">🏗️</Text>
                    </View>
                    <Text className="text-purple-900 font-bold text-base">Projects</Text>
                  </View>
                  <Text className="text-3xl font-bold text-purple-900">{quickStats.activeProjects}</Text>
                  <Text className="text-purple-700 text-sm mt-1">Active</Text>
                </View>

                {/* Events */}
                <View className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200/50">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-indigo-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg">📅</Text>
                    </View>
                    <Text className="text-indigo-900 font-bold text-base">Events</Text>
                  </View>
                  <Text className="text-3xl font-bold text-indigo-900">{quickStats.upcomingEvents}</Text>
                  <Text className="text-indigo-700 text-sm mt-1">This month</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4 px-2">Quick Actions</Text>
            <View className="space-y-3">
              <Link href="/(tabs)/donate" asChild>
                <TouchableOpacity className="bg-blue-600 rounded-2xl p-5 shadow-lg shadow-blue-500/30">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                      <Text className="text-white text-2xl">💝</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg">Make a Donation</Text>
                      <Text className="text-white/90 text-sm font-medium">Support our community initiatives</Text>
                    </View>
                    <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                      <Text className="text-white text-lg">→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>

              <Link href="/donation-tracker" asChild>
                <TouchableOpacity className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-green-500 rounded-xl items-center justify-center mr-4">
                      <Text className="text-white text-2xl">📊</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-lg">Donation Tracker</Text>
                      <Text className="text-gray-600 text-sm">Track community and personal donations</Text>
                    </View>
                    <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                      <Text className="text-gray-600 text-lg">→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>

              <Link href="/(tabs)/membership" asChild>
                <TouchableOpacity className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-purple-500 rounded-xl items-center justify-center mr-4">
                      <Text className="text-white text-2xl">🎫</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-lg">My Membership</Text>
                      <Text className="text-gray-600 text-sm">View your digital membership card</Text>
                    </View>
                    <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                      <Text className="text-gray-600 text-lg">→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4 px-2">Recent Activity</Text>
            <View className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
              {recentActivity.map((activity, index) => (
                <View key={activity.id} className={`p-4 flex-row items-center ${index < recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <View className={`w-10 h-10 rounded-full mr-4 items-center justify-center ${
                    activity.type === 'member' ? 'bg-blue-100' :
                    activity.type === 'donation' ? 'bg-green-100' :
                    'bg-amber-100'
                  }`}>
                    <Text className="text-xl">
                      {activity.type === 'member' ? '👤' : activity.type === 'donation' ? '💰' : '📅'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold">{activity.action}</Text>
                    <Text className="text-gray-500 text-sm">{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Call to Action */}
          <View className="bg-blue-900 rounded-3xl p-8 mb-8 items-center text-center overflow-hidden">
            {/* Decorative elements */}
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
            <View className="absolute -bottom-12 -left-8 w-24 h-24 bg-white/5 rounded-full" />
            
            <Text className="text-white font-bold text-3xl mb-3 tracking-tight">
              Help Us Grow
            </Text>
            <Text className="text-gray-200 text-lg mb-6 leading-7">
              Invite friends and family to join our digital community.
            </Text>
            <TouchableOpacity className="bg-white py-4 px-8 rounded-full shadow-md">
              <Text className="text-blue-800 font-bold text-lg">Share Invite Link</Text>
            </TouchableOpacity>
          </View>

          <View className="h-4"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}