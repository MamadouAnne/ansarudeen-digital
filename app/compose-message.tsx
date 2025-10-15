import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

type MessageCategory = 'announcement' | 'reminder' | 'event' | 'update';
type MessagePriority = 'high' | 'normal' | 'low';

export default function ComposeMessageScreen() {
  const colorScheme = useColorScheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MessageCategory>('announcement');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [sending, setSending] = useState(false);

  const categories: { value: MessageCategory; label: string; icon: string; color: string }[] = [
    { value: 'announcement', label: 'Announcement', icon: 'megaphone.fill', color: '#FF6B6B' },
    { value: 'reminder', label: 'Reminder', icon: 'bell.badge.fill', color: '#4ECDC4' },
    { value: 'event', label: 'Event', icon: 'calendar.badge.clock', color: '#45B7D1' },
    { value: 'update', label: 'Update', icon: 'arrow.clockwise.circle.fill', color: '#96CEB4' },
  ];

  const priorities: { value: MessagePriority; label: string; color: string }[] = [
    { value: 'high', label: 'High Priority', color: '#FF4757' },
    { value: 'normal', label: 'Normal', color: '#FFA502' },
    { value: 'low', label: 'Low Priority', color: '#26DE81' },
  ];

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and content.');
      return;
    }

    try {
      setSending(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to send messages.');
        return;
      }

      // Get user's name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('messages')
        .insert({
          title: title.trim(),
          content: content.trim(),
          category,
          priority,
          sender_id: user.id,
          sender_name: (profile as any)?.full_name || 'Admin',
          sender_role: 'Administrator',
          published_at: new Date().toISOString(),
          is_published: true,
        } as any);

      if (error) throw error;

      Alert.alert(
        'Success!',
        'Your message has been sent to all users.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          New Message
        </Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="Enter message title..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={[styles.charCount, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {title.length}/100
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Category
          </Text>
          <View style={styles.optionsGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.optionCard,
                  { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' },
                  category === cat.value && {
                    backgroundColor: cat.color + '20',
                    borderColor: cat.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <IconSymbol name={cat.icon as any} size={24} color={cat.color} />
                <Text
                  style={[
                    styles.optionLabel,
                    { color: Colors[colorScheme ?? 'light'].text },
                    category === cat.value && { fontWeight: '700' },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Priority
          </Text>
          <View style={styles.priorityOptions}>
            {priorities.map((prio) => (
              <TouchableOpacity
                key={prio.value}
                style={[
                  styles.priorityButton,
                  { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' },
                  priority === prio.value && {
                    backgroundColor: prio.color + '20',
                    borderColor: prio.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setPriority(prio.value)}
              >
                <View style={[styles.priorityDot, { backgroundColor: prio.color }]} />
                <Text
                  style={[
                    styles.priorityLabel,
                    { color: Colors[colorScheme ?? 'light'].text },
                    priority === prio.value && { fontWeight: '700' },
                  ]}
                >
                  {prio.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Message Content
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="Write your message here..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={[styles.charCount, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {content.length}/1000
          </Text>
        </View>

        {/* Preview */}
        <View style={styles.previewSection}>
          <Text style={[styles.previewTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Preview
          </Text>
          <View
            style={[
              styles.previewCard,
              { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF' },
            ]}
          >
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.previewCategoryBadge,
                  {
                    backgroundColor:
                      categories.find((c) => c.value === category)?.color + '20' || '#00000020',
                  },
                ]}
              >
                <IconSymbol
                  name={(categories.find((c) => c.value === category)?.icon || 'envelope.fill') as any}
                  size={16}
                  color={categories.find((c) => c.value === category)?.color || '#000000'}
                />
                <Text
                  style={[
                    styles.previewCategoryText,
                    {
                      color:
                        categories.find((c) => c.value === category)?.color || '#000000',
                    },
                  ]}
                >
                  {category}
                </Text>
              </View>
              {priority === 'high' && (
                <IconSymbol name="exclamationmark.circle.fill" size={16} color="#FF4757" />
              )}
            </View>
            <Text style={[styles.previewMessageTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {title || 'Message Title'}
            </Text>
            <Text style={[styles.previewContent, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {content || 'Message content will appear here...'}
            </Text>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            sending && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send to All Users</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 150,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityOptions: {
    gap: 12,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  previewSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  previewCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  previewMessageTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
