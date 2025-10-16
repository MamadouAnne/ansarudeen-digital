export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: 'announcement' | 'reminder' | 'event' | 'update';
          priority: 'high' | 'normal' | 'low';
          sender_id: string | null;
          sender_name: string;
          sender_role: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          is_published: boolean;
          project_id: number | null;
          news_article_id: number | null;
          event_id: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category?: 'announcement' | 'reminder' | 'event' | 'update';
          priority?: 'high' | 'normal' | 'low';
          sender_id?: string | null;
          sender_name: string;
          sender_role?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          is_published?: boolean;
          project_id?: number | null;
          news_article_id?: number | null;
          event_id?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: 'announcement' | 'reminder' | 'event' | 'update';
          priority?: 'high' | 'normal' | 'low';
          sender_id?: string | null;
          sender_name?: string;
          sender_role?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          is_published?: boolean;
          project_id?: number | null;
          news_article_id?: number | null;
          event_id?: number | null;
        };
      };
      message_reads: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          user_id?: string;
          read_at?: string;
        };
      };
      projects: {
        Row: {
          id: number;
          title: string;
          title_arabic: string;
          description: string;
          full_description: string;
          category: string;
          icon: string;
          status: 'ongoing' | 'planning' | 'completed';
          progress: number;
          budget: string;
          target_amount: number;
          raised_amount: number;
          start_date: string;
          donors: number;
          created_at: string;
          updated_at: string;
          likes: number;
          featured: boolean;
        };
        Insert: {
          id?: number;
          title: string;
          title_arabic: string;
          description: string;
          full_description: string;
          category: string;
          icon: string;
          status: 'ongoing' | 'planning' | 'completed';
          progress?: number;
          budget: string;
          target_amount: number;
          raised_amount?: number;
          start_date: string;
          donors?: number;
          created_at?: string;
          updated_at?: string;
          likes?: number;
          featured?: boolean;
        };
        Update: {
          id?: number;
          title?: string;
          title_arabic?: string;
          description?: string;
          full_description?: string;
          category?: string;
          icon?: string;
          status?: 'ongoing' | 'planning' | 'completed';
          progress?: number;
          budget?: string;
          target_amount?: number;
          raised_amount?: number;
          start_date?: string;
          donors?: number;
          created_at?: string;
          updated_at?: string;
          likes?: number;
          featured?: boolean;
        };
      };
      project_media: {
        Row: {
          id: number;
          project_id: number;
          type: 'image' | 'video';
          uri: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          project_id: number;
          type: 'image' | 'video';
          uri: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          project_id?: number;
          type?: 'image' | 'video';
          uri?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      project_comments: {
        Row: {
          id: number;
          project_id: number;
          user_name: string;
          comment_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          project_id: number;
          user_name: string;
          comment_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          project_id?: number;
          user_name?: string;
          comment_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          updated_at?: string | null;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          updated_at?: string | null;
        };
      };
      marketplace_categories: {
        Row: {
          id: string;
          name: string;
          name_arabic: string;
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          name_arabic: string;
          icon: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_arabic?: string;
          icon?: string;
          color?: string;
          created_at?: string;
        };
      };
      marketplace_items: {
        Row: {
          id: number;
          title: string;
          title_arabic: string;
          description: string;
          price: number;
          category: string;
          condition: 'new' | 'like_new' | 'good' | 'fair';
          seller_id: string;
          seller_name: string;
          seller_phone: string;
          seller_whatsapp: string | null;
          images: string[];
          location: string;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          title_arabic: string;
          description: string;
          price: number;
          category: string;
          condition: 'new' | 'like_new' | 'good' | 'fair';
          seller_id: string;
          seller_name: string;
          seller_phone: string;
          seller_whatsapp?: string | null;
          images: string[];
          location: string;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          title_arabic?: string;
          description?: string;
          price?: number;
          category?: string;
          condition?: 'new' | 'like_new' | 'good' | 'fair';
          seller_id?: string;
          seller_name?: string;
          seller_phone?: string;
          seller_whatsapp?: string | null;
          images?: string[];
          location?: string;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {};
  };
}