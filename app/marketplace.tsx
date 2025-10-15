import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MarketplaceItem, MarketplaceCategory } from '@/types/marketplace';

export default function MarketplaceScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  // Categories
  const categories: MarketplaceCategory[] = [
    { id: 'all', name: 'All Items', name_arabic: 'الكل', icon: '📦', color: '#059669' },
    { id: 'books', name: 'Books', name_arabic: 'كتب', icon: '📚', color: '#3B82F6' },
    { id: 'clothing', name: 'Clothing', name_arabic: 'ملابس', icon: '👔', color: '#8B5CF6' },
    { id: 'prayer_items', name: 'Prayer Items', name_arabic: 'أدوات الصلاة', icon: '🕌', color: '#10B981' },
    { id: 'accessories', name: 'Accessories', name_arabic: 'إكسسوارات', icon: '📿', color: '#F59E0B' },
    { id: 'home_decor', name: 'Home Decor', name_arabic: 'ديكور', icon: '🏡', color: '#EF4444' },
  ];

  // Static marketplace items
  const marketplaceItems: MarketplaceItem[] = [
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
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1584286595398-a59f876a3e21?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=600&fit=crop',
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

  const handleCall = (phone: string, sellerName: string) => {
    Alert.alert(
      `Call ${sellerName}`,
      `Would you like to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phone}`)
        },
      ]
    );
  };

  const handleWhatsApp = (phone: string, itemTitle: string) => {
    const message = `Hi, I'm interested in your listing: ${itemTitle}`;
    const url = Platform.OS === 'ios'
      ? `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`
      : `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to contact the seller.');
      }
    });
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

  if (selectedItem) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedItem(null)}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          {/* Item Image */}
          <View style={styles.detailImageContainer}>
            <Image
              source={{ uri: selectedItem.image }}
              style={styles.detailImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.6)', 'transparent']}
              style={styles.detailImageOverlay}
            />
            {selectedItem.featured && (
              <View style={styles.featuredBadgeDetail}>
                <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
              </View>
            )}
          </View>

          {/* Item Details */}
          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <View style={styles.detailTitleContainer}>
                <Text style={[styles.detailTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {selectedItem.title}
                </Text>
                <Text style={[styles.detailTitleArabic, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  {selectedItem.title_arabic}
                </Text>
              </View>
              <Text style={styles.detailPrice}>{formatCurrency(selectedItem.price)}</Text>
            </View>

            <View style={styles.detailMeta}>
              <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(selectedItem.condition) + '20', borderColor: getConditionColor(selectedItem.condition) }]}>
                <Text style={[styles.conditionText, { color: getConditionColor(selectedItem.condition) }]}>
                  {getConditionLabel(selectedItem.condition)}
                </Text>
              </View>
              <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                📍 {selectedItem.location}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '20' }]} />

            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Description
              </Text>
              <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.8 }]}>
                {selectedItem.description}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '20' }]} />

            <View style={styles.sellerSection}>
              <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Seller Information
              </Text>
              <View style={[styles.sellerCard, { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' }]}>
                <View style={styles.sellerAvatar}>
                  <IconSymbol name="person.fill" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={[styles.sellerName, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {selectedItem.seller_name}
                  </Text>
                  <Text style={[styles.sellerPhone, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    📞 {selectedItem.seller_phone}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Buttons */}
            <View style={styles.contactButtons}>
              <TouchableOpacity
                style={[styles.callButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => handleCall(selectedItem.seller_phone, selectedItem.seller_name)}
              >
                <IconSymbol name="phone.fill" size={20} color="#FFFFFF" />
                <Text style={styles.callButtonText}>Call Seller</Text>
              </TouchableOpacity>

              {selectedItem.seller_whatsapp && (
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() => handleWhatsApp(selectedItem.seller_whatsapp!, selectedItem.title)}
                >
                  <Text style={styles.whatsappIcon}>💬</Text>
                  <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
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
        <View style={{ width: 80 }} />
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
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF' },
              ]}
              onPress={() => setSelectedItem(item)}
              activeOpacity={0.7}
            >
              <View style={styles.itemImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                {item.featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>⭐</Text>
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

        {filteredItems.length === 0 && (
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
  // Detail View Styles
  detailContainer: {
    flex: 1,
  },
  detailImageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  featuredBadgeDetail: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FCD34D',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featuredBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  detailContent: {
    padding: 20,
  },
  detailHeader: {
    marginBottom: 16,
  },
  detailTitleContainer: {
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 32,
  },
  detailTitleArabic: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailPrice: {
    fontSize: 32,
    fontWeight: '900',
    color: '#059669',
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  location: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  sellerSection: {
    marginBottom: 24,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sellerPhone: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#25D366',
    gap: 8,
  },
  whatsappIcon: {
    fontSize: 20,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
