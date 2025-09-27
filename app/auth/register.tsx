import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await register({ firstName, lastName, email, phone, password });
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/welcome') }
      ]);
    } catch (error: any) {
      console.log('Registration error in component:', error);

      if (error.message?.includes('User already registered') || error.message?.includes('already been registered')) {
        Alert.alert(
          'Account Exists',
          'An account with this email already exists. Would you like to sign in instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign In',
              onPress: () => router.push('/auth/signin')
            }
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          {/* Header */}
          <View className="items-center mb-10">
            {/* Logo with enhanced styling */}
            <View className="relative mb-6">
              <View className="absolute inset-0 bg-accent-200 rounded-4xl blur-xl opacity-30" />
              <View className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-700 rounded-4xl items-center justify-center shadow-2xl relative">
                <View className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-4xl" />
                <Text className="text-white text-3xl font-bold font-display">AD</Text>
              </View>
            </View>

            <Text className="text-4xl font-bold text-gray-900 mb-2">Join Us</Text>
            <Text className="text-gray-700 text-lg font-medium text-center">
              Create your Ansarudeen Digital account
            </Text>
          </View>

          {/* Form Container */}
          <View className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            {/* Form Fields */}
            <View className="space-y-5">
              {/* Name Fields */}
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-3 font-semibold text-base">First Name</Text>
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white"
                    placeholder="First name"
                    placeholderTextColor="#94a3b8"
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 mb-3 font-semibold text-base">Last Name</Text>
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white"
                    placeholder="Last name"
                    placeholderTextColor="#94a3b8"
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <Text className="text-gray-700 mb-3 font-semibold text-base">Email Address</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white pr-16"
                    placeholder="Enter your email address"
                    placeholderTextColor="#94a3b8"
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center">
                      <Text className="text-blue-600 text-xs">@</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Phone */}
              <View>
                <Text className="text-gray-700 mb-3 font-semibold text-base">Phone Number</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white pr-16"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#94a3b8"
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                  />
                  <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center">
                      <Text className="text-green-600 text-xs">📱</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-700 mb-3 font-semibold text-base">Password</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white pr-16"
                    placeholder="Create a strong password"
                    placeholderTextColor="#94a3b8"
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center">
                      <Text className="text-gray-600 text-xs">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View>
                <Text className="text-gray-700 mb-3 font-semibold text-base">Confirm Password</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white pr-16"
                    placeholder="Confirm your password"
                    placeholderTextColor="#94a3b8"
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center">
                      <Text className="text-gray-600 text-xs">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`mt-8 py-4 px-8 rounded-xl ${
                isLoading
                  ? 'bg-gray-400'
                  : 'bg-blue-600'
              }`}
              onPress={handleRegister}
              disabled={isLoading}
              style={!isLoading ? {
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              } : undefined}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                )}
                <Text className="text-white text-lg font-bold">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 font-medium">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Sign In Link */}
          <View className="items-center mb-8">
            <View className="flex-row items-center">
              <Text className="text-gray-600 text-lg">Already have an account? </Text>
              <Link href="/auth/signin" asChild>
                <TouchableOpacity className="ml-1">
                  <Text className="text-blue-600 font-bold text-lg">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Back to Welcome */}
          <View className="items-center pb-8">
            <Link href="/welcome" asChild>
              <TouchableOpacity className="bg-gray-100 px-8 py-4 rounded-xl">
                <Text className="text-gray-700 font-semibold text-base">← Back to Welcome</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}