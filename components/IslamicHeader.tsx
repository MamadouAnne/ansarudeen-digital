import React, { memo } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface IslamicHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

const IslamicHeader = memo(({ title, subtitle, description }: IslamicHeaderProps) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 44 }]}
      >
        {/* Decorative Islamic pattern */}
        <View style={styles.patternContainer}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 256,
  },
  gradient: {
    paddingHorizontal: 24,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  patternContainer: {
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
    borderColor: 'white',
    borderRadius: 9999,
  },
  circle1: {
    top: 16,
    right: 16,
    width: 112,
    height: 112,
  },
  circle2: {
    top: 48,
    right: 48,
    width: 80,
    height: 80,
  },
  circle3: {
    bottom: 16,
    left: 16,
    width: 96,
    height: 96,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#a7f3d0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

IslamicHeader.displayName = 'IslamicHeader';

export default IslamicHeader;
