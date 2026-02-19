export type AlertType = 'padrão' | 'silencioso' | 'vibração' | 'som';

export interface AlarmConfig {
  hours: number;
  minutes: number;
  alertType: AlertType;
  isActive: boolean;
  notificationId?: string;
  startTimestamp?: number;
}
