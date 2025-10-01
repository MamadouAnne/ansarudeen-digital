import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  const handlePress = (ev: any) => {
    if (process.env.EXPO_OS === 'ios') {
      // Add a soft haptic feedback when pressing down on the tabs.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Call the original onPress handler
    if (props.onPress) {
      props.onPress(ev);
    }
  };

  return (
    <PlatformPressable
      {...props}
      onPress={handlePress}
    />
  );
}
