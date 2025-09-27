import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  // This screen is just a loading placeholder.
  // The root layout and AuthNavigator handle all routing logic.
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
