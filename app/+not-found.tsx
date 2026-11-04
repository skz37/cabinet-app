import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <Text>Cette page n&apos;existe pas.</Text>
        <Link href="/">
          <Text className="text-primary font-semibold">Retour à l&apos;accueil</Text>
        </Link>
      </View>
    </>
  );
}
