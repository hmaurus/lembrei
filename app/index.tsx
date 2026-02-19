import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAlarmConfig } from '../src/hooks/useAlarmConfig';
import { useCountdown } from '../src/hooks/useCountdown';
import { calculateIntervalSeconds } from '../src/constants/alarm';
import { HourPicker } from '../src/components/HourPicker';
import { MinutePicker } from '../src/components/MinutePicker';
import { AlertTypeSelector } from '../src/components/AlertTypeSelector';
import { ActiveAlarmInfo } from '../src/components/ActiveAlarmInfo';

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
            <Text style={styles.toggleButtonText}>
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
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    gap: 4,
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
  },
  pickers: {
    gap: 24,
  },
  bottomSection: {
    marginTop: 'auto',
    gap: 16,
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
    backgroundColor: '#C7C7CC',
  },
  statusTextInactive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C7C7CC',
  },
  bottomSectionActive: {
    backgroundColor: '#F0FAF0',
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#34C75940',
    padding: 20,
  },
  toggleButton: {
    height: 56,
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonInactive: {
    backgroundColor: '#007AFF',
  },
  toggleButtonActive: {
    backgroundColor: '#FF3B30',
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
