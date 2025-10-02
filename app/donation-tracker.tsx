import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function DonationTrackerScreen() {
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('community');

  // Mock data
  const communityStats = {
    totalRaised: 125750,
    targetAmount: 200000,
    donorsCount: 234,
    campaigns: [
      { name: 'Education Fund', raised: 45000, target: 60000 },
      { name: 'Healthcare Initiative', raised: 32500, target: 50000 },
      { name: 'Emergency Relief', raised: 28250, target: 40000 },
      { name: 'Community Center', raised: 20000, target: 50000 }
    ]
  };

  const personalDonations = [
    { id: 1, date: '2024-09-20', amount: 100, purpose: 'Education Fund', status: 'Completed' },
    { id: 2, date: '2024-08-15', amount: 50, purpose: 'Healthcare Initiative', status: 'Completed' },
    { id: 3, date: '2024-07-30', amount: 250, purpose: 'Emergency Relief', status: 'Completed' },
    { id: 4, date: '2024-07-01', amount: 75, purpose: 'General Fund', status: 'Completed' },
    { id: 5, date: '2024-06-15', amount: 200, purpose: 'Community Center', status: 'Completed' }
  ];

  const totalPersonalDonations = personalDonations.reduce((sum, donation) => sum + donation.amount, 0);

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Islamic-themed Header */}
        <LinearGradient
          colors={['#059669', '#047857', '#065f46']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pb-12 relative overflow-hidden"
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
                <Text className="text-3xl">📊</Text>
              </View>
              <Text className="text-white text-3xl font-bold mb-1">
                Donation Tracker
              </Text>
              <Text className="text-emerald-100 text-sm font-medium">
                تَتَبُّع الصَّدَقَات • Track Sadaqah
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tab Selector */}
        <View className="px-5 -mt-8 mb-4 relative z-10">
          <View className="flex-row bg-white rounded-2xl p-1 border-2 border-emerald-100 shadow-md">
            <TouchableOpacity
              className={`flex-1 py-4 rounded-xl ${
                activeTab === 'community' ? 'bg-emerald-600' : ''
              }`}
              onPress={() => setActiveTab('community')}
            >
              <Text
                className={`text-center font-bold ${
                  activeTab === 'community' ? 'text-white' : 'text-slate-700'
                }`}
              >
                Community
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 rounded-xl ${
                activeTab === 'personal' ? 'bg-emerald-600' : ''
              }`}
              onPress={() => setActiveTab('personal')}
            >
              <Text
                className={`text-center font-bold ${
                  activeTab === 'personal' ? 'text-white' : 'text-slate-700'
                }`}
              >
                Personal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5">
          {activeTab === 'community' ? (
            <>
              {/* Community Overview */}
              <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
                <View className="flex-row items-center mb-5">
                  <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-emerald-600 text-xl">🕌</Text>
                  </View>
                  <Text className="text-2xl font-bold text-slate-800">Community Impact</Text>
                </View>

                {/* Total Progress */}
                <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 mb-5 border-2 border-emerald-200">
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-slate-700 font-bold">Total Raised</Text>
                    <Text className="text-slate-800 font-extrabold">
                      {formatCurrency(communityStats.totalRaised)} / {formatCurrency(communityStats.targetAmount)}
                    </Text>
                  </View>
                  <View className="bg-slate-200 rounded-full h-4 mb-2">
                    <View
                      className="bg-emerald-600 h-4 rounded-full"
                      style={{
                        width: `${getProgressPercentage(communityStats.totalRaised, communityStats.targetAmount)}%`
                      }}
                    ></View>
                  </View>
                  <Text className="text-sm text-emerald-700 font-semibold">
                    {getProgressPercentage(communityStats.totalRaised, communityStats.targetAmount).toFixed(1)}% of target achieved
                  </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between">
                  <View className="bg-emerald-50 rounded-2xl p-4 items-center flex-1 mr-2 border border-emerald-200">
                    <Text className="text-3xl font-extrabold text-emerald-600">
                      {communityStats.donorsCount}
                    </Text>
                    <Text className="text-slate-600 text-xs font-bold mt-1">Donors</Text>
                  </View>
                  <View className="bg-amber-50 rounded-2xl p-4 items-center flex-1 mx-1 border border-amber-200">
                    <Text className="text-3xl font-extrabold text-amber-600">
                      {communityStats.campaigns.length}
                    </Text>
                    <Text className="text-slate-600 text-xs font-bold mt-1">Campaigns</Text>
                  </View>
                  <View className="bg-sky-50 rounded-2xl p-4 items-center flex-1 ml-2 border border-sky-200">
                    <Text className="text-3xl font-extrabold text-sky-600">
                      ${Math.round((communityStats.totalRaised / communityStats.donorsCount))}
                    </Text>
                    <Text className="text-slate-600 text-xs font-bold mt-1">Avg.</Text>
                  </View>
                </View>
              </View>

              {/* Campaigns */}
              <View className="space-y-3 mt-5">
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl font-bold text-slate-800 flex-1">Active Campaigns</Text>
                  <Text className="text-emerald-600 text-xs font-medium">حَمَلات • Campaigns</Text>
                </View>
                {communityStats.campaigns.map((campaign, index) => (
                  <View key={index} className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="font-bold text-slate-800 text-base">{campaign.name}</Text>
                      <Text className="text-sm text-slate-600 font-semibold">
                        {formatCurrency(campaign.raised)} / {formatCurrency(campaign.target)}
                      </Text>
                    </View>
                    <View className="bg-slate-200 rounded-full h-3 mb-2">
                      <View
                        className="bg-emerald-600 h-3 rounded-full"
                        style={{
                          width: `${getProgressPercentage(campaign.raised, campaign.target)}%`
                        }}
                      ></View>
                    </View>
                    <Text className="text-sm text-emerald-700 font-bold">
                      {getProgressPercentage(campaign.raised, campaign.target).toFixed(1)}% completed
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Personal Overview */}
              <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
                <View className="flex-row items-center mb-5">
                  <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-emerald-600 text-xl">💰</Text>
                  </View>
                  <Text className="text-2xl font-bold text-slate-800">Your Contributions</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <View className="bg-emerald-50 rounded-2xl p-4 flex-1 mr-3 border-2 border-emerald-200">
                    <Text className="text-4xl font-extrabold text-emerald-600">
                      {formatCurrency(totalPersonalDonations)}
                    </Text>
                    <Text className="text-slate-600 font-bold text-sm mt-2">Total Sadaqah</Text>
                  </View>
                  <View className="bg-amber-50 rounded-2xl p-4 flex-1 border-2 border-amber-200">
                    <Text className="text-4xl font-extrabold text-amber-600">
                      {personalDonations.length}
                    </Text>
                    <Text className="text-slate-600 font-bold text-sm mt-2">Donations</Text>
                  </View>
                </View>
              </View>

              {/* Personal Donations History */}
              <View className="space-y-3 mt-5">
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl font-bold text-slate-800 flex-1">Donation History</Text>
                  <Text className="text-emerald-600 text-xs font-medium">تَارِيخ • History</Text>
                </View>
                {personalDonations.map((donation) => (
                  <View key={donation.id} className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="font-extrabold text-slate-800 text-xl mb-2">
                          {formatCurrency(donation.amount)}
                        </Text>
                        <Text className="text-slate-700 font-semibold mb-1">{donation.purpose}</Text>
                        <Text className="text-sm text-slate-500 font-medium">{donation.date}</Text>
                      </View>
                      <View className="bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300">
                        <Text className="text-emerald-700 font-extrabold text-xs">
                          {donation.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Make Another Donation */}
              <Link href="/(tabs)/donate" asChild>
                <TouchableOpacity className="mt-6">
                  <LinearGradient
                    colors={['#059669', '#047857']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-5 rounded-2xl shadow-lg"
                  >
                    <Text className="text-white text-lg font-extrabold text-center">
                      Give Another Sadaqah 💝
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            </>
          )}

          <View className="h-8"></View>
        </View>
      </ScrollView>
    </View>
  );
}