import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-600 px-6 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <Link href="/(tabs)" asChild>
              <TouchableOpacity>
                <Text className="text-white text-lg">← Back</Text>
              </TouchableOpacity>
            </Link>
            <Text className="text-white text-xl font-bold">Donation Tracker</Text>
            <View style={{width: 50}}></View>
          </View>

          {/* Tab Selector */}
          <View className="flex-row bg-primary-700 rounded-lg p-1">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                activeTab === 'community' ? 'bg-white' : ''
              }`}
              onPress={() => setActiveTab('community')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'community' ? 'text-primary-600' : 'text-primary-100'
                }`}
              >
                Community
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                activeTab === 'personal' ? 'bg-white' : ''
              }`}
              onPress={() => setActiveTab('personal')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'personal' ? 'text-primary-600' : 'text-primary-100'
                }`}
              >
                Personal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 py-6">
          {activeTab === 'community' ? (
            <>
              {/* Community Overview */}
              <View className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                <Text className="text-xl font-bold text-gray-800 mb-4">Community Impact</Text>

                {/* Total Progress */}
                <View className="mb-6">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Total Raised</Text>
                    <Text className="text-gray-800 font-bold">
                      {formatCurrency(communityStats.totalRaised)} / {formatCurrency(communityStats.targetAmount)}
                    </Text>
                  </View>
                  <View className="bg-gray-200 rounded-full h-3 mb-2">
                    <View
                      className="bg-primary-600 h-3 rounded-full"
                      style={{
                        width: `${getProgressPercentage(communityStats.totalRaised, communityStats.targetAmount)}%`
                      }}
                    ></View>
                  </View>
                  <Text className="text-sm text-gray-600">
                    {getProgressPercentage(communityStats.totalRaised, communityStats.targetAmount).toFixed(1)}% of target achieved
                  </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between">
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-primary-600">
                      {communityStats.donorsCount}
                    </Text>
                    <Text className="text-gray-600 text-sm">Donors</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-green-600">
                      {communityStats.campaigns.length}
                    </Text>
                    <Text className="text-gray-600 text-sm">Active Campaigns</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-blue-600">
                      {Math.round((communityStats.totalRaised / communityStats.donorsCount))}
                    </Text>
                    <Text className="text-gray-600 text-sm">Avg. Donation</Text>
                  </View>
                </View>
              </View>

              {/* Campaigns */}
              <View className="space-y-4">
                <Text className="text-lg font-bold text-gray-800">Active Campaigns</Text>
                {communityStats.campaigns.map((campaign, index) => (
                  <View key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-bold text-gray-800">{campaign.name}</Text>
                      <Text className="text-sm text-gray-600">
                        {formatCurrency(campaign.raised)} / {formatCurrency(campaign.target)}
                      </Text>
                    </View>
                    <View className="bg-gray-200 rounded-full h-2 mb-2">
                      <View
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${getProgressPercentage(campaign.raised, campaign.target)}%`
                        }}
                      ></View>
                    </View>
                    <Text className="text-sm text-gray-600">
                      {getProgressPercentage(campaign.raised, campaign.target).toFixed(1)}% completed
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Personal Overview */}
              <View className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                <Text className="text-xl font-bold text-gray-800 mb-4">Your Contributions</Text>
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-3xl font-bold text-primary-600">
                      {formatCurrency(totalPersonalDonations)}
                    </Text>
                    <Text className="text-gray-600">Total Donated</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-green-600">
                      {personalDonations.length}
                    </Text>
                    <Text className="text-gray-600">Donations Made</Text>
                  </View>
                </View>
              </View>

              {/* Personal Donations History */}
              <View className="space-y-4">
                <Text className="text-lg font-bold text-gray-800">Donation History</Text>
                {personalDonations.map((donation) => (
                  <View key={donation.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="font-bold text-gray-800 mb-1">
                          {formatCurrency(donation.amount)}
                        </Text>
                        <Text className="text-gray-600 mb-1">{donation.purpose}</Text>
                        <Text className="text-sm text-gray-500">{donation.date}</Text>
                      </View>
                      <View className="bg-green-100 px-2 py-1 rounded-full">
                        <Text className="text-green-700 font-semibold text-xs">
                          {donation.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Make Another Donation */}
              <Link href="/(tabs)/donate" asChild>
                <TouchableOpacity className="mt-6 bg-primary-600 py-4 rounded-lg">
                  <Text className="text-white text-lg font-bold text-center">
                    Make Another Donation
                  </Text>
                </TouchableOpacity>
              </Link>
            </>
          )}

          <View className="h-8"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}