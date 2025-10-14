export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          title: string
          content: string
          category: 'announcement' | 'reminder' | 'event' | 'update'
          priority: 'high' | 'normal' | 'low'
          sender_id: string | null
          sender_name: string
          sender_role: string
          created_at: string
          updated_at: string
          published_at: string | null
          is_published: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: 'announcement' | 'reminder' | 'event' | 'update'
          priority?: 'high' | 'normal' | 'low'
          sender_id?: string | null
          sender_name: string
          sender_role?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          is_published?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: 'announcement' | 'reminder' | 'event' | 'update'
          priority?: 'high' | 'normal' | 'low'
          sender_id?: string | null
          sender_name?: string
          sender_role?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          is_published?: boolean
        }
      }
      message_reads: {
        Row: {
          id: string
          message_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          read_at?: string
        }
      }
    }
  }
}
