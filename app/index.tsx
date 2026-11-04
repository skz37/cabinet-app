import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { View } from 'react-native';

// Placeholder until F03 (navigation skeleton) and F07 (Splash) replace it.
export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ title: 'MediFlow' }} />
      <View className="flex-1 items-center justify-center gap-2 p-6">
        <Text variant="h3">MediFlow Patient</Text>
        <Text className="text-muted-foreground text-center">
          Projet initialisé. Les écrans arrivent avec F03 (navigation) et F07 (Splash).
        </Text>
      </View>
    </>
  );
}
