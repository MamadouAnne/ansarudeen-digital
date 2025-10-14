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
}
