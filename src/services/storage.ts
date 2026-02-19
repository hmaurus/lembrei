/**
 * Persistência da configuração do alarme via AsyncStorage.
 * Inclui validação de dados corrompidos ao carregar.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlarmConfig, AlertType } from '../types/alarm';
import { STORAGE_KEY, DEFAULT_CONFIG, HOUR_OPTIONS, MINUTE_OPTIONS } from '../constants/alarm';

const VALID_ALERT_TYPES: AlertType[] = ['padrão', 'silencioso', 'vibração', 'som'];

/**
 * Salva a configuração do alarme no AsyncStorage.
 * @param config - Configuração a ser persistida
 */
export async function saveAlarmConfig(config: AlarmConfig): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/**
 * Carrega a configuração do alarme do AsyncStorage com validação.
 * Retorna DEFAULT_CONFIG se não houver dados ou se forem inválidos.
 * @returns Configuração validada do alarme
 */
export async function loadAlarmConfig(): Promise<AlarmConfig> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_CONFIG;

  try {
    const parsed = JSON.parse(raw) as AlarmConfig;

    // Valida campos críticos contra dados corrompidos
    const validHours = HOUR_OPTIONS.includes(parsed.hours as (typeof HOUR_OPTIONS)[number]);
    const validMinutes = MINUTE_OPTIONS.includes(parsed.minutes as (typeof MINUTE_OPTIONS)[number]);
    const validAlertType = VALID_ALERT_TYPES.includes(parsed.alertType);

    if (!validHours || !validMinutes || !validAlertType) {
      return DEFAULT_CONFIG;
    }

    return parsed;
  } catch {
    return DEFAULT_CONFIG;
  }
}
