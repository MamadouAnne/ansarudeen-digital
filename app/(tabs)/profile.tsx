import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const profile = user?.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: async () => {
          await logout();
          router.replace('/welcome');
        }, style: 'destructive' }
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <View className="items-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-slate-600 mt-4 font-medium">Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!user || !profile) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center p-6">
        <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-slate-800 text-lg font-bold mb-2">Sign In Required</Text>
        <Text className="text-slate-600 text-center">Please sign in to view your profile</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Islamic-themed Header */}
        <View style={{ height: Platform.OS === 'android' ? 320 : 300 }}>
          <LinearGradient
            colors={['#059669', '#047857', '#065f46']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 h-full relative overflow-hidden"
            style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}
          >
          {/* Decorative Islamic pattern */}
          <View className="absolute inset-0 opacity-10">
            <View className="absolute top-4 right-4 w-28 h-28 border-4 border-white rounded-full" />
            <View className="absolute top-12 right-12 w-20 h-20 border-4 border-white rounded-full" />
            <View className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
          </View>

          <View className="items-center relative z-10 mt-8">
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4 border-2 border-white/40">
              <Text className="text-emerald-600 text-3xl font-extrabold">
                {(profile.first_name?.[0] || '').toUpperCase()}{(profile.last_name?.[0] || '').toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-3xl font-bold mb-2">
              {profile.first_name || ''} {profile.last_name || ''}
            </Text>
            <Text className="text-emerald-100 text-sm font-medium mb-3">
              السَّلَامُ عَلَيْكُمْ • Peace be upon you
            </Text>
            <Text className="text-white text-base font-medium">
              Member ID: {profile.membership_id || 'N/A'}
            </Text>
          </View>
          </LinearGradient>
        </View>

        <View className="px-5 -mt-8">
          {/* Profile Information with Islamic Design */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-emerald-600 text-xl">📝</Text>
                </View>
                <Text className="text-2xl font-bold text-slate-800">Profile Info</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                className={`px-5 py-2 rounded-xl ${isEditing ? 'bg-red-100' : 'bg-emerald-100'}`}
              >
                <Text className={`font-bold ${isEditing ? 'text-red-600' : 'text-emerald-600'}`}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View className="space-y-4">
                <View>
                  <Text className="text-slate-600 text-sm mb-2 font-bold">First Name</Text>
                  <TextInput
                    className="border-2 border-emerald-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold bg-slate-50"
                    value={profileData.first_name}
                    onChangeText={(value) => updateProfileData('first_name', value)}
                  />
                </View>

                <View>
                  <Text className="text-slate-600 text-sm mb-2 font-bold">Last Name</Text>
                  <TextInput
                    className="border-2 border-emerald-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold bg-slate-50"
                    value={profileData.last_name}
                    onChangeText={(value) => updateProfileData('last_name', value)}
                  />
                </View>

                <View>
                  <Text className="text-slate-600 text-sm mb-2 font-bold">Email</Text>
                  <TextInput
                    className="border-2 border-emerald-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold bg-slate-50"
                    value={profileData.email}
                    onChangeText={(value) => updateProfileData('email', value)}
                    keyboardType="email-address"
                  />
                </View>

                <View>
                  <Text className="text-slate-600 text-sm mb-2 font-bold">Phone</Text>
                  <TextInput
                    className="border-2 border-emerald-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold bg-slate-50"
                    value={profileData.phone}
                    onChangeText={(value) => updateProfileData('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>

                <TouchableOpacity onPress={handleSaveProfile}>
                  <LinearGradient
                    colors={['#059669', '#047857']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="mt-1 py-4 rounded-2xl shadow-lg"
                  >
                    <Text className="text-white font-extrabold text-center text-lg">Save Changes</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-3">
                <View className="bg-slate-50 rounded-2xl p-4 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-emerald-600 text-base">👤</Text>
                    </View>
                    <Text className="text-slate-600 font-semibold">First Name:</Text>
                  </View>
                  <Text className="text-slate-800 font-bold">{profileData.first_name}</Text>
                </View>
                <View className="bg-slate-50 rounded-2xl p-4 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-emerald-600 text-base">👤</Text>
                    </View>
                    <Text className="text-slate-600 font-semibold">Last Name:</Text>
                  </View>
                  <Text className="text-slate-800 font-bold">{profileData.last_name}</Text>
                </View>
                <View className="bg-slate-50 rounded-2xl p-4 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-emerald-600 text-base">📧</Text>
                    </View>
                    <Text className="text-slate-600 font-semibold">Email:</Text>
                  </View>
                  <Text className="text-slate-800 font-bold">{profileData.email}</Text>
                </View>
                <View className="bg-slate-50 rounded-2xl p-4 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-emerald-600 text-base">📱</Text>
                    </View>
                    <Text className="text-slate-600 font-semibold">Phone:</Text>
                  </View>
                  <Text className="text-slate-800 font-bold">{profileData.phone || 'Not provided'}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Membership Stats with Islamic Design */}
          <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border-2 border-amber-200 mb-5">
            <View className="flex-row items-center mb-5">
              <Text className="text-2xl mr-2">📊</Text>
              <Text className="text-2xl font-bold text-amber-900">Statistics</Text>
            </View>
            <View className="space-y-3">
              <View className="bg-white rounded-2xl p-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-emerald-600 text-base">📅</Text>
                  </View>
                  <Text className="text-slate-600 font-semibold">Member Since:</Text>
                </View>
                <Text className="text-slate-800 font-bold">{profile.member_since || 'N/A'}</Text>
              </View>
              <View className="bg-white rounded-2xl p-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-emerald-600 text-base">💰</Text>
                  </View>
                  <Text className="text-slate-600 font-semibold">Total Sadaqah:</Text>
                </View>
                <Text className="text-emerald-600 font-extrabold text-lg">${profile.total_donations || 0}</Text>
              </View>
              <View className="bg-white rounded-2xl p-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-emerald-600 text-base">✓</Text>
                  </View>
                  <Text className="text-slate-600 font-semibold">Status:</Text>
                </View>
                <View className="bg-emerald-100 px-4 py-2 rounded-full border-2 border-emerald-300">
                  <Text className="text-emerald-700 font-extrabold text-sm">{profile.membership_status || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Admin Panel - Only visible to admins */}
          {profile.role === 'admin' && (
            <View className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg border-2 border-purple-200 p-6 mb-5">
              <View className="flex-row items-center mb-5">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-purple-600 text-xl">⚙️</Text>
                </View>
                <Text className="text-2xl font-bold text-purple-900">Admin Panel</Text>
              </View>
              <View className="space-y-3">
                <Link href="/admin/projects" asChild>
                  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-2xl border-2 border-purple-300">
                    <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-purple-600">🏗️</Text>
                    </View>
                    <Text className="text-slate-800 font-bold flex-1">Manage Projects</Text>
                    <Text className="text-purple-600 text-xl font-bold">→</Text>
                  </TouchableOpacity>
                </Link>

                <Link href="/admin/news" asChild>
                  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-2xl border-2 border-purple-300">
                    <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-purple-600">📰</Text>
                    </View>
                    <Text className="text-slate-800 font-bold flex-1">Manage News</Text>
                    <Text className="text-purple-600 text-xl font-bold">→</Text>
                  </TouchableOpacity>
                </Link>

                <Link href="/admin/events" asChild>
                  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-2xl border-2 border-purple-300">
                    <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-purple-600">📅</Text>
                    </View>
                    <Text className="text-slate-800 font-bold flex-1">Manage Events</Text>
                    <Text className="text-purple-600 text-xl font-bold">→</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )}

          {/* Quick Actions with Islamic Design */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-6 mb-5">
            <View className="flex-row items-center mb-5">
              <View className="w-10 h-10 bg-sky-100 rounded-full items-center justify-center mr-3">
                <Text className="text-sky-600 text-xl">⚡</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-800">Quick Actions</Text>
            </View>
            <View className="space-y-3">
              <Link href="/donation-tracker" asChild>
                <TouchableOpacity className="flex-row items-center p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
                  <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-emerald-600">📊</Text>
                  </View>
                  <Text className="text-slate-800 font-bold flex-1">Donation History</Text>
                  <Text className="text-emerald-600 text-xl font-bold">→</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity className="flex-row items-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                <View className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-slate-600">🔐</Text>
                </View>
                <Text className="text-slate-800 font-bold flex-1">Change Password</Text>
                <Text className="text-slate-600 text-xl font-bold">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                <View className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-slate-600">🔒</Text>
                </View>
                <Text className="text-slate-800 font-bold flex-1">Privacy Settings</Text>
                <Text className="text-slate-600 text-xl font-bold">→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out with Islamic Design */}
          <TouchableOpacity
            onPress={handleSignOut}
          >
            <LinearGradient
              colors={['#dc2626', '#b91c1c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-5 rounded-2xl shadow-lg mb-6"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white text-xl font-extrabold mr-2">Sign Out</Text>
                <Text className="text-white text-xl">🚪</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View className="h-4"></View>
        </View>
      </ScrollView>
    </View>
  );
}