export interface Message {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'reminder' | 'event' | 'update';
  priority: 'high' | 'normal' | 'low';
  sender: {
    name: string;
    role: string;
  };
  timestamp: string;
  read: boolean;
  project_id?: number | null;
  project?: {
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
    image?: string;
  } | null;
  news_article_id?: number | null;
  news_article?: {
    id: number;
    title: string;
    title_arabic: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    date: string;
    read_time: string;
    image?: string;
  } | null;
}
