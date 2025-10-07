import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar, Platform, Image, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            {/* Founder Image */}
            <View className="w-24 h-24 rounded-full bg-white p-1 mb-4 shadow-2xl">
              <View className="w-full h-full rounded-full overflow-hidden border-3 border-emerald-200">
                <Image
                  source={require('@/assets/images/founder.webp')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text className="text-white text-3xl font-bold mb-1">Join Our Community</Text>
            <Text className="text-emerald-100 text-sm font-medium">
              انضم إلينا • Create Your Account
            </Text>
          </View>
        </LinearGradient>

        <View className="px-6 -mt-4">

          {/* Form Container */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
            {/* Form Fields */}
            <View className="space-y-5">
              {/* Name Fields */}
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-slate-700 mb-3 font-semibold text-base">First Name</Text>
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-4 py-3 text-slate-900 text-base bg-slate-50"
                    placeholder="First name"
                    placeholderTextColor="#94a3b8"
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-700 mb-3 font-semibold text-base">Last Name</Text>
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-4 py-3 text-slate-900 text-base bg-slate-50"
                    placeholder="Last name"
                    placeholderTextColor="#94a3b8"
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <Text className="text-slate-700 mb-3 font-semibold text-base">Email Address</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-6 py-3 text-slate-900 text-base bg-slate-50 pr-16"
                    placeholder="Enter your email address"
                    placeholderTextColor="#94a3b8"
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
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

              {/* Phone */}
              <View>
                <Text className="text-slate-700 mb-3 font-semibold text-base">Phone Number</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-6 py-3 text-slate-900 text-base bg-slate-50 pr-16"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#94a3b8"
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                  />
                  <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <View className="w-6 h-6 bg-emerald-100 rounded-full items-center justify-center">
                      <Text className="text-emerald-600 text-xs">📱</Text>
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
                <Text className="text-slate-700 mb-3 font-semibold text-base">Confirm Password</Text>
                <View className="relative">
                  <TextInput
                    className="border-2 border-emerald-200 rounded-xl px-6 py-3 text-slate-900 text-base bg-slate-50 pr-16"
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
              onPress={handleRegister}
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
                    {isLoading ? 'Creating Account...' : 'Create Account'}
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

          {/* Sign In Link */}
          <View className="items-center mb-6">
            <View className="flex-row items-center">
              <Text className="text-slate-600 text-base">Already have an account? </Text>
              <Link href="/auth/signin" asChild>
                <TouchableOpacity className="ml-1">
                  <Text className="text-emerald-600 font-bold text-base">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Islamic Quote */}
          <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border-2 border-emerald-200 mb-6">
            <Text className="text-emerald-700 text-center text-sm italic font-medium">
              "And hold firmly to the rope of Allah all together and do not become divided"
            </Text>
            <Text className="text-emerald-600 text-center text-xs mt-1 font-semibold">- Quran 3:103</Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}