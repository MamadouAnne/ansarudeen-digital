import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Sign in failed. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="items-center mb-12">
            {/* Logo with enhanced styling */}
            <View className="relative mb-6">
              <View className="absolute inset-0 bg-primary-200 rounded-4xl blur-xl opacity-30" />
              <View className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-4xl items-center justify-center shadow-2xl relative">
                <View className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-4xl" />
                <Text className="text-white text-3xl font-bold font-display">AD</Text>
              </View>
            </View>

            <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-700 text-lg font-medium">Sign in to continue your journey</Text>
          </View>

          {/* Form Container */}
          <View className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            {/* Form Fields */}
            <View className="space-y-6">
              <View>
                <Text className="text-gray-700 mb-3 font-semibold text-base">Email Address</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white"
                    placeholder="Enter your email address"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
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

              <View>
                <Text className="text-gray-700 mb-3 font-semibold text-base">Password</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-gray-300 rounded-xl px-6 py-3 text-gray-900 text-base bg-gray-50 focus:border-blue-500 focus:bg-white pr-16"
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
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

              <TouchableOpacity className="items-end pt-2">
                <Text className="text-blue-600 font-semibold text-base">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              className={`mt-8 py-4 px-8 rounded-xl ${
                isLoading
                  ? 'bg-gray-400'
                  : 'bg-blue-600'
              }`}
              onPress={handleSignIn}
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
                  {isLoading ? 'Signing In...' : 'Sign In'}
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

          {/* Register Link */}
          <View className="items-center mb-8">
            <View className="flex-row items-center">
              <Text className="text-gray-600 text-lg">Don't have an account? </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity className="ml-1">
                  <Text className="text-blue-600 font-bold text-lg">Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Back to Welcome */}
          <View className="items-center pt-4">
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