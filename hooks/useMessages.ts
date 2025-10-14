import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/message';

export interface MessageWithReadStatus extends Message {
  read: boolean;
}

export function useMessages() {
  const [messages, setMessages] = useState<MessageWithReadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // If not authenticated, just fetch messages without read status
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select(`
            *,
            projects:project_id(
              id, title, title_arabic, description, full_description, category, status, progress, target_amount, raised_amount, featured,
              project_media(uri)
            ),
            news_articles:news_article_id(
              id, title, title_arabic, excerpt, content, category, author, date, read_time,
              news_media(uri)
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: true }); // Oldest first, will display bottom to top

        if (fetchError) throw fetchError;

        // Map to MessageWithReadStatus format with read = false for all
        const messagesData: MessageWithReadStatus[] = ((data || []) as any[]).map((msg: any) => ({
          id: msg.id,
          title: msg.title,
          content: msg.content,
          category: msg.category as Message['category'],
          priority: msg.priority as Message['priority'],
          sender: {
            name: msg.sender_name,
            role: msg.sender_role,
          },
          timestamp: msg.created_at,
          read: false,
          project_id: msg.project_id,
          project: msg.projects ? {
            ...msg.projects,
            image: msg.projects.project_media?.[0]?.uri || 'https://picsum.photos/seed/project-default/800/500',
          } : null,
          news_article_id: msg.news_article_id,
          news_article: msg.news_articles ? {
            ...msg.news_articles,
            image: msg.news_articles.news_media?.[0]?.uri || 'https://picsum.photos/seed/news-default/800/500',
          } : null,
        }));

        setMessages(messagesData);
      } else {
        // Fetch messages with read status for authenticated user
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select(`
            *,
            message_reads!left(read_at),
            projects:project_id(
              id, title, title_arabic, description, full_description, category, status, progress, target_amount, raised_amount, featured,
              project_media(uri)
            ),
            news_articles:news_article_id(
              id, title, title_arabic, excerpt, content, category, author, date, read_time,
              news_media(uri)
            )
          `)
          .eq('is_published', true)
          .eq('message_reads.user_id', user.id)
          .order('created_at', { ascending: true }); // Oldest first, will display bottom to top

        if (fetchError) throw fetchError;

        // Map to MessageWithReadStatus format
        const messagesData: MessageWithReadStatus[] = ((data || []) as any[]).map((msg: any) => ({
          id: msg.id,
          title: msg.title,
          content: msg.content,
          category: msg.category as Message['category'],
          priority: msg.priority as Message['priority'],
          sender: {
            name: msg.sender_name,
            role: msg.sender_role,
          },
          timestamp: msg.created_at,
          read: msg.message_reads && msg.message_reads.length > 0,
          project_id: msg.project_id,
          project: msg.projects ? {
            ...msg.projects,
            image: msg.projects.project_media?.[0]?.uri || 'https://picsum.photos/seed/project-default/800/500',
          } : null,
          news_article_id: msg.news_article_id,
          news_article: msg.news_articles ? {
            ...msg.news_articles,
            image: msg.news_articles.news_media?.[0]?.uri || 'https://picsum.photos/seed/news-default/800/500',
          } : null,
        }));

        setMessages(messagesData);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('message_reads')
        .upsert({
          message_id: messageId,
          user_id: user.id,
        } as any, {
          onConflict: 'message_id,user_id',
        });

      if (error) throw error;

      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    markAsRead,
  };
}
