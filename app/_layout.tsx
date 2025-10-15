import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { AuthNavigator } from '@/components/AuthNavigator';
import { AuthProvider } from '@/contexts/AuthContext';
import { CarouselProvider } from '@/contexts/CarouselContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CarouselProvider>
          <AuthNavigator />
          <StatusBar style="auto" />
        </CarouselProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
