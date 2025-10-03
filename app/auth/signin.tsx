import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

          <View className="relative z-10 mt-8 items-center">
            {/* Logo */}
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4 border-4 border-emerald-400 shadow-lg">
              <Text className="text-emerald-600 text-3xl font-extrabold">☪️</Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-1">Welcome Back</Text>
            <Text className="text-emerald-100 text-sm font-medium">
              أهلا بعودتك • Sign In to Continue
            </Text>
          </View>
        </LinearGradient>

        <View className="px-6 -mt-4">
          {/* Form Container */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
            {/* Form Fields */}
            <View className="space-y-6">
              {/* Email */}
              <View>
                <Text className="text-slate-700 mb-3 font-semibold text-base">Email Address</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-6 py-3 text-slate-900 text-base bg-slate-50"
                    placeholder="Enter your email address"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <View className="w-6 h-6 bg-emerald-100 rounded-full items-center justify-center">
                      <Text className="text-emerald-600 text-xs">@</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-slate-700 mb-3 font-semibold text-base">Password</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-6 py-3 text-slate-900 text-base bg-slate-50 pr-16"
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
                    <View className="w-6 h-6 bg-slate-200 rounded-full items-center justify-center">
                      <Text className="text-slate-600 text-xs">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="items-end pt-2">
                <Text className="text-emerald-600 font-semibold text-base">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              className="mt-8"
            >
              <LinearGradient
                colors={isLoading ? ['#94a3b8', '#64748b'] : ['#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-2xl shadow-lg"
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-lg font-extrabold">
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-emerald-200" />
            <Text className="px-4 text-slate-500 font-medium">or</Text>
            <View className="flex-1 h-px bg-emerald-200" />
          </View>

          {/* Register Link */}
          <View className="items-center mb-6">
            <View className="flex-row items-center">
              <Text className="text-slate-600 text-base">Don't have an account? </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity className="ml-1">
                  <Text className="text-emerald-600 font-bold text-base">Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Islamic Quote */}
          <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border-2 border-emerald-200 mb-6">
            <Text className="text-emerald-700 text-center text-sm italic font-medium">
              "Indeed, with hardship comes ease"
            </Text>
            <Text className="text-emerald-600 text-center text-xs mt-1 font-semibold">- Quran 94:6</Text>
          </View>
        </View>

        <View className="h-8"></View>
      </ScrollView>
    </View>
  );
}
