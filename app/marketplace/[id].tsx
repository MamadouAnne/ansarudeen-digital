import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MarketplaceItem } from '@/types/marketplace';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// This would come from a database in production (DEPRECATED - now using Supabase)
const _getMarketplaceItemById_DEPRECATED = (id: string): MarketplaceItem | null => {
  const items: MarketplaceItem[] = [
    {
      id: 1,
      title: 'Quran with Tafsir - Deluxe Edition',
      title_arabic: 'القرآن الكريم مع التفسير',
      description: 'Beautiful hardcover Quran with detailed Tafsir in Arabic and English. Includes translation by Saheeh International. This deluxe edition features high-quality paper, clear typography, and a durable leather-bound cover. Perfect for daily reading and study.',
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
      description: 'Premium quality Turkish prayer mat with beautiful geometric patterns. Soft, durable, and easy to fold. Made from high-quality materials that are comfortable for long prayers. Features non-slip backing for safety.',
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
      description: 'Classic white cotton thobe, perfect for daily prayers and special occasions. Size: Large. Made from breathable 100% cotton fabric. Features traditional design with modern tailoring for comfort.',
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
      description: 'Handcrafted wooden tasbih with 99 beads. Perfect for dhikr and meditation. Each bead is carefully carved and polished. Includes a beautiful tassel and comes with a protective pouch.',
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
      description: 'Modern Islamic calligraphy wall art featuring Ayatul Kursi. Gold foil on black canvas. Size: 24x36 inches. Ready to hang with included hardware. Adds elegant Islamic touch to any room.',
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
      description: 'Complete 9-volume set of Sahih Bukhari in Arabic with English translation. Authentic Hadith collection compiled by Imam Bukhari. Includes detailed commentary and indexing. Excellent condition with minimal wear.',
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
      description: 'Elegant silk hijab in emerald green. Lightweight, breathable, and wrinkle-resistant. Perfect for all seasons. Measures 70x180cm. Made from 100% pure silk for luxurious feel and drape.',
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
      description: 'Automatic prayer time clock with azan alarm for all 5 daily prayers. Includes Qibla compass and automatic location-based prayer times. Features LED display, adjustable volume, and battery backup. Easy to program and use.',
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

  return items.find(item => item.id === parseInt(id)) || null;
};

export default function MarketplaceItemDetailScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch item from Supabase
  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching marketplace item:', error);
        setItem(null);
      } else {
        setItem(data);
      }
      setLoading(false);
    }

    if (id) {
      fetchItem();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Loading item...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🔍</Text>
          <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Item not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        {/* Item Images Carousel */}
        <View style={styles.detailImageContainer}>
          <Image
            source={{ uri: item.images && item.images.length > 0 ? item.images[selectedImageIndex] : 'https://via.placeholder.com/800x600?text=No+Image' }}
            style={styles.detailImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.6)', 'transparent']}
            style={styles.detailImageOverlay}
          />
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
            </View>
          )}

          {/* Image Counter */}
          {item.images && item.images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {item.images.length}
              </Text>
            </View>
          )}

          {/* Navigation Arrows */}
          {item.images && item.images.length > 1 && (
            <>
              {selectedImageIndex > 0 && (
                <TouchableOpacity
                  style={[styles.imageNavButton, styles.imageNavLeft]}
                  onPress={() => setSelectedImageIndex(selectedImageIndex - 1)}
                >
                  <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              {selectedImageIndex < item.images.length - 1 && (
                <TouchableOpacity
                  style={[styles.imageNavButton, styles.imageNavRight]}
                  onPress={() => setSelectedImageIndex(selectedImageIndex + 1)}
                >
                  <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Image Thumbnails */}
        {item.images && item.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {item.images.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  {
                    borderColor: selectedImageIndex === index
                      ? Colors[colorScheme ?? 'light'].tint
                      : 'transparent',
                  },
                ]}
              >
                <Image
                  source={{ uri }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Item Details */}
        <View style={styles.detailContent}>
          <View style={styles.detailHeader}>
            <View style={styles.detailTitleContainer}>
              <Text style={[styles.detailTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                {item.title}
              </Text>
              <Text style={[styles.detailTitleArabic, { color: Colors[colorScheme ?? 'light'].tint }]}>
                {item.title_arabic}
              </Text>
            </View>
            <Text style={styles.detailPrice}>{formatCurrency(item.price)}</Text>
          </View>

          <View style={styles.detailMeta}>
            <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) + '20', borderColor: getConditionColor(item.condition) }]}>
              <Text style={[styles.conditionText, { color: getConditionColor(item.condition) }]}>
                {getConditionLabel(item.condition)}
              </Text>
            </View>
            <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              📍 {item.location}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '20' }]} />

          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text, opacity: 0.8 }]}>
              {item.description}
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
                  {item.seller_name}
                </Text>
                <Text style={[styles.sellerPhone, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  📞 {item.seller_phone}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={[styles.callButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => handleCall(item.seller_phone, item.seller_name)}
            >
              <IconSymbol name="phone.fill" size={20} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call Seller</Text>
            </TouchableOpacity>

            {item.seller_whatsapp && (
              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={() => handleWhatsApp(item.seller_whatsapp!, item.title)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  featuredBadge: {
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
  imageCounter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNavLeft: {
    left: 16,
  },
  imageNavRight: {
    right: 16,
  },
  thumbnailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
