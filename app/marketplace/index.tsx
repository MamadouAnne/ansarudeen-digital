import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState, useEffect } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router, Stack } from 'expo-router';
import { MarketplaceItem, MarketplaceCategory } from '@/types/marketplace';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function MarketplaceScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<MarketplaceCategory[]>([
    { id: 'all', name: 'All Items', name_arabic: 'الكل', icon: '📦', color: '#059669' },
  ]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.profile?.role === 'admin';

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
      } else if (data) {
        setCategories([
          { id: 'all', name: 'All Items', name_arabic: 'الكل', icon: '📦', color: '#059669' },
          ...data,
        ]);
      }
    }

    fetchCategories();
  }, []);

  // Fetch marketplace items from Supabase
  useEffect(() => {
    async function fetchMarketplaceItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching marketplace items:', error);
      } else if (data) {
        setMarketplaceItems(data);
      }
      setLoading(false);
    }

    fetchMarketplaceItems();
  }, []);

  // Keep the old static items for reference (remove after testing)
  const _staticMarketplaceItems: MarketplaceItem[] = [
    {
      id: 1,
      title: 'Quran with Tafsir - Deluxe Edition',
      title_arabic: 'القرآن الكريم مع التفسير',
      description: 'Beautiful hardcover Quran with detailed Tafsir in Arabic and English. Includes translation by Saheeh International.',
      price: 45,
      category: 'books',
      condition: 'new',
      seller_name: 'Ibrahim Hassan',
      seller_phone: '+1234567890',
      seller_whatsapp: '+1234567890',
      images: ['https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop'],
      location: 'New York, NY',
      created_at: '2024-01-10T10:00:00Z',
      featured: true,
    },
    {
      id: 2,
      title: 'Islamic Prayer Rug - Turkish Design',
      title_arabic: 'سجادة صلاة إسلامية',
      description: 'Premium quality Turkish prayer mat with beautiful geometric patterns. Soft, durable, and easy to fold.',
      price: 35,
      category: 'prayer_items',
      condition: 'new',
      seller_name: 'Fatima Ahmed',
      seller_phone: '+1234567891',
      seller_whatsapp: '+1234567891',
      images: ['https://images.unsplash.com/photo-1584286595398-a59f876a3e21?w=800&h=600&fit=crop'],
      location: 'Chicago, IL',
      created_at: '2024-01-09T14:30:00Z',
      featured: true,
    },
    {
      id: 3,
      title: 'Men\'s Thobe - White Cotton',
      title_arabic: 'ثوب رجالي قطني',
      description: 'Classic white cotton thobe, perfect for daily prayers and special occasions. Size: Large.',
      price: 55,
      category: 'clothing',
      condition: 'like_new',
      seller_name: 'Mohammed Ali',
      seller_phone: '+1234567892',
      images: ['https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&h=600&fit=crop'],
      location: 'Houston, TX',
      created_at: '2024-01-08T09:15:00Z',
    },
    {
      id: 4,
      title: 'Tasbih Prayer Beads - 99 Beads',
      title_arabic: 'مسبحة ٩٩ حبة',
      description: 'Handcrafted wooden tasbih with 99 beads. Perfect for dhikr and meditation.',
      price: 15,
      category: 'accessories',
      condition: 'new',
      seller_name: 'Aisha Rahman',
      seller_phone: '+1234567893',
      seller_whatsapp: '+1234567893',
      images: ['https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=800&h=600&fit=crop'],
      location: 'Los Angeles, CA',
      created_at: '2024-01-07T16:45:00Z',
      featured: true,
    },
    {
      id: 5,
      title: 'Islamic Wall Art - Ayatul Kursi',
      title_arabic: 'لوحة آية الكرسي',
      description: 'Modern Islamic calligraphy wall art featuring Ayatul Kursi. Gold foil on black canvas.',
      price: 75,
      category: 'home_decor',
      condition: 'new',
      seller_name: 'Yusuf Omar',
      seller_phone: '+1234567894',
      images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop'],
      location: 'Miami, FL',
      created_at: '2024-01-06T11:20:00Z',
    },
    {
      id: 6,
      title: 'Sahih Bukhari - Complete Set',
      title_arabic: 'صحيح البخاري - طقم كامل',
      description: 'Complete 9-volume set of Sahih Bukhari in Arabic with English translation.',
      price: 120,
      category: 'books',
      condition: 'good',
      seller_name: 'Zayd Abdullah',
      seller_phone: '+1234567895',
      seller_whatsapp: '+1234567895',
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop'],
      location: 'Dallas, TX',
      created_at: '2024-01-05T13:00:00Z',
    },
    {
      id: 7,
      title: 'Women\'s Hijab - Premium Silk',
      title_arabic: 'حجاب حريري فاخر',
      description: 'Elegant silk hijab in emerald green. Lightweight, breathable, and wrinkle-resistant.',
      price: 25,
      category: 'clothing',
      condition: 'new',
      seller_name: 'Maryam Said',
      seller_phone: '+1234567896',
      images: ['https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop'],
      location: 'Boston, MA',
      created_at: '2024-01-04T10:30:00Z',
    },
    {
      id: 8,
      title: 'Digital Azan Clock',
      title_arabic: 'ساعة أذان رقمية',
      description: 'Automatic prayer time clock with azan alarm for all 5 daily prayers. Includes Qibla compass.',
      price: 40,
      category: 'prayer_items',
      condition: 'like_new',
      seller_name: 'Bilal Hussein',
      seller_phone: '+1234567897',
      seller_whatsapp: '+1234567897',
      images: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=600&fit=crop'],
      location: 'Seattle, WA',
      created_at: '2024-01-03T15:45:00Z',
    },
  ];

  const filteredItems = selectedCategory === 'all'
    ? marketplaceItems
    : marketplaceItems.filter(item => item.category === selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return '#10B981';
      case 'like_new': return '#3B82F6';
      case 'good': return '#F59E0B';
      case 'fair': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'new': return 'New';
      case 'like_new': return 'Like New';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      default: return condition;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Marketplace
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            سوق إسلامي
          </Text>
        </View>
        {isAdmin && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => router.push('/marketplace/add-item')}
          >
            <IconSymbol name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              {
                backgroundColor: selectedCategory === category.id
                  ? category.color + '20'
                  : colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                borderColor: selectedCategory === category.id
                  ? category.color
                  : 'transparent',
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryName,
                {
                  color: selectedCategory === category.id
                    ? category.color
                    : Colors[colorScheme ?? 'light'].text,
                  fontWeight: selectedCategory === category.id ? '700' : '600',
                },
              ]}
            >
              {category.name}
            </Text>
            <Text style={[styles.categoryArabic, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {category.name_arabic}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items Grid */}
      <ScrollView
        style={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.itemsContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              Loading marketplace...
            </Text>
          </View>
        ) : (
          <View style={styles.itemsGrid}>
            {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF' },
              ]}
              onPress={() => router.push(`/marketplace/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.itemImageContainer}>
                <Image
                  source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400x400?text=No+Image' }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                {item.featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>⭐</Text>
                  </View>
                )}
                {item.images && item.images.length > 1 && (
                  <View style={styles.imageCountBadge}>
                    <IconSymbol name="photo.stack" size={14} color="#FFFFFF" />
                    <Text style={styles.imageCountText}>{item.images.length}</Text>
                  </View>
                )}
                <View style={[styles.priceBadge, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                  <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
                </View>
              </View>

              <View style={styles.itemContent}>
                <Text
                  style={[styles.itemTitle, { color: Colors[colorScheme ?? 'light'].text }]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  style={[styles.itemTitleArabic, { color: Colors[colorScheme ?? 'light'].tint }]}
                  numberOfLines={1}
                >
                  {item.title_arabic}
                </Text>

                <View style={styles.itemMeta}>
                  <View style={[styles.conditionPill, { backgroundColor: getConditionColor(item.condition) + '20' }]}>
                    <Text style={[styles.conditionPillText, { color: getConditionColor(item.condition) }]}>
                      {getConditionLabel(item.condition)}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemFooter}>
                  <Text style={[styles.sellerText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]} numberOfLines={1}>
                    👤 {item.seller_name}
                  </Text>
                  <IconSymbol name="chevron.right" size={16} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          </View>
        )}

        {!loading && filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              No items found in this category
            </Text>
          </View>
        )}
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  categoriesContainer: {
    maxHeight: 110,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 13,
    marginBottom: 2,
  },
  categoryArabic: {
    fontSize: 10,
  },
  itemsContainer: {
    flex: 1,
  },
  itemsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FCD34D',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredText: {
    fontSize: 12,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 18,
  },
  itemTitleArabic: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  conditionPillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerText: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
