/**
 * Painel informativo exibido quando o alarme está ativo.
 * Mostra indicador pulsante, hora de início, próximo alarme e countdown.
 */
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

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
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Animated.View style={[styles.statusDot, { opacity: pulseAnim }]} />
        <Text style={styles.statusText}>Alarme ativo</Text>
      </View>

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
    alignItems: 'center',
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#34C759',
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
