import { AlarmConfig } from '../types/alarm';

export const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/** Horas exibidas por padrão no picker colapsado (1–3h cobre 90%+ dos casos). */
export const DEFAULT_VISIBLE_HOURS = [1, 2, 3] as const;

export const MINUTE_OPTIONS = [0, 30] as const;

export const STORAGE_KEY = '@lembre/alarm-config';

export const DEFAULT_CONFIG: AlarmConfig = {
  hours: 1,
  minutes: 0,
  alertType: 'padrão',
  isActive: false,
};

/**
 * Calcula o intervalo total em segundos com safeguard contra zero.
 * @param hours - Horas selecionadas
 * @param minutes - Minutos selecionados
 * @returns Intervalo em segundos, mínimo de 3600 (1h)
 */
export function calculateIntervalSeconds(hours: number, minutes: number): number {
  const total = hours * 3600 + minutes * 60;
  return Math.max(3600, total);
}
