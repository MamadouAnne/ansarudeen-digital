import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

export default function MembershipScreen() {
  const { user } = useAuth();
  const profile = user?.profile;

  if (!user || !profile) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">🎫</Text>
        </View>
        <Text className="text-slate-800 text-lg font-bold mb-2">Sign In Required</Text>
        <Text className="text-slate-600 text-center">Please sign in to view your membership card</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Islamic-themed Header */}
        <LinearGradient
          colors={['#059669', '#047857', '#065f46']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-14 pb-10 relative overflow-hidden"
        >
          {/* Decorative Islamic pattern */}
          <View className="absolute inset-0 opacity-10">
            <View className="absolute top-4 right-4 w-28 h-28 border-4 border-white rounded-full" />
            <View className="absolute top-12 right-12 w-20 h-20 border-4 border-white rounded-full" />
            <View className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
          </View>

          <View className="items-center relative z-10">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
              <Text className="text-3xl">🎫</Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-1">
              Digital Membership
            </Text>
            <Text className="text-emerald-100 text-sm font-medium mb-2">
              بِطَاقَة الْعُضْوِيَّة • Member Card
            </Text>
            <Text className="text-white text-base font-medium">
              Your official Ansarudeen Digital ID
            </Text>
          </View>
        </LinearGradient>

        {/* Premium Islamic Membership Card */}
        <View className="mx-5 -mt-12 mb-6 relative z-10">
          <LinearGradient
            colors={['#047857', '#059669', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl shadow-2xl overflow-hidden"
            style={{
              shadowColor: '#059669',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            {/* Card Islamic Pattern Background */}
            <View className="absolute inset-0 opacity-10">
              <View className="absolute top-0 right-0 w-40 h-40 border-4 border-white rounded-full -mr-20 -mt-20" />
              <View className="absolute top-8 right-8 w-32 h-32 border-4 border-white rounded-full -mr-16 -mt-16" />
              <View className="absolute bottom-0 left-0 w-36 h-36 border-4 border-white rounded-full -ml-18 -mb-18" />
              <View className="absolute bottom-6 left-6 w-24 h-24 border-4 border-white rounded-full -ml-12 -mb-12" />
            </View>

            <View className="p-7 relative z-10">
              {/* Card Header with Islamic Symbol */}
              <View className="flex-row justify-between items-start mb-8">
                <View>
                  <View className="flex-row items-center mb-1">
                    <Text className="text-white text-xl font-bold mr-2">☪️</Text>
                    <Text className="text-white text-xl font-extrabold">ANSARUDEEN</Text>
                  </View>
                  <Text className="text-emerald-100 text-sm font-semibold ml-7">أنصار الدين</Text>
                </View>
                <View className="bg-amber-500 rounded-2xl px-4 py-2 border-2 border-amber-400">
                  <Text className="text-white text-xs font-extrabold">MEMBER</Text>
                </View>
              </View>

              {/* Member Info */}
              <View className="mb-8">
                <Text className="text-white text-3xl font-extrabold mb-2">
                  {profile.first_name || ''} {profile.last_name || ''}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-emerald-100 text-base font-semibold">ID: </Text>
                  <Text className="text-white text-base font-bold">{profile.membership_id || 'N/A'}</Text>
                </View>
              </View>

              {/* Card Details Row */}
              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-emerald-200 text-xs uppercase tracking-wider mb-2 font-bold">Member Since</Text>
                  <Text className="text-white text-base font-extrabold">{profile.member_since || 'N/A'}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-emerald-200 text-xs uppercase tracking-wider mb-2 font-bold">Status</Text>
                  <View className="bg-amber-500 px-4 py-1.5 rounded-full border-2 border-amber-400">
                    <Text className="text-white text-xs font-extrabold">{profile.membership_status || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Membership Type Banner with Gold */}
            <View className="bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-3.5 border-t-2 border-amber-400">
              <Text className="text-white text-center font-extrabold text-base tracking-wide">
                {profile.membership_type || 'Full Member'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View className="px-5">
          {/* Enhanced Islamic-themed Actions */}
          <View className="mb-6 space-y-3">
            <TouchableOpacity>
              <LinearGradient
                colors={['#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-2xl shadow-lg"
                style={{
                  shadowColor: '#059669',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View className="flex-row items-center justify-center">
                  <View className="w-8 h-8 bg-white/25 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-base">📱</Text>
                  </View>
                  <Text className="text-white text-lg font-extrabold">
                    Download Digital Card
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border-2 border-emerald-300 py-4 rounded-2xl shadow-sm">
              <View className="flex-row items-center justify-center">
                <View className="w-8 h-8 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-emerald-600 text-base">🔗</Text>
                </View>
                <Text className="text-emerald-700 text-lg font-bold">
                  Share Membership
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* QR Code Section with Islamic Design */}
          <View className="bg-white rounded-3xl shadow-md border-2 border-emerald-100 p-7 mb-6 items-center">
            <View className="flex-row items-center mb-5">
              <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                <Text className="text-emerald-600 text-xl">✓</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-800">Quick Verification</Text>
            </View>
            <View className="w-36 h-36 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl items-center justify-center border-4 border-emerald-200 mb-4">
              <Text className="text-4xl mb-2">☪️</Text>
              <Text className="text-emerald-700 text-xs text-center font-bold">
                QR Code{'\n'}Verification
              </Text>
            </View>
            <Text className="text-slate-600 text-sm text-center font-medium px-4">
              Scan this code for instant verification at community events
            </Text>
          </View>

          {/* Member Benefits Section */}
          <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl border-2 border-amber-200 p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">✨</Text>
              <Text className="text-xl font-bold text-amber-900">Member Benefits</Text>
            </View>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Text className="text-emerald-600 text-base mr-2">✓</Text>
                <Text className="text-slate-700 text-base flex-1">Access to all community programs</Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-emerald-600 text-base mr-2">✓</Text>
                <Text className="text-slate-700 text-base flex-1">Prayer space & Islamic library</Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-emerald-600 text-base mr-2">✓</Text>
                <Text className="text-slate-700 text-base flex-1">Priority event registration</Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-emerald-600 text-base mr-2">✓</Text>
                <Text className="text-slate-700 text-base flex-1">Monthly community newsletter</Text>
              </View>
            </View>
          </View>

        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}