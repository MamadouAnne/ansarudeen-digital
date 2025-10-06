import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StatusBar, Platform, ActivityIndicator, Modal, Image, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

interface Project {
  id: number;
  title: string;
  title_arabic: string;
  description: string;
  full_description: string;
  category: string;
  status: 'ongoing' | 'planning' | 'completed';
  progress: number;
  target_amount: number;
  raised_amount: number;
  featured: boolean;
}

export default function AdminProjectsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    description: '',
    category: 'Infrastructure',
    status: 'planning' as 'ongoing' | 'planning' | 'completed',
    target_amount: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('Checking admin access...');
      setCheckingAuth(true);

      // Get current user from Supabase
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        console.log('No user found, redirecting to profile');
        Alert.alert('Access Denied', 'Please sign in to access this page', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      console.log('User found:', currentUser.email);

      // Fetch profile directly from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();

      console.log('Profile data:', profile);
      console.log('Profile error:', error);

      if (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to verify admin access', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      if (profile?.role !== 'admin') {
        console.log('User is not admin. Role:', profile?.role);
        Alert.alert('Access Denied', 'You do not have permission to access this page', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      console.log('Admin access granted');
      setIsAdmin(true);
      setCheckingAuth(false);
      loadProjects();
    } catch (error) {
      console.error('Exception in checkAdminAccess:', error);
      Alert.alert('Error', 'An error occurred', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
      ]);
      setCheckingAuth(false);
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, title_arabic, description, full_description, category, status, progress, target_amount, raised_amount, featured, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      Alert.alert('Error', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);
      setSelectedImages([...selectedImages, ...uris]);
    }
  };

  const uploadImages = async (projectId: number) => {
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const uri = selectedImages[i];
        const filename = `project_${projectId}_${Date.now()}_${i}.jpg`;

        // Create form data for React Native
        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          type: 'image/jpeg',
          name: filename,
        } as any);

        // Convert URI to ArrayBuffer for Supabase
        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(filename, arrayBuffer, {
            contentType: 'image/jpeg',
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-media')
          .getPublicUrl(filename);

        // Insert into project_media table
        const { error: mediaError } = await supabase
          .from('project_media')
          .insert({
            project_id: projectId,
            type: 'image',
            uri: publicUrl,
            display_order: i,
          });

        if (mediaError) throw mediaError;
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleAddProject = async () => {
    if (!formData.title || !formData.title_arabic) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      const { data, error } = await supabase.from('projects').insert({
        title: formData.title,
        title_arabic: formData.title_arabic,
        description: formData.description,
        full_description: formData.description,
        category: formData.category,
        icon: '🏗️',
        status: formData.status,
        progress: 0,
        budget: `$${formData.target_amount}`,
        target_amount: formData.target_amount,
        raised_amount: 0,
        start_date: new Date().toISOString().split('T')[0],
        donors: 0,
        likes: 0,
      })
      .select()
      .single();

      if (error) throw error;

      // Upload images if any
      if (selectedImages.length > 0 && data) {
        await uploadImages(data.id);
      }

      Alert.alert('Success', 'Project added successfully!');
      setShowAddModal(false);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      Alert.alert('Error', 'Failed to add project');
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          title_arabic: formData.title_arabic,
          description: formData.description,
          full_description: formData.description,
          category: formData.category,
          status: formData.status,
          target_amount: formData.target_amount,
        })
        .eq('id', selectedProject.id);

      if (error) throw error;

      // Upload new images if any
      if (selectedImages.length > 0) {
        await uploadImages(selectedProject.id);
      }

      Alert.alert('Success', 'Project updated successfully!');
      setShowEditModal(false);
      setSelectedProject(null);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert('Error', 'Failed to update project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Success', 'Project deleted successfully!');
              loadProjects();
            } catch (error) {
              console.error('Error deleting project:', error);
              Alert.alert('Error', 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  const handleUpdateStatus = async (id: number, newStatus: 'ongoing' | 'planning' | 'completed') => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Status updated successfully!');
      loadProjects();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      Alert.alert('Success', `${!currentStatus ? 'Featured' : 'Unfeatured'} successfully`);
      loadProjects();
    } catch (error) {
      console.error('Error toggling featured:', error);
      Alert.alert('Error', 'Failed to update featured status');
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      title_arabic: project.title_arabic,
      description: project.full_description || project.description,
      category: project.category,
      status: project.status,
      target_amount: project.target_amount,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_arabic: '',
      description: '',
      category: 'Infrastructure',
      status: 'planning',
      target_amount: 0,
    });
    setSelectedImages([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-emerald-100 text-emerald-700';
      case 'planning':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-sky-100 text-sky-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const ProjectForm = useMemo(() => (
    <ScrollView className="p-6" contentContainerStyle={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60 }}>
      <Text className="text-xl font-bold text-slate-800 mb-4">
        {selectedProject ? 'Edit Project' : 'Add New Project'}
      </Text>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Title *</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Enter project title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Arabic Title *</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Enter Arabic title"
          value={formData.title_arabic}
          onChangeText={(text) => setFormData({ ...formData, title_arabic: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Description</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Enter description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={10}
          style={{ minHeight: 200, maxHeight: 300 }}
          textAlignVertical="top"
          scrollEnabled={true}
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Category</Text>
        <View className="flex-row flex-wrap">
          {['Infrastructure', 'Education', 'Healthcare', 'Community'].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setFormData({ ...formData, category: cat })}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                formData.category === cat ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <Text className={formData.category === cat ? 'text-white font-bold' : 'text-slate-700'}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Status</Text>
        <View className="flex-row flex-wrap">
          {(['planning', 'ongoing', 'completed'] as const).map((stat) => (
            <TouchableOpacity
              key={stat}
              onPress={() => setFormData({ ...formData, status: stat })}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                formData.status === stat ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <Text className={formData.status === stat ? 'text-white font-bold' : 'text-slate-700'}>
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Target Amount ($)</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="0"
          value={String(formData.target_amount)}
          onChangeText={(text) => setFormData({ ...formData, target_amount: Number(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      {/* Image Upload */}
      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Images</Text>
        <TouchableOpacity
          onPress={pickImages}
          className="bg-emerald-100 border-2 border-dashed border-emerald-300 rounded-xl py-4 items-center"
        >
          <Text className="text-emerald-600 font-bold">📷 Add Images</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <ScrollView horizontal className="mt-3">
            {selectedImages.map((uri, index) => (
              <View key={index} className="mr-2">
                <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                <TouchableOpacity
                  onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                >
                  <Text className="text-white font-bold text-xs">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View className="flex-row mb-6">
        <TouchableOpacity
          onPress={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProject(null);
            resetForm();
          }}
          className="flex-1 bg-slate-200 py-4 rounded-xl mr-2"
        >
          <Text className="text-slate-700 font-bold text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={selectedProject ? handleUpdateProject : handleAddProject}
          className="flex-1 bg-emerald-600 py-4 rounded-xl ml-2"
        >
          <Text className="text-white font-bold text-center">
            {selectedProject ? 'Update' : 'Add'} Project
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ), [formData, selectedProject, selectedImages]);

  if (checkingAuth || loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-slate-600 mt-4">
          {checkingAuth ? 'Verifying access...' : 'Loading projects...'}
        </Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-slate-800 text-lg font-bold">Access Denied</Text>
        <Text className="text-slate-600 mt-2">You do not have admin permissions</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pb-6 px-5 relative overflow-hidden"
        style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60 }}
      >
        {/* Decorative pattern */}
        <View className="absolute inset-0 opacity-10">
          <View className="absolute top-4 right-4 w-28 h-28 border-4 border-white rounded-full" />
          <View className="absolute top-12 right-12 w-20 h-20 border-4 border-white rounded-full" />
          <View className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full" />
        </View>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 flex-row items-center"
        >
          <Text className="text-white text-lg font-bold mr-2">←</Text>
          <Text className="text-white text-base font-semibold">Back</Text>
        </TouchableOpacity>

        {/* Title and Add Button */}
        <View className="flex-row items-center justify-between relative z-10">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-3 border-2 border-white/40">
                <Text className="text-2xl">🏗️</Text>
              </View>
              <View>
                <Text className="text-white text-2xl font-bold">Manage Projects</Text>
                <Text className="text-emerald-100 text-sm font-medium">Admin Panel</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-white px-5 py-3 rounded-full shadow-lg"
          >
            <Text className="text-emerald-600 font-extrabold">+ Add</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-5 pt-5">
        {projects.map((project) => (
          <View
            key={project.id}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-200"
          >
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800">{project.title}</Text>
                <Text className="text-emerald-600 text-sm">{project.title_arabic}</Text>
                <View className="flex-row items-center mt-2">
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    <Text className="text-xs font-bold">{project.status}</Text>
                  </View>
                  {project.featured && (
                    <View className="px-3 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 ml-2">
                      <Text className="text-xs font-extrabold text-amber-700">⭐ FEATURED</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <Text className="text-slate-600 text-sm mb-3" numberOfLines={3}>
              {project.full_description || project.description}
            </Text>

            <View className="flex-row items-center mb-3">
              <Text className="text-slate-500 text-xs mr-4">Progress: {project.progress}%</Text>
              <Text className="text-slate-500 text-xs">
                ${project.raised_amount} / ${project.target_amount}
              </Text>
            </View>

            <View className="flex-row mb-2">
              <TouchableOpacity
                onPress={() => openEditModal(project)}
                className="flex-1 bg-emerald-100 py-2 rounded-lg mr-2"
              >
                <Text className="text-emerald-700 font-bold text-center text-sm">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const statuses: Array<'planning' | 'ongoing' | 'completed'> = ['planning', 'ongoing', 'completed'];
                  const currentIndex = statuses.indexOf(project.status);
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  handleUpdateStatus(project.id, nextStatus);
                }}
                className="flex-1 bg-amber-100 py-2 rounded-lg mx-1"
              >
                <Text className="text-amber-700 font-bold text-center text-sm">Status</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteProject(project.id)}
                className="flex-1 bg-red-100 py-2 rounded-lg ml-2"
              >
                <Text className="text-red-700 font-bold text-center text-sm">Delete</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className={`${project.featured ? 'bg-amber-600' : 'bg-slate-400'} py-2 px-4 rounded-xl flex-1`}
                onPress={() => handleToggleFeatured(project.id, project.featured)}
              >
                <Text className="text-white text-center font-bold text-sm">
                  {project.featured ? '⭐ Featured' : 'Feature'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white"
        >
          <StatusBar barStyle="dark-content" />
          {ProjectForm}
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white"
        >
          <StatusBar barStyle="dark-content" />
          {ProjectForm}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
