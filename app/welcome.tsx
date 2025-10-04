import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

const { height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  console.log('Welcome screen rendered:', { isAuthenticated, isLoading, user: !!user });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/(tabs)');
    } else {
      router.push('/auth/register');
    }
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      router.push('/(tabs)');
    } else {
      router.push('/auth/signin');
    }
  };

  // Show loading spinner if auth is still loading
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-4 text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: screenHeight }}
      >
        <View className="flex-1 min-h-screen bg-white">
          {/* Background decorative elements */}
          <Animated.View
            className="absolute top-20 right-8 w-32 h-32 bg-blue-500 opacity-10 rounded-full"
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
              transform: [{ scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }) }],
            }}
          />
          <Animated.View
            className="absolute bottom-40 left-4 w-24 h-24 bg-purple-500 opacity-10 rounded-full"
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
              transform: [{ scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }) }],
            }}
          />
          <Animated.View
            className="absolute top-60 left-12 w-16 h-16 bg-emerald-500 opacity-10 rounded-full"
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
              transform: [{ scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }) }],
            }}
          />
          
          {/* Header with Logo */}
          <View 
            className="items-center pt-12 md:pt-16 pb-6 md:pb-8 px-4 md:px-6"
          >
            <View className="items-center justify-center relative">
              {/* Animated glow effect */}
              <Animated.View
                className="absolute w-40 h-40 rounded-full"
                style={{
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.2],
                  }),
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  }],
                }}
              >
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="w-full h-full rounded-full"
                />
              </Animated.View>
              
              {/* Logo Container */}
              <Animated.View
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl items-center justify-center relative border border-slate-200 overflow-hidden"
                style={{
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 16,
                  elevation: 16,
                }}
              >
                {/* Background gradient */}
                <LinearGradient
                  colors={['#f1f5f9', '#cbd5e1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute inset-0"
                />

                {/* Overlay gradient */}
                <LinearGradient
                  colors={['#2563eb', '#1d4ed8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute inset-0 opacity-80"
                />

                {/* Logo Text */}
                <Text className="text-white text-3xl md:text-4xl font-bold z-10 tracking-tight">AD</Text>

                {/* Decorative elements */}
                <View className="absolute -top-2 -right-2 w-6 h-6 rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#a855f7', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="w-full h-full"
                  />
                </View>
                <View className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#10b981', '#14b8a6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="w-full h-full"
                  />
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Main Content */}
          <View 
            className="flex-1 px-4 md:px-6"
          >
            {/* Welcome Title */}
            <View className="items-center mb-8">
              <Text className="text-4xl md:text-5xl font-bold text-black text-center mb-2 md:mb-3 tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
                {isAuthenticated ? `Welcome back${user?.profile?.first_name ? `, ${user.profile.first_name}` : ''}` : 'Welcome to'}
              </Text>
              <View className="bg-black rounded-xl px-6 py-3 mb-4 md:mb-6">
                <Text className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight">
                  Ansarudeen International
                </Text>
              </View>

              {/* Subtitle */}
              <View className="bg-gray-900 rounded-2xl px-4 md:px-6 py-3 md:py-4 border-2 border-gray-700 shadow-lg">
                <Text className="text-white text-base md:text-lg text-center leading-relaxed font-bold">
                  {isAuthenticated
                    ? `Ready to explore your digital community hub?${user?.profile?.membership_id ? `\nMembership ID: ${user.profile.membership_id}` : ''}`
                    : 'Connecting our community through technology.\nBuilding a stronger, more connected Ansarudeen family.'
                  }
                </Text>
              </View>
            </View>

            {/* Feature Highlights */}
            <View className="mb-6 md:mb-8 space-y-3 md:space-y-4">
              <Animated.View
                className="bg-white rounded-2xl p-3 md:p-4 border border-gray-200 shadow-sm"
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [-30, 0],
                    }),
                  }],
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 md:w-12 md:h-12 rounded-xl items-center justify-center mr-3 md:mr-4 overflow-hidden">
                    <LinearGradient
                      colors={['#34d399', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="w-full h-full items-center justify-center"
                    >
                      <Text className="text-white text-xl md:text-2xl">🎫</Text>
                    </LinearGradient>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base md:text-lg mb-1">Digital Membership</Text>
                    <Text className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">Access your membership card anytime, anywhere</Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                className="bg-white rounded-2xl p-3 md:p-4 border border-gray-200 shadow-sm"
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [-30, 0],
                    }),
                  }],
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 md:w-12 md:h-12 rounded-xl items-center justify-center mr-3 md:mr-4 overflow-hidden">
                    <LinearGradient
                      colors={['#a855f7', '#7c3aed']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="w-full h-full items-center justify-center"
                    >
                      <Text className="text-white text-xl md:text-2xl">💝</Text>
                    </LinearGradient>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base md:text-lg mb-1">Easy Donations</Text>
                    <Text className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">Support community initiatives seamlessly</Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                className="bg-white rounded-2xl p-3 md:p-4 border border-gray-200 shadow-sm"
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [-30, 0],
                    }),
                  }],
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 md:w-12 md:h-12 rounded-xl items-center justify-center mr-3 md:mr-4 overflow-hidden">
                    <LinearGradient
                      colors={['#fbbf24', '#d97706']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="w-full h-full items-center justify-center"
                    >
                      <Text className="text-white text-xl md:text-2xl">🏘️</Text>
                    </LinearGradient>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base md:text-lg mb-1">Community Hub</Text>
                    <Text className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">Stay connected with events and updates</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Action Buttons */}
          <Animated.View 
            className="px-4 md:px-6 pb-6 md:pb-8"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {isAuthenticated ? (
              <TouchableOpacity
                onPress={handleGetStarted}
                className="py-4 md:py-5 px-6 md:px-8 rounded-2xl mb-3 md:mb-4 overflow-hidden"
                style={{ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 16 }}
              >
                <LinearGradient
                  colors={['#2563eb', '#1d4ed8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute inset-0"
                />
                <Text className="text-white text-lg md:text-xl font-bold text-center tracking-wide">Get Started</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleSignIn}
                  className="py-4 md:py-5 px-6 md:px-8 rounded-2xl mb-3 md:mb-4 overflow-hidden"
                  style={{ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 16 }}
                >
                  <LinearGradient
                    colors={['#2563eb', '#1d4ed8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="absolute inset-0"
                  />
                  <Text className="text-white text-lg md:text-xl font-bold text-center tracking-wide">Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleGetStarted}
                  className="bg-gray-700 py-4 md:py-5 px-6 md:px-8 rounded-2xl border-2 border-gray-600"
                >
                  <Text className="text-white text-lg md:text-xl font-bold text-center tracking-wide">Create Account</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          {/* Footer */}
          <Animated.View
            className="items-center pb-6 md:pb-8 px-4 md:px-6"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="bg-gray-100 rounded-full px-4 md:px-6 py-2 md:py-3 border border-gray-400">
              <Text className="text-gray-800 text-sm md:text-base text-center font-semibold tracking-wide">
                Building bridges, strengthening bonds
              </Text>
            </View>

            {/* Decorative dots */}
            <View className="flex-row mt-6 space-x-2">
              <View className="w-2 h-2 bg-gray-600 rounded-full" />
              <View className="w-2 h-2 bg-gray-700 rounded-full" />
              <View className="w-2 h-2 bg-gray-600 rounded-full" />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}