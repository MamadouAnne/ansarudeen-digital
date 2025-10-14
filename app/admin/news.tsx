import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StatusBar, Platform, ActivityIndicator, Modal, Image, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';

interface NewsArticle {
  id: number;
  title: string;
  title_arabic: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_bio: string;
  date: string;
  read_time: string;
}

export default function AdminNewsScreen() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    excerpt: '',
    content: '',
    category: 'Announcements',
    author: '',
    author_bio: '',
    read_time: '5 min read',
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('News Admin: Checking admin access...');
      setCheckingAuth(true);

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        console.log('News Admin: No user found');
        Alert.alert('Access Denied', 'Please sign in to access this page', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      console.log('News Admin: User found:', currentUser.email);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();

      console.log('News Admin: Profile data:', profile);
      console.log('News Admin: Profile error:', error);

      if (error) {
        console.error('News Admin: Error fetching profile:', error);
        Alert.alert('Error', 'Failed to verify admin access', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      if (profile?.role !== 'admin') {
        console.log('News Admin: User is not admin. Role:', profile?.role);
        Alert.alert('Access Denied', 'You do not have permission to access this page', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
        ]);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      console.log('News Admin: Admin access granted');
      setIsAdmin(true);
      setCheckingAuth(false);
      loadArticles();
    } catch (error) {
      console.error('News Admin: Exception in checkAdminAccess:', error);
      Alert.alert('Error', 'An error occurred', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
      ]);
      setCheckingAuth(false);
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      Alert.alert('Error', 'Failed to load articles');
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
      const uris = result.assets.map(asset => asset.uri);
      setSelectedImages([...selectedImages, ...uris]);
    }
  };

  const uploadImages = async (articleId: number) => {
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const uri = selectedImages[i];
        const filename = `news_${articleId}_${Date.now()}_${i}.jpg`;

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
          .from('news-media')
          .upload(filename, arrayBuffer, {
            contentType: 'image/jpeg',
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('news-media')
          .getPublicUrl(filename);

        // Insert into news_media table
        const { error: mediaError } = await supabase
          .from('news_media')
          .insert({
            news_article_id: articleId,
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

  const handleAddArticle = async () => {
    if (!formData.title || !formData.title_arabic || !formData.content) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news_articles')
        .insert({
          title: formData.title,
          title_arabic: formData.title_arabic,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author: formData.author || 'Admin',
          author_bio: formData.author_bio || 'Content Administrator',
          date: new Date().toLocaleDateString(),
          read_time: formData.read_time,
          likes: 0,
          comments: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Upload images if any
      if (selectedImages.length > 0 && data) {
        await uploadImages(data.id);
      }

      Alert.alert('Success', 'Article added successfully!');
      setShowAddModal(false);
      resetForm();
      loadArticles();
    } catch (error) {
      console.error('Error adding article:', error);
      Alert.alert('Error', 'Failed to add article');
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;

    try {
      const { error } = await supabase
        .from('news_articles')
        .update({
          title: formData.title,
          title_arabic: formData.title_arabic,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          author_bio: formData.author_bio,
          read_time: formData.read_time,
        })
        .eq('id', selectedArticle.id);

      if (error) throw error;

      // Upload new images if any
      if (selectedImages.length > 0) {
        await uploadImages(selectedArticle.id);
      }

      Alert.alert('Success', 'Article updated successfully!');
      setShowEditModal(false);
      setSelectedArticle(null);
      resetForm();
      loadArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      Alert.alert('Error', 'Failed to update article');
    }
  };

  const handleDeleteArticle = async (id: number) => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to delete this article?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('news_articles')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Success', 'Article deleted successfully!');
              loadArticles();
            } catch (error) {
              console.error('Error deleting article:', error);
              Alert.alert('Error', 'Failed to delete article');
            }
          },
        },
      ]
    );
  };

  const handleShareToMessages = async (article: NewsArticle) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to share messages.');
        return;
      }

      // Get user's name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', currentUser.id)
        .single();

      const { error } = await supabase
        .from('messages')
        .insert({
          title: `New Article: ${article.title}`,
          content: `Check out this news article: ${article.title}`,
          category: 'announcement',
          priority: 'high',
          sender_id: currentUser.id,
          sender_name: (profile as any)?.full_name || 'Admin',
          sender_role: 'Administrator',
          published_at: new Date().toISOString(),
          is_published: true,
          news_article_id: article.id,
        } as any);

      if (error) throw error;

      Alert.alert(
        'Success!',
        'Article has been shared to the Messages chat screen.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error sharing to messages:', error);
      Alert.alert('Error', 'Failed to share article to messages.');
    }
  };

  const openEditModal = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      title_arabic: article.title_arabic,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      author_bio: article.author_bio,
      read_time: article.read_time,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_arabic: '',
      excerpt: '',
      content: '',
      category: 'Announcements',
      author: '',
      author_bio: '',
      read_time: '5 min read',
    });
    setSelectedImages([]);
  };

  const ArticleForm = useMemo(() => (
    <ScrollView className="p-6" contentContainerStyle={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60 }}>
      <Text className="text-xl font-bold text-slate-800 mb-4">
        {selectedArticle ? 'Edit Article' : 'Add New Article'}
      </Text>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Title *</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Enter article title"
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
        <Text className="text-slate-700 font-bold mb-2">Excerpt</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Brief summary"
          value={formData.excerpt}
          onChangeText={(text) => setFormData({ ...formData, excerpt: text })}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Content *</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Full article content"
          value={formData.content}
          onChangeText={(text) => setFormData({ ...formData, content: text })}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Category</Text>
        <View className="flex-row flex-wrap">
          {['Announcements', 'Events', 'Community', 'Education', 'Projects'].map((cat) => (
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
        <Text className="text-slate-700 font-bold mb-2">Author</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Author name"
          value={formData.author}
          onChangeText={(text) => setFormData({ ...formData, author: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Author Bio</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="Author bio"
          value={formData.author_bio}
          onChangeText={(text) => setFormData({ ...formData, author_bio: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 font-bold mb-2">Read Time</Text>
        <TextInput
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          placeholder="5 min read"
          value={formData.read_time}
          onChangeText={(text) => setFormData({ ...formData, read_time: text })}
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
            setSelectedArticle(null);
            resetForm();
          }}
          className="flex-1 bg-slate-200 py-4 rounded-xl mr-2"
        >
          <Text className="text-slate-700 font-bold text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={selectedArticle ? handleUpdateArticle : handleAddArticle}
          className="flex-1 bg-emerald-600 py-4 rounded-xl ml-2"
        >
          <Text className="text-white font-bold text-center">
            {selectedArticle ? 'Update' : 'Add'} Article
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ), [formData, selectedArticle, selectedImages]);

  if (checkingAuth || loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#059669" />
        <Text className="text-slate-600 mt-4">
          {checkingAuth ? 'Verifying access...' : 'Loading articles...'}
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
                <Text className="text-2xl">📰</Text>
              </View>
              <View>
                <Text className="text-white text-2xl font-bold">Manage News</Text>
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
        {articles.map((article) => (
          <View key={article.id} className="bg-white rounded-2xl p-4 mb-4 border border-slate-200">
            <Text className="text-lg font-bold text-slate-800 mb-1">{article.title}</Text>
            <Text className="text-emerald-600 text-sm mb-2">{article.title_arabic}</Text>
            <View className="bg-emerald-50 self-start px-3 py-1 rounded-full mb-2">
              <Text className="text-emerald-700 text-xs font-bold">{article.category}</Text>
            </View>
            <Text className="text-slate-600 text-sm mb-3" numberOfLines={2}>
              {article.excerpt}
            </Text>
            <Text className="text-slate-400 text-xs mb-3">
              {article.author} • {article.date} • {article.read_time}
            </Text>

            <View className="flex-row mb-2">
              <TouchableOpacity
                onPress={() => openEditModal(article)}
                className="flex-1 bg-emerald-100 py-2 rounded-lg mr-2"
              >
                <Text className="text-emerald-700 font-bold text-center text-sm">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteArticle(article.id)}
                className="flex-1 bg-red-100 py-2 rounded-lg ml-2"
              >
                <Text className="text-red-700 font-bold text-center text-sm">Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleShareToMessages(article)}
              className="bg-blue-600 py-2 rounded-lg"
            >
              <Text className="text-white font-bold text-center text-sm">💬 Share to Messages</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white"
        >
          <StatusBar barStyle="dark-content" />
          {ArticleForm}
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showEditModal} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-white"
        >
          <StatusBar barStyle="dark-content" />
          {ArticleForm}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
