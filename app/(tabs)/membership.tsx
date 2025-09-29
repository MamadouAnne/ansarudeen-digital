import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function MembershipScreen() {
  const { user } = useAuth();
  const profile = user?.profile;

  if (!user || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Please sign in to view your membership card</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Enhanced Header */}
        <View className="bg-blue-600 px-6 py-12 relative overflow-hidden">
          {/* Background Pattern */}
          <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <View className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

          <View className="items-center relative z-10">
            <Text className="text-white text-3xl font-bold mb-2">
              Digital Membership
            </Text>
            <Text className="text-blue-100 text-lg font-medium">
              Your official Ansarudeen Digital card
            </Text>
          </View>
        </View>

        {/* Premium Membership Card */}
        <View className="mx-6 -mt-8 mb-8 relative z-10">
          <View className="bg-blue-600 rounded-3xl shadow-lg border border-blue-500/20 overflow-hidden relative">
            {/* Card Background Pattern */}
            <View className="absolute inset-0">
              <View className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
              <View className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
              <View className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-400/20 rounded-full" />
            </View>

            <View className="p-8 relative z-10">
              {/* Card Header */}
              <View className="flex-row justify-between items-start mb-8">
                <View>
                  <Text className="text-white text-xl font-bold">ANSARUDEEN</Text>
                  <Text className="text-blue-100 text-base font-medium">DIGITAL</Text>
                </View>
                <View className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <Text className="text-white text-sm font-bold">MEMBER</Text>
                </View>
              </View>

              {/* Member Info */}
              <View className="mb-8">
                <Text className="text-white text-2xl font-bold mb-1">
                  {profile.first_name || ''} {profile.last_name || ''}
                </Text>
                <Text className="text-blue-100 text-base">ID: {profile.membership_id || 'N/A'}</Text>
              </View>

              {/* Card Details Row */}
              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">Member Since</Text>
                  <Text className="text-white text-sm font-semibold">{profile.member_since || 'N/A'}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">Status</Text>
                  <View className="bg-green-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">{profile.membership_status || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Membership Type Banner */}
            <View className="bg-blue-700 px-8 py-3">
              <Text className="text-white text-center font-bold text-sm">
                {profile.membership_type || 'Full Member'}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6">
          {/* Enhanced Actions */}
          <View className="mb-8 space-y-4">
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-2xl shadow-lg"
              style={{
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center justify-center">
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-sm">📱</Text>
                </View>
                <Text className="text-white text-lg font-bold">
                  Download Digital Card
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border-2 border-blue-200 py-4 rounded-2xl shadow-sm">
              <View className="flex-row items-center justify-center">
                <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-600 text-sm">🔗</Text>
                </View>
                <Text className="text-blue-600 text-lg font-bold">
                  Share Membership
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* QR Code Section */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 items-center">
            <Text className="text-2xl font-bold text-gray-900 mb-6">Quick Verification</Text>
            <View className="w-32 h-32 bg-gray-100 rounded-2xl items-center justify-center border border-gray-200">
              <Text className="text-gray-500 text-xs text-center font-medium">
                QR Code{'\n'}Verification
              </Text>
            </View>
            <Text className="text-gray-600 text-sm mt-4 text-center">
              Scan this code for instant verification
            </Text>
          </View>

        </View>

        <View className="h-8"></View>
      </ScrollView>
    </SafeAreaView>
  );
}