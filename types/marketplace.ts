export interface MarketplaceItem {
  id: number;
  title: string;
  title_arabic: string;
  description: string;
  price: number;
  category: 'books' | 'clothing' | 'accessories' | 'prayer_items' | 'home_decor' | 'other';
  condition: 'new' | 'like_new' | 'good' | 'fair';
  seller_name: string;
  seller_phone: string;
  seller_whatsapp?: string;
  image: string;
  location: string;
  created_at: string;
  featured?: boolean;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  name_arabic: string;
  icon: string;
  color: string;
}
