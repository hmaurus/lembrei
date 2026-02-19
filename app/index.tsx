/**
 * Tela principal do Lembrei! — configuração e ativação do alarme recorrente.
 * Tema "Amber Glow": fundo escuro com acentos em âmbar.
 */
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAlarmConfig } from '../src/hooks/useAlarmConfig';
import { useCountdown } from '../src/hooks/useCountdown';
import { calculateIntervalSeconds } from '../src/constants/alarm';
import { sendTestNotification, requestPermissions } from '../src/services/notifications';
import { colors, spacing, radii } from '../src/constants/theme';
import { HourPicker } from '../src/components/HourPicker';
import { MinutePicker } from '../src/components/MinutePicker';
import { AlertTypeSelector } from '../src/components/AlertTypeSelector';
import { ActiveAlarmInfo } from '../src/components/ActiveAlarmInfo';

/**
 * Formata o intervalo selecionado para exibição no subtítulo.
 * @param hours - Horas selecionadas
 * @param minutes - Minutos selecionados
 * @returns String como "A cada 1h 30min"
 */
function formatInterval(hours: number, minutes: number): string {
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  return `A cada ${parts.join(' ')}`;
}

export default function HomeScreen() {
  const { config, isLoading, setHours, setMinutes, setAlertType, toggleAlarm } =
    useAlarmConfig();

  const intervalSeconds = calculateIntervalSeconds(config.hours, config.minutes);
  const { nextAlarmDate, remainingSeconds } = useCountdown(
    config.startTimestamp,
    intervalSeconds,
    config.isActive,
  );

  const handleToggle = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleAlarm();
  };

  const handleTestAlert = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert('Permissão negada', 'Habilite as notificações nas configurações do dispositivo.');
      return;
    }
    const sent = await sendTestNotification(config.alertType);
    if (!sent) {
      Alert.alert('Indisponível', 'Notificações não funcionam no Expo Go ou na web. Use um dev build para testar.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const subtitle = formatInterval(config.hours, config.minutes);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Lembrei!</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.pickers}>
          <HourPicker
            selected={config.hours}
            onSelect={setHours}
            disabled={config.isActive}
          />
          <MinutePicker
            selected={config.minutes}
            onSelect={setMinutes}
            disabled={config.isActive}
          />
          <AlertTypeSelector
            selected={config.alertType}
            onSelect={setAlertType}
            disabled={config.isActive}
          />

          <Pressable
            style={[
              styles.testButton,
              config.isActive && styles.testButtonDisabled,
            ]}
            onPress={handleTestAlert}
            disabled={config.isActive}
          >
            <Text
              style={[
                styles.testButtonText,
                config.isActive && styles.testButtonTextDisabled,
              ]}
            >
              Testar alerta
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.bottomSection,
            config.isActive && styles.bottomSectionActive,
          ]}
        >
          {config.isActive && nextAlarmDate && config.startTimestamp ? (
            <ActiveAlarmInfo
              startTimestamp={config.startTimestamp}
              nextAlarmDate={nextAlarmDate}
              remainingSeconds={remainingSeconds}
            />
          ) : (
            <View style={styles.statusRow}>
              <View style={styles.statusDotInactive} />
              <Text style={styles.statusTextInactive}>Alarme desativado</Text>
            </View>
          )}

          <Pressable
            style={[
              styles.toggleButton,
              config.isActive ? styles.toggleButtonActive : styles.toggleButtonInactive,
            ]}
            onPress={handleToggle}
          >
            <Text
              style={[
                styles.toggleButtonText,
                !config.isActive && styles.toggleButtonTextInactive,
              ]}
            >
              {config.isActive ? 'Desativar' : 'Ativar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.accent,
  },
  pickers: {
    gap: spacing.lg,
  },
  testButton: {
    height: 44,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  testButtonDisabled: {
    opacity: 0.4,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  testButtonTextDisabled: {
    color: colors.disabledText,
  },
  bottomSection: {
    marginTop: 'auto',
    gap: spacing.md,
  },
  bottomSectionActive: {
    backgroundColor: colors.accentMuted,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.accentBorder,
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusDotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textTertiary,
  },
  statusTextInactive: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  toggleButton: {
    height: 56,
    borderRadius: radii.button,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonInactive: {
    backgroundColor: colors.accent,
  },
  toggleButtonActive: {
    backgroundColor: colors.destructive,
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleButtonTextInactive: {
    color: colors.background,
  },
});
