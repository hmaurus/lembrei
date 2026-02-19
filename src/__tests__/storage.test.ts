/**
 * Testes para persistência do alarme via AsyncStorage.
 * Valida que dados corrompidos são tratados corretamente.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveAlarmConfig, loadAlarmConfig } from '../services/storage';
import { DEFAULT_CONFIG, STORAGE_KEY } from '../constants/alarm';
import { AlarmConfig } from '../types/alarm';

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('saveAlarmConfig', () => {
  it('salva config serializada no AsyncStorage', async () => {
    const config: AlarmConfig = {
      hours: 2,
      minutes: 30,
      alertType: 'som',
      isActive: true,
      notificationId: 'abc',
      startTimestamp: 1000,
    };

    await saveAlarmConfig(config);

    expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(config));
  });
});

describe('loadAlarmConfig', () => {
  it('retorna DEFAULT_CONFIG quando não há dados salvos', async () => {
    mockGetItem.mockResolvedValue(null);

    const result = await loadAlarmConfig();

    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('carrega config válida do storage', async () => {
    const saved: AlarmConfig = {
      hours: 3,
      minutes: 30,
      alertType: 'som',
      isActive: false,
    };
    mockGetItem.mockResolvedValue(JSON.stringify(saved));

    const result = await loadAlarmConfig();

    expect(result).toEqual(saved);
  });

  it('retorna DEFAULT_CONFIG para JSON inválido', async () => {
    mockGetItem.mockResolvedValue('not-json{{{');

    const result = await loadAlarmConfig();

    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('retorna DEFAULT_CONFIG para hours fora do range (0)', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ hours: 0, minutes: 30, alertType: 'som', isActive: false }),
    );

    const result = await loadAlarmConfig();

    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('retorna DEFAULT_CONFIG para hours fora do range (13)', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ hours: 13, minutes: 0, alertType: 'som', isActive: false }),
    );

    const result = await loadAlarmConfig();

    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('retorna DEFAULT_CONFIG para minutes inválidos (10)', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ hours: 1, minutes: 10, alertType: 'som', isActive: false }),
    );

    const result = await loadAlarmConfig();

    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('retorna DEFAULT_CONFIG para alertType inválido', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ hours: 1, minutes: 0, alertType: 'barulho', isActive: false }),
    );

    const result = await loadAlarmConfig();

    expect(result).toEqual(DEFAULT_CONFIG);
  });

  it('carrega config com alertType padrão', async () => {
    const saved: AlarmConfig = {
      hours: 2,
      minutes: 0,
      alertType: 'padrão',
      isActive: false,
    };
    mockGetItem.mockResolvedValue(JSON.stringify(saved));

    const result = await loadAlarmConfig();

    expect(result).toEqual(saved);
  });

  it('retorna DEFAULT_CONFIG para minutes=15 (não mais válido)', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ hours: 1, minutes: 15, alertType: 'vibração', isActive: false }),
    );

    expect(await loadAlarmConfig()).toEqual(DEFAULT_CONFIG);
  });

  it('retorna DEFAULT_CONFIG para minutes=45 (não mais válido)', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ hours: 2, minutes: 45, alertType: 'silencioso', isActive: false }),
    );

    expect(await loadAlarmConfig()).toEqual(DEFAULT_CONFIG);
  });
});
