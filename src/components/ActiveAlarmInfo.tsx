import { View, Text, StyleSheet } from 'react-native';

interface ActiveAlarmInfoProps {
  startTimestamp: number;
  nextAlarmDate: Date;
  remainingSeconds: number;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

export function ActiveAlarmInfo({
  startTimestamp,
  nextAlarmDate,
  remainingSeconds,
}: ActiveAlarmInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.startedAt}>
        Iniciado às {formatTime(new Date(startTimestamp))}
      </Text>
      <Text style={styles.nextAlarm}>
        Próximo alarme: {formatTime(nextAlarmDate)}
      </Text>
      <Text style={styles.countdown}>{formatCountdown(remainingSeconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    borderCurve: 'continuous',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
  startedAt: {
    fontSize: 14,
    color: '#666',
  },
  nextAlarm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  countdown: {
    fontSize: 40,
    fontWeight: '700',
    color: '#007AFF',
    fontVariant: ['tabular-nums'],
    marginTop: 4,
  },
});
