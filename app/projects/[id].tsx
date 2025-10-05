import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getProjectById, Project } from '@/services/projects';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Comment {
  id: number;
  user_name: string;
  comment_text: string;
  created_at: string;
}

const COMMENTS_PER_PAGE = 2;

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);

  useEffect(() => {
    loadProject();
    loadComments(true);
    checkIfLiked();
  }, [id]);

  const checkIfLiked = async () => {
    try {
      const likedProjects = await AsyncStorage.getItem('likedProjects');
      if (likedProjects) {
        const likedArray = JSON.parse(likedProjects);
        setIsLiked(likedArray.includes(Number(id)));
      }
    } catch (error) {
      console.error('Error checking if liked:', error);
    }
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectId = parseInt(id as string, 10);
      const data = await getProjectById(projectId);
      console.log('Loaded project data:', data);
      console.log('Media array:', data?.media);
      console.log('Media count:', data?.media?.length);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (reset: boolean = false) => {
    try {
      setIsLoadingComments(true);
      const currentPage = reset ? 0 : commentsPage;
      const from = currentPage * COMMENTS_PER_PAGE;
      const to = from + COMMENTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('project_comments')
        .select('*', { count: 'exact' })
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setTotalComments(count || 0);

      if (reset) {
        setComments(data || []);
        setCommentsPage(0);
      } else {
        setComments(prevComments => [...prevComments, ...(data || [])]);
      }

      setHasMoreComments((count || 0) > (reset ? COMMENTS_PER_PAGE : (currentPage + 1) * COMMENTS_PER_PAGE));
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const loadMoreComments = async () => {
    const nextPage = commentsPage + 1;
    setCommentsPage(nextPage);

    try {
      setIsLoadingComments(true);
      const from = nextPage * COMMENTS_PER_PAGE;
      const to = from + COMMENTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('project_comments')
        .select('*', { count: 'exact' })
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setTotalComments(count || 0);
      setComments(prevComments => [...prevComments, ...(data || [])]);
      setHasMoreComments((count || 0) > (nextPage + 1) * COMMENTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const userName = user?.profile?.first_name && user?.profile?.last_name
      ? `${user.profile.first_name} ${user.profile.last_name}`
      : user?.supabaseUser?.email?.split('@')[0] || 'Anonymous';

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('project_comments')
        .insert({
          project_id: id,
          user_name: userName,
          comment_text: commentText.trim(),
        });

      if (error) throw error;

      // Clear form and reload comments
      setCommentText('');
      setShowCommentModal(false);
      loadComments(true);
      Alert.alert('Success', 'Comment added successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleLike() {
    if (isUpdatingLike || !project) return;

    try {
      setIsUpdatingLike(true);
      const newLikedState = !isLiked;
      const newLikesCount = newLikedState ? (project.likes || 0) + 1 : (project.likes || 0) - 1;

      // Optimistically update UI
      setIsLiked(newLikedState);
      setProject({ ...project, likes: newLikesCount });

      // Update in database
      const { error } = await supabase
        .from('projects')
        .update({ likes: newLikesCount })
        .eq('id', id);

      if (error) {
        // Revert on error
        setIsLiked(!newLikedState);
        setProject({ ...project, likes: project.likes || 0 });
        console.error('Error updating like:', error);
        return;
      }

      // Update AsyncStorage to track liked state
      const likedProjects = await AsyncStorage.getItem('likedProjects');
      let likedArray = likedProjects ? JSON.parse(likedProjects) : [];

      if (newLikedState) {
        // Add to liked
        if (!likedArray.includes(Number(id))) {
          likedArray.push(Number(id));
        }
      } else {
        // Remove from liked
        likedArray = likedArray.filter((projectId: number) => projectId !== Number(id));
      }

      await AsyncStorage.setItem('likedProjects', JSON.stringify(likedArray));
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setProject({ ...project, likes: project.likes || 0 });
    } finally {
      setIsUpdatingLike(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50">
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View className="h-20 bg-emerald-600" style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}>
          <View className="flex-row items-center px-4">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">←</Text>
                <Text className="text-white text-base font-semibold">Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-slate-600 mt-4">Loading project...</Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View className="flex-1 bg-slate-50">
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View className="h-20 bg-emerald-600" style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}>
          <View className="flex-row items-center px-4">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">←</Text>
                <Text className="text-white text-base font-semibold">Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-600 text-lg">Project not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-emerald-600 font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' };
      case 'planning':
        return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' };
      case 'completed':
        return { bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-700' };
      default:
        return { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'In Progress';
      case 'planning':
        return 'Planning';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const statusColors = getStatusColor(project.status);

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View className="h-20 bg-emerald-600" style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }}>
          <View className="flex-row items-center px-4">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">←</Text>
                <Text className="text-white text-base font-semibold">Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Carousel */}
        {project.media && project.media.length > 0 ? (
          <View className="relative bg-slate-200">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveMediaIndex(index);
              }}
            >
              {project.media.map((media, index) => (
                <View key={index} style={{ width }}>
                  <Image
                    source={{ uri: media.uri }}
                    style={{ width, height: 256 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Media Indicators */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {project.media.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full mx-1 ${
                    activeMediaIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="bg-slate-200 h-64 items-center justify-center">
            <Text className="text-slate-500">No images available</Text>
          </View>
        )}

        <View className="px-5 py-5">
          {/* Project Header */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-5 mb-5">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-start flex-1">
                <View className="w-16 h-16 bg-emerald-100 rounded-2xl items-center justify-center mr-3 shadow-sm">
                  <Text className="text-4xl">{project.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-extrabold text-slate-800 mb-1">{project.title}</Text>
                  <Text className="text-emerald-600 text-sm font-bold">{project.titleArabic}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-slate-50 rounded-xl px-3 py-2">
                <Text className="text-slate-600 text-xs font-bold">{project.category}</Text>
              </View>
              <View className={`px-4 py-2 rounded-full border-2 ${statusColors.bg} ${statusColors.border}`}>
                <Text className={`text-sm font-extrabold ${statusColors.text}`}>
                  {getStatusText(project.status)}
                </Text>
              </View>
            </View>

            <Text className="text-slate-700 text-base leading-6 mb-4">{project.fullDescription}</Text>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-600 text-sm font-bold">Progress</Text>
                <Text className="text-emerald-600 text-sm font-extrabold">{project.progress}%</Text>
              </View>
              <View className="bg-slate-200 rounded-full h-3">
                <View
                  className="bg-emerald-600 h-3 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </View>
            </View>

            {/* Fundraising Stats */}
            <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border-2 border-emerald-200">
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className="text-emerald-600 text-xs font-bold mb-1">Raised</Text>
                  <Text className="text-emerald-700 text-2xl font-extrabold">
                    {formatCurrency(project.raisedAmount)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-emerald-600 text-xs font-bold mb-1">Goal</Text>
                  <Text className="text-slate-700 text-2xl font-extrabold">
                    {formatCurrency(project.targetAmount)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="text-emerald-600 text-2xl mr-2">👥</Text>
                <Text className="text-slate-700 text-sm font-bold">
                  {project.donors.toLocaleString()} donors supporting this project
                </Text>
              </View>
            </View>
          </View>

          {/* Project Details Grid */}
          <View className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-5 mb-5">
            <Text className="text-xl font-bold text-slate-800 mb-4">Project Details</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
                <Text className="text-slate-600 font-semibold">Budget</Text>
                <Text className="text-slate-800 font-extrabold text-lg">{project.budget}</Text>
              </View>
              <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
                <Text className="text-slate-600 font-semibold">Start Date</Text>
                <Text className="text-slate-800 font-extrabold text-lg">{project.startDate}</Text>
              </View>
              <View className="flex-row justify-between items-center py-3">
                <Text className="text-slate-600 font-semibold">Category</Text>
                <Text className="text-slate-800 font-extrabold text-lg">{project.category}</Text>
              </View>
            </View>
          </View>

          {/* Engagement Stats */}
          <View className="bg-white rounded-3xl shadow-lg border border-emerald-200/60 p-6 mb-6">
            <View className="flex-row items-center justify-around">
              <TouchableOpacity
                onPress={handleLike}
                disabled={isUpdatingLike}
                className="flex-row items-center"
              >
                <Text className="text-2xl mr-2">{isLiked ? '❤️' : '🤍'}</Text>
                <Text className="text-slate-700 font-bold">{project.likes || 0} Likes</Text>
              </TouchableOpacity>
              <View className="w-px h-6 bg-slate-200" />
              <TouchableOpacity
                onPress={() => setShowCommentModal(true)}
                className="flex-row items-center"
              >
                <Text className="text-2xl mr-2">💬</Text>
                <Text className="text-slate-700 font-bold">{totalComments} Comments</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          {comments.length > 0 && (
            <View className="bg-white rounded-3xl shadow-lg border border-emerald-200/60 p-6 mb-6">
              <Text className="text-2xl font-extrabold text-slate-800 mb-4">Comments ({totalComments})</Text>
              <View>
                {comments.map((comment) => (
                  <View key={comment.id} className="mb-4 pb-4 border-b border-slate-100">
                    <View className="flex-row items-center mb-2">
                      <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                        <Text className="text-emerald-600 font-bold text-lg">{comment.user_name[0].toUpperCase()}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-800 font-bold">{comment.user_name}</Text>
                        <Text className="text-slate-500 text-xs">
                          {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-slate-700 ml-13">{comment.comment_text}</Text>
                  </View>
                ))}
              </View>

              {hasMoreComments && (
                <TouchableOpacity
                  onPress={loadMoreComments}
                  disabled={isLoadingComments}
                  className="mt-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-200"
                >
                  {isLoadingComments ? (
                    <ActivityIndicator size="small" color="#059669" />
                  ) : (
                    <Text className="text-emerald-600 font-bold text-center">Load More Comments</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Donate Button */}
          <Link href="/(tabs)/donate" asChild>
            <TouchableOpacity>
              <LinearGradient
                colors={['#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 rounded-3xl shadow-xl"
                style={{
                  shadowColor: '#059669',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-xl font-extrabold mr-2">Donate to this Project</Text>
                  <Text className="text-white text-2xl">💝</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="h-8"></View>
      </ScrollView>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '80%' }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-extrabold text-slate-800">Add Comment</Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Text className="text-slate-500 text-3xl">×</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-slate-700 font-bold mb-2">Comment</Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800"
                placeholder="Share your thoughts..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                editable={!isSubmitting}
                style={{ minHeight: 150 }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmitComment}
              disabled={isSubmitting}
              className={`bg-emerald-600 py-4 rounded-2xl ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-center text-lg">Submit Comment</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
