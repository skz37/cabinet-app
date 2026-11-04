import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useSettingsStore, type ThemePreference } from '@/shared/store/useSettingsStore';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

// Theme preview until F03 (navigation) and F06 (component gallery) replace it.

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Système' },
];

const SWATCHES = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'primary-soft', className: 'bg-primary-soft' },
  { name: 'mint', className: 'bg-mint' },
  { name: 'background', className: 'bg-background' },
  { name: 'card', className: 'bg-card' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'success-soft', className: 'bg-success-soft' },
  { name: 'warning-soft', className: 'bg-warning-soft' },
  { name: 'danger-soft', className: 'bg-danger-soft' },
  { name: 'info-soft', className: 'bg-info-soft' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'banner', className: 'bg-banner' },
];

export default function Screen() {
  const themePreference = useSettingsStore((s) => s.themePreference);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);

  return (
    <>
      <Stack.Screen options={{ title: 'MediFlow · thème' }} />
      <ScrollView contentContainerClassName="gap-6 p-5">
        <View className="bg-muted flex-row rounded-[14px] p-1">
          {THEMES.map((t) => {
            const selected = themePreference === t.value;
            return (
              <Button
                key={t.value}
                variant="ghost"
                size="sm"
                className={cn('flex-1 rounded-[10px]', selected && 'bg-card shadow-e1')}
                accessibilityState={{ selected }}
                onPress={() => setThemePreference(t.value)}>
                <Text className={cn('text-foreground', !selected && 'text-muted-foreground')}>
                  {t.label}
                </Text>
              </Button>
            );
          })}
        </View>

        <View className="gap-2">
          <Text variant="display">Bonjour, Sara</Text>
          <Text variant="h1">Mes rendez-vous</Text>
          <Text variant="h2">Dernières nouvelles</Text>
          <Text variant="h3">Dr Alami Youssef</Text>
          <Text>Votre rapport est disponible.</Text>
          <Text variant="caption">lun. 2 nov. 2026 · 09:30</Text>
          <Text variant="chip" className="text-primary-soft-foreground">
            GÉNÉRALISTE
          </Text>
        </View>

        <View className="gap-3">
          <Button>
            <Text>Prendre rendez-vous</Text>
          </Button>
          <Button variant="outline">
            <Text>Secondaire</Text>
          </Button>
          <Button variant="ghost">
            <Text>Bouton texte</Text>
          </Button>
          <Button variant="destructive">
            <Text>Annuler le RDV</Text>
          </Button>
          <Button disabled>
            <Text>Désactivé</Text>
          </Button>
        </View>

        <View className="bg-card border-border shadow-e1 rounded-card gap-1 border p-4">
          <Text variant="h3">Carte · e1</Text>
          <Text variant="caption">rounded-card, border-border, shadow-e1</Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {SWATCHES.map((s) => (
            <View key={s.name} className="w-[30%] gap-1">
              <View className={cn('border-border h-12 rounded-md border', s.className)} />
              <Text variant="caption">{s.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
