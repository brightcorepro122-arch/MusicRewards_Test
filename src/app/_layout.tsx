// Ultra-minimal root layout to test casting error
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
  console.log('Ultra-minimal RootLayout rendering...');

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}