/**
 * Painel informativo exibido quando o alarme está ativo.
 * Mostra indicador pulsante, hora de início, próximo alarme e countdown hero.
 */
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fonts } from '../constants/theme';

interface ActiveAlarmInfoProps {
  startTimestamp: number;
  nextAlarmDate: Date;
  remainingSeconds: number;
}

/**
 * Formata um Date para string HH:MM no fuso local (pt-BR).
 * @param date - Data a formatar
 * @returns String no formato "HH:MM"
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Converte total de segundos em string HH:MM:SS com zero-padding.
 * @param totalSeconds - Segundos restantes
 * @returns String no formato "HH:MM:SS"
 */
function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

/**
 * Exibe status do alarme ativo com countdown em destaque.
 * @param startTimestamp - Timestamp de quando o alarme foi ativado
 * @param nextAlarmDate - Data/hora do próximo disparo
 * @param remainingSeconds - Segundos restantes até o próximo disparo
 */
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
    backgroundColor: colors.active,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.active,
  },
  startedAt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nextAlarm: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  countdown: {
    fontSize: 52,
    fontWeight: '700',
    fontFamily: fonts.mono,
    color: colors.accent,
    fontVariant: ['tabular-nums'],
    marginTop: 8,
    textShadowColor: 'rgba(255, 159, 10, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
