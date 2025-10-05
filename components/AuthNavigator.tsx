import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export function AuthNavigator() {
  const { isAuthenticated, isLoading, isManuallyAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isMounted, setIsMounted] = useState(false);
  const [navigationStable, setNavigationStable] = useState(false);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    setIsMounted(true);
    // Add small delay to prevent rapid navigation changes
    const timer = setTimeout(() => setNavigationStable(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !rootNavigationState?.key || !navigationStable) return;

    console.log('AuthNavigator effect:', { isLoading, isAuthenticated, isManuallyAuthenticated, segments: segments.join('/') });

    const inAuthGroup = segments[0] === 'auth';
    const currentPath = segments.join('/');
    const inProtectedArea = segments[0] === '(tabs)' || segments[0] === 'donation-tracker' || segments[0] === 'projects' || segments[0] === 'news' || segments[0] === 'admin';

    // Skip navigation if loading to reduce redundant redirects
    if (isLoading) {
      console.log('Still loading, skipping further navigation');
      return;
    }

    // IMMEDIATE PROTECTION: Block access to protected areas if not manually authenticated
    if (!isManuallyAuthenticated && inProtectedArea) {
      console.log('ACCESS DENIED: Blocking access to protected area - no manual auth flag, redirecting to register');
      router.replace('/auth/register');
      return;
    }

    // ROBUST PROTECTION: Use manual auth flag to completely block unauthorized access
    if (!isManuallyAuthenticated) {
      // Always redirect if not on auth screens (including empty/root paths)
      if (currentPath !== 'auth/register' && currentPath !== 'auth/signin') {
        console.log('MANUAL AUTH PROTECTION: Redirecting to register screen - no manual auth flag, current path:', currentPath);
        router.replace('/auth/register');
        return;
      }
    }

    // Only redirect authenticated users once they're fully loaded
    if (isManuallyAuthenticated && inAuthGroup) {
      // User is manually authenticated and in auth screens, redirect to home
      console.log('Redirecting manually authenticated user to home from auth');
      router.replace('/(tabs)');
    } else if (isManuallyAuthenticated && !inProtectedArea) {
      // User is manually authenticated and not in main app areas, redirect to home
      console.log('Redirecting manually authenticated user to home from other areas:', currentPath);
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isManuallyAuthenticated, segments, isLoading, router, isMounted, rootNavigationState?.key, navigationStable]);

  if (!rootNavigationState?.key || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="donation-tracker" options={{ headerShown: false }} />
      <Stack.Screen name="projects/index" options={{ headerShown: false }} />
      <Stack.Screen name="projects/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="news/index" options={{ headerShown: false }} />
      <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="admin/projects" options={{ headerShown: false }} />
      <Stack.Screen name="admin/news" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}
