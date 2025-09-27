import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!user || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Please sign in to view your profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-600 px-6 py-8">
          <View className="items-center">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
              <Text className="text-primary-600 text-2xl font-bold">
                {(profile.first_name?.[0] || '').toUpperCase()}{(profile.last_name?.[0] || '').toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-2xl font-bold">
              {profile.first_name || ''} {profile.last_name || ''}
            </Text>
            <Text className="text-primary-100 mt-1">ID: {profile.membership_id || 'N/A'}</Text>
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Profile Information */}
          <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Profile Information</Text>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg ${isEditing ? 'bg-red-100' : 'bg-primary-100'}`}
              >
                <Text className={`font-medium ${isEditing ? 'text-red-600' : 'text-primary-600'}`}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-600 text-sm mb-1">First Name</Text>
                {isEditing ? (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    value={profileData.first_name}
                    onChangeText={(value) => updateProfileData('first_name', value)}
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{profileData.first_name}</Text>
                )}
              </View>

              <View>
                <Text className="text-gray-600 text-sm mb-1">Last Name</Text>
                {isEditing ? (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    value={profileData.last_name}
                    onChangeText={(value) => updateProfileData('last_name', value)}
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{profileData.last_name}</Text>
                )}
              </View>

              <View>
                <Text className="text-gray-600 text-sm mb-1">Email</Text>
                {isEditing ? (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    value={profileData.email}
                    onChangeText={(value) => updateProfileData('email', value)}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{profileData.email}</Text>
                )}
              </View>

              <View>
                <Text className="text-gray-600 text-sm mb-1">Phone</Text>
                {isEditing ? (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    value={profileData.phone}
                    onChangeText={(value) => updateProfileData('phone', value)}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{profileData.phone}</Text>
                )}
              </View>
            </View>

            {isEditing && (
              <TouchableOpacity
                className="mt-4 bg-primary-600 py-3 rounded-lg"
                onPress={handleSaveProfile}
              >
                <Text className="text-white font-semibold text-center">Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Membership Stats */}
          <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-4">Membership Statistics</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Member Since:</Text>
                <Text className="text-gray-800 font-medium">{profile.member_since || 'N/A'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Donations:</Text>
                <Text className="text-primary-600 font-bold">${profile.total_donations || 0}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Membership Status:</Text>
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 font-semibold text-sm">{profile.membership_status || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
            <View className="space-y-3">
              <Link href="/donation-tracker" asChild>
                <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-800 font-medium">View Donation History</Text>
                  <Text className="ml-auto text-primary-600">→</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                <Text className="text-gray-800 font-medium">Change Password</Text>
                <Text className="ml-auto text-primary-600">→</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                <Text className="text-gray-800 font-medium">Privacy Settings</Text>
                <Text className="ml-auto text-primary-600">→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            className="bg-red-600 py-4 rounded-lg"
            onPress={handleSignOut}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Sign Out
            </Text>
          </TouchableOpacity>

          <View className="h-8"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}