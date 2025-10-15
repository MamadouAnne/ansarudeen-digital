import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/message';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMessages } from '@/hooks/useMessages';
import { useAdmin } from '@/hooks/useAdmin';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function MessagesScreen() {
  // Icon size updated to 16
  const colorScheme = useColorScheme();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { messages, loading, error, refetch, markAsRead } = useMessages();
  const { isAdmin } = useAdmin();
  const scrollViewRef = useRef<ScrollView>(null);

  const unreadCount = messages.filter(msg => !msg.read).length;

  // Auto-scroll to bottom when messages load or change
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleMessagePress = (message: Message) => {
    // If message has a project, navigate to project details
    if (message.project_id && message.project) {
      if (!message.read) {
        markAsRead(message.id);
      }
      router.push(`/projects/${message.project_id}`);
      return;
    }

    // If message has a news article, navigate to news details
    if (message.news_article_id && message.news_article) {
      if (!message.read) {
        markAsRead(message.id);
      }
      router.push(`/news/${message.news_article_id}`);
      return;
    }

    // If message has an event, navigate to event details
    if (message.event_id && message.event) {
      if (!message.read) {
        markAsRead(message.id);
      }
      router.push(`/events/${message.event_id}`);
      return;
    }

    // Otherwise, show message details
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement':
        return 'megaphone.fill';
      case 'reminder':
        return 'bell.badge.fill';
      case 'event':
        return 'calendar.badge.clock';
      case 'update':
        return 'arrow.clockwise.circle.fill';
      default:
        return 'envelope.fill';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement':
        return '#FF6B6B';
      case 'reminder':
        return '#4ECDC4';
      case 'event':
        return '#45B7D1';
      case 'update':
        return '#96CEB4';
      default:
        return Colors[colorScheme ?? 'light'].tint;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF4757';
      case 'normal':
        return '#FFA502';
      case 'low':
        return '#26DE81';
      default:
        return Colors[colorScheme ?? 'light'].tabIconDefault;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (selectedMessage) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedMessage(null)}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.detailHeader}>
            {/* Icon and Title Row */}
            <View style={styles.detailTitleRow}>
              <View style={[styles.categoryBadgeSmall, { backgroundColor: getCategoryColor(selectedMessage.category) }]}>
                <IconSymbol
                  name={getCategoryIcon(selectedMessage.category)}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <Text style={[styles.detailTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                {selectedMessage.title}
              </Text>
            </View>

            {/* Meta Information */}
            <View style={styles.detailMeta}>
              <View style={styles.metaTags}>
                <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(selectedMessage.category) + '15', borderColor: getCategoryColor(selectedMessage.category) }]}>
                  <Text style={[styles.categoryTagText, { color: getCategoryColor(selectedMessage.category) }]}>
                    {selectedMessage.category}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedMessage.priority) + '20', borderWidth: 1, borderColor: getPriorityColor(selectedMessage.priority) + '40' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(selectedMessage.priority) }]}>
                    {selectedMessage.priority.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.timestamp, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.6 }]}>
                  {formatTimestamp(selectedMessage.timestamp)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '15' }]} />

          <View style={styles.detailContent}>
            <Text style={[styles.contentText, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.85 }]}>
              {selectedMessage.content}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Messages
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Ansarudeen Communication Hub
          </Text>
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
          {isAdmin && (
            <TouchableOpacity
              style={[styles.composeButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => router.push('/compose-message')}
            >
              <IconSymbol name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>


      {loading && messages.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Loading messages...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={refetch} style={[styles.retryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={Colors[colorScheme ?? 'light'].tint}
            />
          }
        >
          {messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              onPress={() => handleMessagePress(message)}
              activeOpacity={0.7}
              style={styles.messageWrapper}
            >
              {message.project_id && message.project ? (
                // Project Card Message
                <View style={styles.messageRow}>
                  <View style={[styles.avatar, { backgroundColor: getCategoryColor(message.category) }]}>
                    <IconSymbol
                      name={getCategoryIcon(message.category)}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.messageBubbleContainer}>
                    <View style={[styles.projectCardBubble, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F0' }]}>
                      {/* Time Badge */}
                      <View style={styles.projectTimeStamp}>
                        <Text style={[styles.bubbleTimeText, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.7 }]}>
                          {formatTimestamp(message.timestamp)}
                        </Text>
                        {!message.read && (
                          <View style={[styles.unreadDot, { backgroundColor: Colors[colorScheme ?? 'light'].tint, marginLeft: 6 }]} />
                        )}
                      </View>

                      {/* Project Card */}
                      <View style={styles.projectCard}>
                        <LinearGradient
                          colors={['#ffffff', '#f0fdf4', '#dcfce7']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.projectCardGradient}
                        >
                          {/* Project Image */}
                          {message.project.image && (
                            <View style={styles.projectImageContainer}>
                              <Image
                                source={{ uri: message.project.image }}
                                style={styles.projectImage}
                                resizeMode="cover"
                              />
                              <LinearGradient
                                colors={['rgba(5, 150, 105, 0.6)', 'transparent']}
                                style={styles.projectImageOverlay}
                              />
                              <View style={styles.projectStatusBadge}>
                                <Text style={styles.projectStatusText}>
                                  {message.project.status === 'planning' ? 'Planning' : message.project.status === 'ongoing' ? 'In Progress' : 'Completed'}
                                </Text>
                              </View>
                            </View>
                          )}

                          {/* Project Content */}
                          <View style={styles.projectContent}>
                            <View style={styles.projectTitleContainer}>
                              <Text style={styles.projectTitle} numberOfLines={1}>
                                {message.project.title}
                              </Text>
                              <Text style={styles.projectTitleArabic} numberOfLines={1}>
                                {message.project.title_arabic}
                              </Text>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.projectProgressContainer}>
                              <View style={styles.projectProgressHeader}>
                                <Text style={styles.projectProgressLabel}>Progress</Text>
                                <Text style={styles.projectProgressValue}>{Math.round(message.project.progress)}%</Text>
                              </View>
                              <View style={styles.projectProgressBar}>
                                <View
                                  style={[styles.projectProgressFill, { width: `${Math.min(message.project.progress, 100)}%` }]}
                                />
                              </View>
                            </View>

                            {/* Fundraising Info */}
                            <View style={styles.projectFundingContainer}>
                              <Text style={styles.projectFundingText}>
                                💰 {formatCurrency(message.project.raised_amount)} / {formatCurrency(message.project.target_amount)}
                              </Text>
                              <View style={styles.projectViewButton}>
                                <Text style={styles.projectViewButtonText}>View →</Text>
                              </View>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                  </View>
                </View>
              ) : message.news_article_id && message.news_article ? (
                // News Card Message
                <View style={styles.messageRow}>
                  <View style={[styles.avatar, { backgroundColor: getCategoryColor(message.category) }]}>
                    <IconSymbol
                      name={getCategoryIcon(message.category)}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.messageBubbleContainer}>
                    <View style={[styles.newsCardBubble, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F0' }]}>
                      {/* Time Badge */}
                      <View style={styles.newsTimeStamp}>
                        <Text style={[styles.bubbleTimeText, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.7 }]}>
                          {formatTimestamp(message.timestamp)}
                        </Text>
                        {!message.read && (
                          <View style={[styles.unreadDot, { backgroundColor: Colors[colorScheme ?? 'light'].tint, marginLeft: 6 }]} />
                        )}
                      </View>

                      {/* News Card */}
                      <View style={styles.newsCard}>
                        {/* News Image */}
                        {message.news_article.image && (
                          <View style={styles.newsImageContainer}>
                            <Image
                              source={{ uri: message.news_article.image }}
                              style={styles.newsImage}
                              resizeMode="cover"
                            />
                            <LinearGradient
                              colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
                              style={styles.newsImageOverlay}
                            />
                            <View style={styles.newsCategoryBadge}>
                              <Text style={styles.newsCategoryText}>{message.news_article.category}</Text>
                            </View>
                          </View>
                        )}

                        {/* News Content */}
                        <View style={styles.newsContent}>
                          <Text style={styles.newsTitle} numberOfLines={2}>
                            {message.news_article.title}
                          </Text>
                          <Text style={styles.newsTitleArabic} numberOfLines={1}>
                            {message.news_article.title_arabic}
                          </Text>
                          <Text style={styles.newsExcerpt} numberOfLines={2}>
                            {message.news_article.excerpt}
                          </Text>

                          {/* News Meta */}
                          <View style={styles.newsMetaContainer}>
                            <Text style={styles.newsAuthor}>{message.news_article.author}</Text>
                            <Text style={styles.newsSeparator}>•</Text>
                            <Text style={styles.newsReadTime}>{message.news_article.read_time}</Text>
                            <View style={styles.newsReadButton}>
                              <Text style={styles.newsReadButtonText}>Read →</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : message.event_id && message.event ? (
                // Event Card Message
                <View style={styles.messageRow}>
                  <View style={[styles.avatar, { backgroundColor: getCategoryColor(message.category) }]}>
                    <IconSymbol
                      name={getCategoryIcon(message.category)}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.messageBubbleContainer}>
                    <View style={[styles.eventCardBubble, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F0' }]}>
                      {/* Time Badge */}
                      <View style={styles.eventTimeStamp}>
                        <Text style={[styles.bubbleTimeText, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.7 }]}>
                          {formatTimestamp(message.timestamp)}
                        </Text>
                        {!message.read && (
                          <View style={[styles.unreadDot, { backgroundColor: Colors[colorScheme ?? 'light'].tint, marginLeft: 6 }]} />
                        )}
                      </View>

                      {/* Event Card */}
                      <View style={styles.eventCard}>
                        {/* Event Image */}
                        {message.event.image && (
                          <View style={styles.eventImageContainer}>
                            <Image
                              source={{ uri: message.event.image }}
                              style={styles.eventImage}
                              resizeMode="cover"
                            />
                            <LinearGradient
                              colors={['rgba(69, 183, 209, 0.7)', 'transparent']}
                              style={styles.eventImageOverlay}
                            />
                            <View style={styles.eventStatusBadge}>
                              <Text style={styles.eventStatusText}>
                                {message.event.status === 'upcoming' ? 'Upcoming' :
                                 message.event.status === 'ongoing' ? 'Happening Now' :
                                 message.event.status === 'completed' ? 'Completed' : 'Cancelled'}
                              </Text>
                            </View>
                          </View>
                        )}

                        {/* Event Content */}
                        <View style={styles.eventContent}>
                          <Text style={styles.eventTitle} numberOfLines={2}>
                            {message.event.title}
                          </Text>
                          <Text style={styles.eventTitleArabic} numberOfLines={1}>
                            {message.event.title_arabic}
                          </Text>
                          <Text style={styles.eventDescription} numberOfLines={2}>
                            {message.event.description}
                          </Text>

                          {/* Event Details */}
                          <View style={styles.eventDetailsContainer}>
                            <View style={styles.eventDetailRow}>
                              <Text style={styles.eventDetailIcon}>📅</Text>
                              <Text style={styles.eventDetailText}>{message.event.date}</Text>
                            </View>
                            <View style={styles.eventDetailRow}>
                              <Text style={styles.eventDetailIcon}>⏰</Text>
                              <Text style={styles.eventDetailText}>{message.event.time}</Text>
                            </View>
                            <View style={styles.eventDetailRow}>
                              <Text style={styles.eventDetailIcon}>📍</Text>
                              <Text style={styles.eventDetailText} numberOfLines={1}>{message.event.location}</Text>
                            </View>
                          </View>

                          {/* Event Meta */}
                          <View style={styles.eventMetaContainer}>
                            <View style={styles.eventAttendanceInfo}>
                              <Text style={styles.eventAttendanceText}>
                                👥 {message.event.attendees}/{message.event.capacity}
                              </Text>
                              <Text style={styles.eventPriceText}>{message.event.price}</Text>
                            </View>
                            <View style={styles.eventJoinButton}>
                              <Text style={styles.eventJoinButtonText}>View Details →</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                // Regular Text Message
                <View style={styles.messageRow}>
                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: getCategoryColor(message.category) }]}>
                    <IconSymbol
                      name={getCategoryIcon(message.category)}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>

                  {/* Message Bubble */}
                  <View style={styles.messageBubbleContainer}>
                    <View style={[
                      styles.messageBubble,
                      { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F0F0F0' },
                    ]}>
                      {/* Header with category and time */}
                      <View style={styles.bubbleHeader}>
                        <View style={styles.bubbleHeaderLeft}>
                          <View style={[styles.categoryPill, { backgroundColor: getCategoryColor(message.category) + '15', borderWidth: 1, borderColor: getCategoryColor(message.category) }]}>
                            <Text style={[styles.categoryPillText, { color: getCategoryColor(message.category) }]} numberOfLines={1}>
                              {message.category}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.bubbleTimeText, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.7 }]} numberOfLines={1}>
                          {formatTimestamp(message.timestamp)}
                        </Text>
                      </View>

                      {/* Message Title */}
                      <Text style={[
                        styles.bubbleTitle,
                        { color: Colors[colorScheme ?? 'light'].text },
                        !message.read && styles.bubbleTitleUnread,
                      ]}>
                        {message.title}
                      </Text>

                      {/* Message Preview */}
                      <Text
                        style={[styles.bubbleContent, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.75 }]}
                        numberOfLines={2}
                      >
                        {message.content}
                      </Text>
                    </View>

                    {/* Unread indicator */}
                    {!message.read && (
                      <View style={styles.unreadIndicator}>
                        <View style={[styles.unreadDot, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]} />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol name="tray.fill" size={64} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
              <Text style={[styles.emptyStateText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                No messages
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unreadBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  composeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  messageBubbleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageBubble: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  bubbleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  bubbleSenderName: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: 100,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    flexShrink: 0,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bubbleTimeText: {
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 0,
    minWidth: 50,
  },
  bubbleTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  bubbleTitleUnread: {
    fontWeight: '700',
  },
  bubbleContent: {
    fontSize: 14,
    lineHeight: 18,
  },
  unreadIndicator: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
  // Detail View Styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 17,
    fontWeight: '600',
  },
  detailContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  detailHeader: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  categoryBadgeSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
    flex: 1,
  },
  detailMeta: {
    gap: 8,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderText: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  senderRole: {
    fontSize: 14,
    marginTop: 2,
  },
  metaTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  detailContent: {
    paddingBottom: 40,
  },
  contentText: {
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Project Card Styles
  projectCardBubble: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectTimeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  projectCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  projectCardGradient: {
    borderRadius: 14,
  },
  projectImageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
  },
  projectImage: {
    width: '100%',
    height: 100,
  },
  projectImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
  },
  projectStatusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#fcd34d',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  projectStatusText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '800',
  },
  projectContent: {
    padding: 8,
  },
  projectTitleContainer: {
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  projectTitleArabic: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  projectProgressContainer: {
    marginBottom: 4,
  },
  projectProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  projectProgressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  projectProgressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  projectProgressBar: {
    backgroundColor: '#cbd5e1',
    borderRadius: 8,
    height: 6,
  },
  projectProgressFill: {
    backgroundColor: '#059669',
    height: 6,
    borderRadius: 8,
  },
  projectFundingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  projectFundingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    flex: 1,
  },
  projectViewButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  projectViewButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 10,
  },
  // News Card Styles
  newsCardBubble: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsTimeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  newsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  newsImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  newsImage: {
    width: '100%',
    height: 120,
  },
  newsImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  newsCategoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newsCategoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  newsContent: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
    lineHeight: 20,
  },
  newsTitleArabic: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 6,
  },
  newsExcerpt: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  newsMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newsAuthor: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  newsSeparator: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  newsReadTime: {
    fontSize: 11,
    color: '#94a3b8',
    flex: 1,
  },
  newsReadButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newsReadButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 10,
  },
  // Event Card Styles
  eventCardBubble: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTimeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#45B7D1',
  },
  eventImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  eventStatusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#93c5fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  eventStatusText: {
    color: '#1e40af',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  eventContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
    lineHeight: 20,
  },
  eventTitleArabic: {
    fontSize: 12,
    fontWeight: '600',
    color: '#45B7D1',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  eventDetailsContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    gap: 4,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailIcon: {
    fontSize: 14,
    width: 20,
  },
  eventDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  eventMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  eventAttendanceInfo: {
    flex: 1,
    gap: 4,
  },
  eventAttendanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  eventPriceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  eventJoinButton: {
    backgroundColor: '#45B7D1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventJoinButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 10,
  },
});
