import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DonateScreen() {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationPurpose, setDonationPurpose] = useState<string>('General Fund');
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = ['25', '50', '100', '250', '500'];
  const purposes = ['General Fund', 'Education', 'Healthcare', 'Emergency Relief', 'Community Projects'];

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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-600 px-6 py-8">
          <Text className="text-white text-2xl font-bold text-center">
            Make a Donation
          </Text>
          <Text className="text-primary-100 text-center mt-2">
            Support our community initiatives
          </Text>
        </View>

        <View className="px-6 py-6">
          {/* Donation Amount */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Select Amount</Text>

            {/* Predefined Amounts */}
            <View className="flex-row flex-wrap gap-3 mb-4">
              {predefinedAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`px-6 py-3 rounded-lg border-2 ${
                    selectedAmount === amount
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedAmount === amount ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Custom Amount</Text>
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-gray-600 mr-2">$</Text>
                <TextInput
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  placeholder="Enter amount"
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

          {/* Donation Purpose */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Donation Purpose</Text>
            <View className="space-y-2">
              {purposes.map((purpose) => (
                <TouchableOpacity
                  key={purpose}
                  onPress={() => setDonationPurpose(purpose)}
                  className={`p-4 rounded-lg border-2 ${
                    donationPurpose === purpose
                      ? 'bg-primary-50 border-primary-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      donationPurpose === purpose ? 'text-primary-600' : 'text-gray-700'
                    }`}
                  >
                    {purpose}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Donation Summary */}
          <View className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Donation Summary</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Amount:</Text>
              <Text className="text-xl font-bold text-primary-600">
                ${selectedAmount || customAmount || '0'}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Purpose:</Text>
              <Text className="text-gray-800 font-medium">{donationPurpose}</Text>
            </View>
          </View>

          {/* Donate Button */}
          <TouchableOpacity
            className={`py-4 rounded-lg ${
              loading ? 'bg-gray-400' : 'bg-primary-600'
            }`}
            onPress={handleDonate}
            disabled={loading || (!selectedAmount && !customAmount)}
          >
            <Text className="text-white text-lg font-bold text-center">
              {loading ? 'Processing...' : 'Donate Now'}
            </Text>
          </TouchableOpacity>

          {/* Security Notice */}
          <View className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <Text className="text-green-800 font-medium text-center">
              🔒 Your donation is secure and encrypted
            </Text>
            <Text className="text-green-700 text-sm text-center mt-1">
              We use industry-standard security measures to protect your information
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}