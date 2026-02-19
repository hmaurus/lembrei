import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AlertType } from '../types/alarm';
import { calculateIntervalSeconds } from '../constants/alarm';

// expo-notifications was removed from Expo Go in SDK 53 and is not available on web.
// Detect unsupported environments and skip loading entirely to avoid errors.
const isExpoGo = Constants.appOwnership === 'expo';
const isWeb = Platform.OS === 'web';

let Notifications: typeof import('expo-notifications') | null = null;
if (!isExpoGo && !isWeb) {
  Notifications = require('expo-notifications');
}

const CHANNEL_ID = 'lembrei-alarms';

export function setupNotificationHandler(): void {
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestPermissions(): Promise<boolean> {
  if (!Notifications) return true; // Allow toggle in Expo Go (no-op)
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function setupAndroidChannel(alertType: AlertType): Promise<void> {
  if (!Notifications || Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Alarmes Lembrei!',
    importance: Notifications.AndroidImportance.HIGH,
    sound: alertType === 'som' ? 'alarm.wav' : undefined,
    vibrationPattern: alertType === 'vibração' ? [0, 250, 250, 250] : undefined,
    enableVibrate: alertType === 'vibração',
  });
}

export async function scheduleRecurringNotification(
  hours: number,
  minutes: number,
  alertType: AlertType,
): Promise<string> {
  await cancelAllNotifications();

  if (!Notifications) return 'expo-go-stub';

  await setupAndroidChannel(alertType);

  const intervalSeconds = calculateIntervalSeconds(hours, minutes);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrei!',
      body: formatIntervalText(hours, minutes),
      sound: alertType === 'som' ? 'alarm.wav' : undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalSeconds,
      repeats: true,
      channelId: CHANNEL_ID,
    },
  });

  return id;
}

/**
 * Dispara uma notificação imediata para testar o tipo de alerta selecionado.
 * @param alertType - Tipo de alerta a ser testado ('silencioso' | 'vibração' | 'som')
 * @returns true se a notificação foi enviada, false se não disponível (Expo Go/web)
 */
export async function sendTestNotification(alertType: AlertType): Promise<boolean> {
  if (!Notifications) return false;

  await setupAndroidChannel(alertType);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrei! — Teste',
      body: `Teste do alerta: ${alertType}`,
      sound: alertType === 'som' ? 'alarm.wav' : undefined,
    },
    trigger: null,
  });

  return true;
}

export async function cancelAllNotifications(): Promise<void> {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function formatIntervalText(hours: number, minutes: number): string {
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  return `Já se passaram ${parts.join(' ')}!`;
}
