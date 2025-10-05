import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface NewsMedia {
  type: 'image' | 'video';
  uri: string;
}

interface NewsArticle {
  id: number;
  title: string;
  title_arabic: string;
  content: string;
  category: string;
  media: NewsMedia[];
  author: string;
  author_bio: string;
  date: string;
  read_time: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface Comment {
  id: number;
  user_name: string;
  comment_text: string;
  created_at: string;
}

const COMMENTS_PER_PAGE = 2;

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArticle();
    loadComments(true);
    checkIfLiked();
  }, [id]);

  // Refresh article when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchArticle();
      loadComments(true);
      checkIfLiked();
    }, [id])
  );

  const checkIfLiked = async () => {
    try {
      const likedArticles = await AsyncStorage.getItem('likedArticles');
      if (likedArticles) {
        const likedArray = JSON.parse(likedArticles);
        setIsLiked(likedArray.includes(Number(id)));
      }
    } catch (error) {
      console.error('Error checking if liked:', error);
    }
  };

  async function fetchArticle() {
    try {
      setLoading(true);

      // Fetch all data in one query using joins
      const { data: articleData, error } = await supabase
        .from('news_articles')
        .select(`
          *,
          news_media (
            type,
            uri,
            display_order
          ),
          news_tags (
            tag
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Sort media by display_order
      const sortedMedia = (articleData.news_media || []).sort(
        (a: any, b: any) => a.display_order - b.display_order
      );

      const transformedArticle: NewsArticle = {
        id: articleData.id,
        title: articleData.title,
        title_arabic: articleData.title_arabic,
        content: articleData.content,
        category: articleData.category,
        media: sortedMedia.map((m: any) => ({
          type: m.type,
          uri: m.uri,
        })),
        author: articleData.author,
        author_bio: articleData.author_bio,
        date: articleData.date,
        read_time: articleData.read_time,
        likes: articleData.likes,
        comments: articleData.comments,
        tags: (articleData.news_tags || []).map((t: any) => t.tag),
      };

      setArticle(transformedArticle);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  }

  const loadComments = async (reset: boolean = false) => {
    try {
      setIsLoadingComments(true);
      const currentPage = reset ? 0 : commentsPage;
      const from = currentPage * COMMENTS_PER_PAGE;
      const to = from + COMMENTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('news_comments')
        .select('*', { count: 'exact' })
        .eq('news_article_id', id)
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
        .from('news_comments')
        .select('*', { count: 'exact' })
        .eq('news_article_id', id)
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

      // Insert comment
      const { error: commentError } = await supabase
        .from('news_comments')
        .insert({
          news_article_id: id,
          user_name: userName,
          comment_text: commentText.trim(),
        });

      if (commentError) throw commentError;

      // Update comment count in news_articles
      const newCommentCount = (article?.comments || 0) + 1;
      const { error: updateError } = await supabase
        .from('news_articles')
        .update({ comments: newCommentCount })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      if (article) {
        setArticle({ ...article, comments: newCommentCount });
      }

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
    if (isUpdatingLike || !article) return;

    try {
      setIsUpdatingLike(true);
      const newLikedState = !isLiked;
      const newLikesCount = newLikedState ? article.likes + 1 : article.likes - 1;

      // Optimistically update UI
      setIsLiked(newLikedState);
      setArticle({ ...article, likes: newLikesCount });

      // Update in database
      const { error } = await supabase
        .from('news_articles')
        .update({ likes: newLikesCount })
        .eq('id', id);

      if (error) {
        // Revert on error
        setIsLiked(!newLikedState);
        setArticle({ ...article, likes: article.likes });
        console.error('Error updating like:', error);
        return;
      }

      // Update AsyncStorage to track liked state
      const likedArticles = await AsyncStorage.getItem('likedArticles');
      let likedArray = likedArticles ? JSON.parse(likedArticles) : [];

      if (newLikedState) {
        // Add to liked
        if (!likedArray.includes(Number(id))) {
          likedArray.push(Number(id));
        }
      } else {
        // Remove from liked
        likedArray = likedArray.filter((articleId: number) => articleId !== Number(id));
      }

      await AsyncStorage.setItem('likedArticles', JSON.stringify(likedArray));
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setArticle({ ...article, likes: article.likes });
    } finally {
      setIsUpdatingLike(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-emerald-600 items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: '#059669' }
          }}
        />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading article...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View className="flex-1 bg-emerald-600 items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: '#059669' }
          }}
        />
        <Text className="text-white text-lg">Article not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-white px-6 py-3 rounded-full">
          <Text className="text-emerald-600 font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Announcements':
        return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' };
      case 'Events':
        return { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' };
      case 'Community':
        return { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' };
      case 'Education':
        return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' };
      case 'Projects':
        return { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' };
      default:
        return { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' };
    }
  };

  const categoryColors = getCategoryColor(article.category);

  return (
    <View className="flex-1 bg-emerald-600">
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: '#059669' }
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: '#f8fafc' }}>
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
            {article.media.map((media, index) => (
              <View key={index} style={{ width }}>
                <Image
                  source={{ uri: media.uri }}
                  className="h-64 bg-slate-300"
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Media Indicators */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {article.media.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  activeMediaIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </View>
        </View>

        <View className="px-5 py-5">
          {/* Article Header */}
          <View className="bg-white rounded-3xl shadow-lg border border-emerald-200/60 p-5 mb-5">
            {/* Category and Date */}
            <View className="flex-row items-center justify-between mb-3">
              <View className={`px-4 py-2 rounded-full border-2 ${categoryColors.bg} ${categoryColors.border}`}>
                <Text className={`text-sm font-extrabold ${categoryColors.text}`}>
                  {article.category}
                </Text>
              </View>
              <Text className="text-slate-500 text-sm font-semibold">{article.date}</Text>
            </View>

            {/* Title */}
            <Text className="text-2xl font-extrabold text-slate-800 mb-1">{article.title}</Text>
            <Text className="text-emerald-600 text-sm font-bold mb-4">{article.title_arabic}</Text>

            {/* Author Info */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-emerald-600 text-lg font-bold">{article.author[0]}</Text>
                </View>
                <View>
                  <Text className="text-slate-800 text-sm font-bold">{article.author}</Text>
                  <Text className="text-slate-500 text-xs">{article.author_bio}</Text>
                </View>
              </View>
              <Text className="text-slate-500 text-xs font-semibold">{article.read_time}</Text>
            </View>

            {/* Article Content */}
            <Text className="text-slate-700 text-base leading-6 mb-4">
              {article.content}
            </Text>

            {/* Tags */}
            <View className="flex-row flex-wrap mb-4">
              {article.tags.map((tag, index) => (
                <View key={index} className="bg-slate-100 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-slate-600 text-xs font-semibold">#{tag}</Text>
                </View>
              ))}
            </View>

            {/* Engagement Stats */}
            <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-300/50">
              <View className="flex-row items-center justify-around">
                <TouchableOpacity
                  onPress={handleLike}
                  disabled={isUpdatingLike}
                  className="flex-row items-center"
                >
                  <Text className={`text-2xl mr-2 ${isLiked ? '' : 'opacity-40'}`}>❤️</Text>
                  <Text className="text-slate-700 font-extrabold text-lg">
                    {article.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowCommentModal(true)}
                  className="flex-row items-center"
                >
                  <Text className="text-2xl mr-2">💬</Text>
                  <Text className="text-slate-700 font-extrabold text-lg">{totalComments}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-2xl mr-2">📤</Text>
                  <Text className="text-slate-700 font-extrabold text-sm">Share</Text>
                </TouchableOpacity>
              </View>
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

          {/* Related Articles */}
          <View className="bg-white rounded-3xl shadow-lg border border-emerald-200/60 p-5 mb-5">
            <Text className="text-xl font-bold text-slate-800 mb-3">Related Articles</Text>
            <Text className="text-slate-600 text-sm">More articles coming soon...</Text>
          </View>
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
