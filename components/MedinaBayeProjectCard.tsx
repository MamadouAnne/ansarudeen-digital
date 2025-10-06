import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MedinaBayeProjectCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Projet Phare</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/medina-baye-project')}
        activeOpacity={0.95}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1564769610726-4548e2683ef3?w=1200&auto=format&fit=crop' }}
          style={styles.imageBackground}
          imageStyle={styles.image}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          >
            {/* Badge */}
            <View style={styles.badge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.badgeText}>Projet Stratégique</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>MEDINA BAYE CITY</Text>
                <Text style={styles.subtitle}>
                  Projet de création d'une nouvelle cité d'appui à Médina Baye
                </Text>
              </View>

              {/* Info Cards */}
              <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                  <Ionicons name="location" size={16} color="#10B981" />
                  <Text style={styles.infoText}>Kaolack, Sénégal</Text>
                </View>
                <View style={styles.infoCard}>
                  <Ionicons name="resize" size={16} color="#10B981" />
                  <Text style={styles.infoText}>1000 hectares</Text>
                </View>
              </View>

              {/* Features */}
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.featureText}>Ville Intelligente</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.featureText}>Université Islamique</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.featureText}>Centre International</Text>
                </View>
              </View>

              {/* CTA Button */}
              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>Découvrir le projet complet</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  card: {
    height: 480,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: 24,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    gap: 16,
  },
  titleContainer: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#E5E7EB',
    lineHeight: 22,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  features: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
