import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MEDINA_BAYE_PROJECT, PROJECT_GOVERNANCE, PROJECT_STATS } from '@/constants/projectData';

export default function MedinaBayeProjectScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'benefits' | 'strategy'>('overview');
  const project = MEDINA_BAYE_PROJECT;

  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) - 16 : 36;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['#065f46', '#047857', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { paddingTop }]}
          >
            {/* Decorative Islamic pattern */}
            <View style={styles.decorativePattern}>
              <View style={[styles.circle, { top: 16, right: 16, width: 112, height: 112 }]} />
              <View style={[styles.circle, { top: 48, right: 48, width: 80, height: 80 }]} />
              <View style={[styles.circle, { bottom: 16, left: 16, width: 96, height: 96 }]} />
            </View>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Title Section */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{project.title}</Text>
              <Text style={styles.heroSubtitle}>{project.subtitle}</Text>

              {/* Quick Info */}
              <View style={styles.quickInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="location" size={20} color="#10B981" />
                  <Text style={styles.infoText}>{project.location}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="resize" size={20} color="#10B981" />
                  <Text style={styles.infoText}>{project.area}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="navigate" size={20} color="#10B981" />
                  <Text style={styles.infoText}>{project.distance}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContent}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Vue d'ensemble
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'components' && styles.activeTab]}
            onPress={() => setActiveTab('components')}
          >
            <Text style={[styles.tabText, activeTab === 'components' && styles.activeTabText]}>
              Composantes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'benefits' && styles.activeTab]}
            onPress={() => setActiveTab('benefits')}
          >
            <Text style={[styles.tabText, activeTab === 'benefits' && styles.activeTabText]}>
              Retombées
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'strategy' && styles.activeTab]}
            onPress={() => setActiveTab('strategy')}
          >
            <Text style={[styles.tabText, activeTab === 'strategy' && styles.activeTabText]}>
              Stratégie
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.content}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Main Objective */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="flag" size={24} color="#10B981" />
                  <Text style={styles.sectionTitle}>Objectif Principal</Text>
                </View>
                <View style={styles.objectiveCard}>
                  <Text style={styles.objectiveText}>{project.mainObjective}</Text>
                </View>
              </View>

              {/* Context */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="book" size={24} color="#10B981" />
                  <Text style={styles.sectionTitle}>Contexte</Text>
                </View>
                <Text style={styles.bodyText}>{project.context}</Text>
              </View>

              {/* Vision */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="eye" size={24} color="#10B981" />
                  <Text style={styles.sectionTitle}>Vision</Text>
                </View>
                <LinearGradient
                  colors={['#059669', '#047857']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.visionCard}
                >
                  <Text style={styles.visionText}>{project.vision}</Text>
                </LinearGradient>
              </View>

              {/* Objectives Grid */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text style={styles.sectionTitle}>Objectifs Spécifiques</Text>
                </View>
                <View style={styles.objectivesGrid}>
                  {project.objectives.map((obj, index) => (
                    <View key={obj.id} style={styles.objectiveItem}>
                      <View style={styles.objectiveNumber}>
                        <Text style={styles.objectiveNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.objectiveContent}>
                        <Text style={styles.objectiveTitle}>{obj.title}</Text>
                        <Text style={styles.objectiveDesc}>{obj.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Gallery */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="images" size={24} color="#10B981" />
                  <Text style={styles.sectionTitle}>Galerie</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                  {project.galleryImages.map((image, index) => (
                    <ImageBackground
                      key={index}
                      source={{ uri: image }}
                      style={styles.galleryImage}
                      imageStyle={styles.galleryImageStyle}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.galleryGradient}
                      />
                    </ImageBackground>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <View style={styles.section}>
              <Text style={styles.tabIntro}>
                Le projet comprend 3 composantes majeures qui travaillent ensemble pour créer un écosystème complet et durable.
              </Text>

              {project.components.map((component, index) => (
                <View key={component.id} style={styles.componentCard}>
                  <View style={styles.componentHeader}>
                    <View style={styles.componentIcon}>
                      <Text style={styles.componentNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.componentTitleContainer}>
                      <Text style={styles.componentTitle}>{component.title}</Text>
                      <Text style={styles.componentDesc}>{component.description}</Text>
                    </View>
                  </View>

                  <View style={styles.componentDetails}>
                    {component.details.map((detail, idx) => (
                      <View key={idx} style={styles.detailItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <Text style={styles.detailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <View style={styles.section}>
              <Text style={styles.tabIntro}>
                Les retombées attendues à travers la mise en œuvre du projet sont multiples et impactantes.
              </Text>

              <View style={styles.benefitsGrid}>
                {project.benefits.map((benefit) => (
                  <View key={benefit.id} style={styles.benefitCard}>
                    <View style={styles.benefitIcon}>
                      <Ionicons name={benefit.icon as any} size={28} color="#10B981" />
                    </View>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDesc}>{benefit.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Strategy Tab */}
          {activeTab === 'strategy' && (
            <>
              <View style={styles.section}>
                <Text style={styles.tabIntro}>
                  La stratégie de mise en œuvre du projet repose sur une gouvernance claire et des mécanismes de financement diversifiés.
                </Text>

                {/* Project Leadership */}
                <View style={styles.strategyCard}>
                  <View style={styles.strategyHeader}>
                    <Ionicons name="shield-checkmark" size={28} color="#10B981" />
                    <Text style={styles.strategyTitle}>{PROJECT_GOVERNANCE.portage.title}</Text>
                  </View>
                  <Text style={styles.strategyDesc}>{PROJECT_GOVERNANCE.portage.description}</Text>
                  <View style={styles.strategyNote}>
                    <Ionicons name="information-circle" size={20} color="#059669" />
                    <Text style={styles.strategyNoteText}>{PROJECT_GOVERNANCE.portage.rationale}</Text>
                  </View>
                </View>

                {/* Project Management */}
                <View style={styles.strategyCard}>
                  <View style={styles.strategyHeader}>
                    <Ionicons name="settings" size={28} color="#10B981" />
                    <Text style={styles.strategyTitle}>{PROJECT_GOVERNANCE.pilotage.title}</Text>
                  </View>
                  <Text style={styles.strategyDesc}>{PROJECT_GOVERNANCE.pilotage.structure}</Text>
                  <View style={styles.pillarsContainer}>
                    <View style={styles.pillarCard}>
                      <Text style={styles.pillarTitle}>SAFRU SA</Text>
                      <Text style={styles.pillarText}>{PROJECT_GOVERNANCE.pilotage.safru}</Text>
                    </View>
                    <View style={styles.pillarCard}>
                      <Text style={styles.pillarTitle}>Fondation Cheikh Ibrahim Niass</Text>
                      <Text style={styles.pillarText}>{PROJECT_GOVERNANCE.pilotage.fondation}</Text>
                    </View>
                  </View>
                </View>

                {/* Land Acquisition */}
                <View style={styles.strategyCard}>
                  <View style={styles.strategyHeader}>
                    <Ionicons name="location" size={28} color="#10B981" />
                    <Text style={styles.strategyTitle}>{PROJECT_GOVERNANCE.foncier.title}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoBoxLabel}>Approche</Text>
                    <Text style={styles.infoBoxValue}>{PROJECT_GOVERNANCE.foncier.approche}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoBoxLabel}>Justification</Text>
                    <Text style={styles.infoBoxValue}>{PROJECT_GOVERNANCE.foncier.justification}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoBoxLabel}>Facilitation</Text>
                    <Text style={styles.infoBoxValue}>{PROJECT_GOVERNANCE.foncier.facilitation}</Text>
                  </View>
                </View>

                {/* Financing */}
                <View style={styles.strategyCard}>
                  <View style={styles.strategyHeader}>
                    <Ionicons name="cash" size={28} color="#10B981" />
                    <Text style={styles.strategyTitle}>{PROJECT_GOVERNANCE.financement.title}</Text>
                  </View>
                  {PROJECT_GOVERNANCE.financement.sources.map((source, index) => (
                    <View key={index} style={styles.financingItem}>
                      <View style={styles.financingNumber}>
                        <Text style={styles.financingNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.financingContent}>
                        <Text style={styles.financingTitle}>{source.source}</Text>
                        <Text style={styles.financingDesc}>{source.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Project Stats */}
                <View style={styles.statsCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="stats-chart" size={24} color="#10B981" />
                    <Text style={styles.sectionTitle}>Chiffres Clés</Text>
                  </View>
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{PROJECT_STATS.superficie}</Text>
                      <Text style={styles.statLabel}>Superficie totale</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{PROJECT_STATS.talibésNigeria}</Text>
                      <Text style={styles.statLabel}>Talibés au Nigeria</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{PROJECT_STATS.gamouKano2022}</Text>
                      <Text style={styles.statLabel}>Gamou Kano 2022</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{PROJECT_STATS.distanceKaolackKano}</Text>
                      <Text style={styles.statLabel}>Kaolack-Kano</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{PROJECT_STATS.tempsVolKaolackKano}</Text>
                      <Text style={styles.statLabel}>Temps de vol</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{PROJECT_STATS.populationKano}</Text>
                      <Text style={styles.statLabel}>Population Kano</Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Author Info */}
          <View style={styles.authorSection}>
            <View style={styles.authorHeader}>
              <Ionicons name="person-circle" size={24} color="#059669" />
              <Text style={styles.authorHeaderText}>Concepteur du Projet</Text>
            </View>
            <View style={styles.authorCard}>
              <Text style={styles.authorName}>{project.author.name}</Text>
              <Text style={styles.authorTitle}>{project.author.title}</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="mail" size={18} color="#fff" />
                <Text style={styles.contactButtonText}>{project.author.contact}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA Section */}
          <LinearGradient
            colors={['#059669', '#047857', '#065f46']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaSection}
          >
            <View style={styles.ctaIcon}>
              <Ionicons name="rocket" size={32} color="#fff" />
            </View>
            <Text style={styles.ctaTitle}>Rejoignez le Projet</Text>
            <Text style={styles.ctaText}>
              Participez à la création de cette nouvelle cité qui contribuera au rayonnement de Médina Baye
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>En savoir plus</Text>
              <Ionicons name="arrow-forward" size={20} color="#059669" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  hero: {
    height: 420,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  decorativePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  circle: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 9999,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  quickInfo: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  tabContainer: {
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  tabContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    minWidth: 110,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  tabIntro: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  objectiveCard: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  objectiveText: {
    fontSize: 16,
    color: '#065F46',
    lineHeight: 26,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 26,
    fontWeight: '400',
  },
  visionCard: {
    padding: 24,
    borderRadius: 20,
  },
  visionText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 26,
    fontWeight: '500',
  },
  objectivesGrid: {
    gap: 16,
  },
  objectiveItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  objectiveNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  objectiveNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  objectiveContent: {
    flex: 1,
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  objectiveDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  gallery: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  galleryImage: {
    width: 280,
    height: 200,
    marginRight: 16,
    overflow: 'hidden',
  },
  galleryImageStyle: {
    borderRadius: 16,
  },
  galleryGradient: {
    flex: 1,
    borderRadius: 16,
  },
  componentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  componentHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  componentIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  componentTitleContainer: {
    flex: 1,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  componentDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  componentDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
  },
  benefitsGrid: {
    gap: 16,
  },
  benefitCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  benefitDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  authorSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  authorHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  authorCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  authorName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  authorTitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  ctaSection: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 15,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  ctaButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '800',
  },
  strategyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  strategyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  strategyDesc: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 16,
  },
  strategyNote: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  strategyNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#065F46',
    lineHeight: 22,
    fontWeight: '500',
  },
  pillarsContainer: {
    gap: 16,
  },
  pillarCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  pillarText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  infoBoxLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 6,
  },
  infoBoxValue: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  financingItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  financingNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  financingNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  financingContent: {
    flex: 1,
  },
  financingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  financingDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
