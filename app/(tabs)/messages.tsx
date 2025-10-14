import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/message';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMessages } from '@/hooks/useMessages';
import { useAdmin } from '@/hooks/useAdmin';
import { router } from 'expo-router';

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { messages, loading, error, refetch, markAsRead } = useMessages();
  const { isAdmin } = useAdmin();
  const scrollViewRef = useRef<ScrollView>(null);

  const filteredMessages = filter === 'unread'
    ? messages.filter(msg => !msg.read)
    : messages;

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
    setSelectedMessage(message);
    // Mark as read when opened
    if (!message.read) {
      markAsRead(message.id);
    }
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
            <View style={[styles.categoryBadgeLarge, { backgroundColor: getCategoryColor(selectedMessage.category) }]}>
              <IconSymbol
                name={getCategoryIcon(selectedMessage.category)}
                size={32}
                color="#FFFFFF"
              />
            </View>

            <Text style={[styles.detailTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {selectedMessage.title}
            </Text>

            <View style={styles.detailMeta}>
              <View style={styles.senderInfo}>
                <View style={styles.avatarCircle}>
                  <IconSymbol name="person.fill" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.senderText}>
                  <Text style={[styles.senderName, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {selectedMessage.sender.name}
                  </Text>
                  <Text style={[styles.senderRole, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    {selectedMessage.sender.role}
                  </Text>
                </View>
              </View>

              <View style={styles.metaTags}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedMessage.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(selectedMessage.priority) }]}>
                    {selectedMessage.priority.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.timestamp, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  {formatTimestamp(selectedMessage.timestamp)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '20' }]} />

          <View style={styles.detailContent}>
            <Text style={[styles.contentText, { color: Colors[colorScheme ?? 'light'].text }]}>
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

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
            filter === 'all' && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filter === 'all' ? '#FFFFFF' : Colors[colorScheme ?? 'light'].tabIconDefault },
          ]}>
            All Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('unread')}
          style={[
            styles.filterButton,
            filter === 'unread' && styles.filterButtonActive,
            filter === 'unread' && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filter === 'unread' ? '#FFFFFF' : Colors[colorScheme ?? 'light'].tabIconDefault },
          ]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
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
          {filteredMessages.map((message) => (
            <TouchableOpacity
              key={message.id}
              onPress={() => handleMessagePress(message)}
              activeOpacity={0.7}
            >
            <View style={[
              styles.messageCard,
              { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF' },
              !message.read && { borderLeftWidth: 4, borderLeftColor: Colors[colorScheme ?? 'light'].tint },
            ]}>
              <View style={styles.messageCardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(message.category) + '20' }]}>
                  <IconSymbol
                    name={getCategoryIcon(message.category)}
                    size={16}
                    color={getCategoryColor(message.category)}
                  />
                  <Text style={[styles.categoryText, { color: getCategoryColor(message.category) }]}>
                    {message.category}
                  </Text>
                </View>

                {!message.read && (
                  <View style={styles.unreadDot} />
                )}
              </View>

              <Text style={[
                styles.messageTitle,
                { color: Colors[colorScheme ?? 'light'].text },
                !message.read && styles.messageUnread,
              ]}>
                {message.title}
              </Text>

              <Text
                style={[styles.messagePreview, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}
                numberOfLines={2}
              >
                {message.content}
              </Text>

              <View style={styles.messageFooter}>
                <View style={styles.senderBadge}>
                  <IconSymbol name="person.circle.fill" size={16} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
                  <Text style={[styles.senderNameSmall, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    {message.sender.name}
                  </Text>
                </View>

                <View style={styles.metaInfo}>
                  {message.priority === 'high' && (
                    <View style={styles.priorityIndicator}>
                      <IconSymbol name="exclamationmark.circle.fill" size={14} color="#FF4757" />
                    </View>
                  )}
                  <Text style={[styles.timestampSmall, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    {formatTimestamp(message.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

          {filteredMessages.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol name="tray.fill" size={64} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
              <Text style={[styles.emptyStateText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                No {filter === 'unread' ? 'unread' : ''} messages
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#00000010',
    alignItems: 'center',
  },
  filterButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  messageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4757',
  },
  messageTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  messageUnread: {
    fontWeight: 'bold',
  },
  messagePreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  senderNameSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityIndicator: {
    marginRight: 2,
  },
  timestampSmall: {
    fontSize: 12,
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  categoryBadgeLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 16,
  },
  detailMeta: {
    gap: 12,
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
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  detailContent: {
    paddingBottom: 40,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
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
});
