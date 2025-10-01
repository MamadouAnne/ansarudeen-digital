import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DonateScreen() {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationPurpose, setDonationPurpose] = useState<string>('General Fund');
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = ['25', '50', '100', '250', '500'];
  const purposes = [
    { name: 'General Fund', arabic: 'صندوق عام', icon: '🤲' },
    { name: 'Education', arabic: 'تعليم', icon: '📚' },
    { name: 'Healthcare', arabic: 'رعاية صحية', icon: '🏥' },
    { name: 'Emergency Relief', arabic: 'إغاثة طارئة', icon: '🆘' },
    { name: 'Community Projects', arabic: 'مشاريع مجتمعية', icon: '🏗️' }
  ];

  const handleDonate = async () => {
    const amount = selectedAmount || customAmount;
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual payment processing
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Thank You!',
          `Your donation of $${amount} for ${donationPurpose} has been processed successfully.`,
          [{ text: 'OK' }]
        );
        setSelectedAmount('');
        setCustomAmount('');
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Donation failed. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Islamic-themed Header */}
        <LinearGradient
          colors={['#059669', '#047857', '#065f46']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-24 pb-12 relative overflow-hidden"
        >
          {/* Decorative Islamic pattern */}
          <View className="absolute inset-0 opacity-10">
            <View className="absolute top-4 right-4 w-28 h-28 border-4 border-white rounded-full" />
            <View className="absolute top-12 right-12 w-20 h-20 border-4 border-white rounded-full" />
            <View className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
          </View>

          <View className="items-center relative z-10 mt-8">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
              <Text className="text-3xl">💝</Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-1 text-center">
              Give Sadaqah
            </Text>
            <Text className="text-emerald-100 text-sm font-medium mb-2">
              صَدَقَة • Charity
            </Text>
            <Text className="text-white text-base font-medium text-center px-6">
              "The believer's shade on the Day of Resurrection will be their charity"
            </Text>
            <Text className="text-emerald-200 text-xs mt-1 font-medium">- Prophet Muhammad ﷺ</Text>
          </View>
        </LinearGradient>

        <View className="px-5 -mt-4">
          {/* Donation Amount Card */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
            <View className="flex-row items-center mb-5">
              <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                <Text className="text-emerald-600 text-xl">💰</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-800">Select Amount</Text>
            </View>

            {/* Predefined Amounts with Islamic styling */}
            <View className="flex-row flex-wrap gap-3 mb-5">
              {predefinedAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`px-7 py-3.5 rounded-2xl border-2 ${
                    selectedAmount === amount
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'bg-white border-emerald-300'
                  }`}
                >
                  <Text
                    className={`font-bold text-lg ${
                      selectedAmount === amount ? 'text-white' : 'text-emerald-700'
                    }`}
                  >
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount */}
            <View>
              <Text className="text-slate-700 mb-3 font-bold text-base">Custom Amount</Text>
              <View className="flex-row items-center bg-slate-50 border-2 border-emerald-200 rounded-2xl px-4 py-1">
                <Text className="text-3xl font-bold text-emerald-600 mr-2">$</Text>
                <TextInput
                  className="flex-1 py-3 text-xl font-bold text-slate-800"
                  placeholder="Enter amount"
                  placeholderTextColor="#94a3b8"
                  value={customAmount}
                  onChangeText={(value) => {
                    setCustomAmount(value);
                    setSelectedAmount('');
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Donation Purpose with Islamic Design */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
            <View className="flex-row items-center mb-5">
              <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-3">
                <Text className="text-amber-600 text-xl">🎯</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-800">Choose Purpose</Text>
            </View>
            <View className="space-y-3">
              {purposes.map((purpose) => (
                <TouchableOpacity
                  key={purpose.name}
                  onPress={() => setDonationPurpose(purpose.name)}
                  className={`p-4 rounded-2xl border-2 flex-row items-center ${
                    donationPurpose === purpose.name
                      ? 'bg-emerald-50 border-emerald-600'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${
                    donationPurpose === purpose.name ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    <Text className="text-2xl">{purpose.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-bold text-base ${
                        donationPurpose === purpose.name ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {purpose.name}
                    </Text>
                    <Text className={`text-xs font-medium ${
                      donationPurpose === purpose.name ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {purpose.arabic}
                    </Text>
                  </View>
                  {donationPurpose === purpose.name && (
                    <View className="w-6 h-6 bg-emerald-600 rounded-full items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Donation Summary with Islamic Design */}
          <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border-2 border-emerald-200 mb-5">
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">📋</Text>
              <Text className="text-xl font-bold text-emerald-900">Summary</Text>
            </View>
            <View className="bg-white rounded-2xl p-4 mb-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-600 font-semibold">Amount:</Text>
                <Text className="text-3xl font-extrabold text-emerald-600">
                  ${selectedAmount || customAmount || '0'}
                </Text>
              </View>
            </View>
            <View className="bg-white rounded-2xl p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-600 font-semibold">Purpose:</Text>
                <Text className="text-slate-800 font-bold">{donationPurpose}</Text>
              </View>
            </View>
          </View>

          {/* Donate Button with Gradient */}
          <TouchableOpacity
            onPress={handleDonate}
            disabled={loading || (!selectedAmount && !customAmount)}
          >
            <LinearGradient
              colors={loading || (!selectedAmount && !customAmount) ? ['#94a3b8', '#64748b'] : ['#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-5 rounded-2xl shadow-lg"
              style={{
                shadowColor: '#059669',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text className="text-white text-xl font-extrabold text-center">
                {loading ? 'Processing... ⏳' : 'Donate Now 💝'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Security Notice with Islamic Design */}
          <View className="mt-6 mb-6 bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-3xl border-2 border-teal-200">
            <View className="flex-row items-center justify-center mb-2">
              <Text className="text-2xl mr-2">🔒</Text>
              <Text className="text-teal-800 font-bold text-base">Secure & Encrypted</Text>
            </View>
            <Text className="text-teal-700 text-sm text-center font-medium">
              Your donation is protected with industry-standard security measures
            </Text>
            <View className="mt-3 pt-3 border-t border-teal-300">
              <Text className="text-teal-600 text-xs text-center italic">
                "Allah does not waste the reward of the good-doers" - Quran 9:120
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}