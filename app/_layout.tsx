import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { AuthNavigator } from '@/components/AuthNavigator';
import { AuthProvider } from '@/contexts/AuthContext';



export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
