import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState, useEffect } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarketplaceCategory } from '@/types/marketplace';
import * as ImagePicker from 'expo-image-picker';
import { uploadMultipleImages } from '@/lib/imageUpload';

export default function AddMarketplaceItemScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [titleArabic, setTitleArabic] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState<'new' | 'like_new' | 'good' | 'fair'>('new');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const conditions = [
    { id: 'new', label: 'New', color: '#10B981' },
    { id: 'like_new', label: 'Like New', color: '#3B82F6' },
    { id: 'good', label: 'Good', color: '#F59E0B' },
    { id: 'fair', label: 'Fair', color: '#EF4444' },
  ];

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .order('name');

      if (!error && data) {
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0].id);
        }
      }
    }

    fetchCategories();
  }, []);

  // Image picker functions
  const pickImage = async () => {
    if (images.length >= 6) {
      Alert.alert('Maximum reached', 'You can only add up to 6 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert('Error', 'You must be logged in to add items');
        setLoading(false);
        return;
      }

      // Get user profile data for seller info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        Alert.alert('Error', 'Could not fetch your profile information');
        setLoading(false);
        return;
      }

      const sellerName = `${profile.first_name} ${profile.last_name}`;
      const sellerPhone = profile.phone || '';

      // Upload images to Supabase storage
      setUploadingImages(true);
      console.log('Uploading images to Supabase...');

      const uploadedUrls = await uploadMultipleImages(images, user.id);

      setUploadingImages(false);

      if (uploadedUrls.length === 0) {
        Alert.alert('Error', 'Failed to upload images. Please try again.');
        setLoading(false);
        return;
      }

      if (uploadedUrls.length < images.length) {
        console.warn(`Some images failed to upload. ${uploadedUrls.length}/${images.length} succeeded`);
      }

      // Insert marketplace item
      const { error: insertError } = await supabase
        .from('marketplace_items')
        .insert({
          title: title.trim(),
          title_arabic: titleArabic.trim() || title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category,
          condition,
          seller_id: user.id,
          seller_name: sellerName,
          seller_phone: sellerPhone,
          seller_whatsapp: whatsapp.trim() || sellerPhone,
          images: uploadedUrls, // Array of uploaded image URLs
          location: location.trim(),
          featured: false,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        Alert.alert('Error', 'Failed to add item. Please try again.');
        setLoading(false);
        return;
      }

      Alert.alert(
        'Success',
        'Your item has been added to the marketplace!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.backText, { color: Colors[colorScheme ?? 'light'].tint }]}>Cancel</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Add Item
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            إضافة منتج
          </Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="Enter item title"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Title Arabic (Optional) */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Title (Arabic)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="عنوان المنتج (اختياري)"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={titleArabic}
            onChangeText={setTitleArabic}
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="Describe your item in detail"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Price */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Price (USD) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="0.00"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Category */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryOption,
                  {
                    backgroundColor: category === cat.id
                      ? cat.color + '20'
                      : colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                    borderColor: category === cat.id ? cat.color : 'transparent',
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryOptionText,
                    {
                      color: category === cat.id
                        ? cat.color
                        : Colors[colorScheme ?? 'light'].text,
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Condition */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Condition <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.conditionList}>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond.id}
                style={[
                  styles.conditionOption,
                  {
                    backgroundColor: condition === cond.id
                      ? cond.color + '20'
                      : colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                    borderColor: condition === cond.id ? cond.color : 'transparent',
                  },
                ]}
                onPress={() => setCondition(cond.id as any)}
              >
                <Text
                  style={[
                    styles.conditionOptionText,
                    {
                      color: condition === cond.id
                        ? cond.color
                        : Colors[colorScheme ?? 'light'].text,
                    },
                  ]}
                >
                  {cond.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Images */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Images <Text style={styles.required}>*</Text>
            <Text style={[styles.helperText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {' '}(Up to 6 images)
            </Text>
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <IconSymbol name="xmark.circle.fill" size={24} color="#EF4444" />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>Primary</Text>
                  </View>
                )}
              </View>
            ))}

            {images.length < 6 && (
              <TouchableOpacity
                style={[
                  styles.addImageButton,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}
                onPress={pickImage}
              >
                <IconSymbol name="plus.circle.fill" size={40} color={Colors[colorScheme ?? 'light'].tint} />
                <Text style={[styles.addImageText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  Add Image
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            Location <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="City, Country"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* WhatsApp (Optional) */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
            WhatsApp Number (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5',
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder="+1234567890"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
          />
          <Text style={[styles.helperText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            If left empty, your profile phone number will be used
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].tint,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" />
              {uploadingImages && (
                <Text style={styles.uploadingText}>Uploading images...</Text>
              )}
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Add to Marketplace</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  categoryList: {
    gap: 12,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  categoryOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  conditionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  conditionOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  imagesContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  primaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  addImageButton: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addImageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
