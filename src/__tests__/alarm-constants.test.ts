/**
 * Testes para constantes e cálculos de intervalo do alarme.
 */
import {
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  DEFAULT_CONFIG,
  calculateIntervalSeconds,
} from '../constants/alarm';

describe('HOUR_OPTIONS', () => {
  it('contém 12 opções de 1 a 12', () => {
    expect(HOUR_OPTIONS).toHaveLength(12);
    expect(HOUR_OPTIONS[0]).toBe(1);
    expect(HOUR_OPTIONS[11]).toBe(12);
  });
});

describe('MINUTE_OPTIONS', () => {
  it('contém [0, 30]', () => {
    expect(Array.from(MINUTE_OPTIONS)).toEqual([0, 30]);
  });
});

describe('DEFAULT_CONFIG', () => {
  it('tem valores padrão corretos', () => {
    expect(DEFAULT_CONFIG).toEqual({
      hours: 1,
      minutes: 0,
      alertType: 'vibração',
      isActive: false,
    });
  });
});

describe('calculateIntervalSeconds', () => {
  it('calcula 1h 0min = 3600s', () => {
    expect(calculateIntervalSeconds(1, 0)).toBe(3600);
  });

  it('calcula 2h 30min = 9000s', () => {
    expect(calculateIntervalSeconds(2, 30)).toBe(9000);
  });

  it('calcula 1h 15min = 4500s', () => {
    expect(calculateIntervalSeconds(1, 15)).toBe(4500);
  });

  it('calcula 12h 45min = 45900s', () => {
    expect(calculateIntervalSeconds(12, 45)).toBe(45900);
  });

  it('retorna mínimo de 3600s (1h) para dados corrompidos (0, 0)', () => {
    expect(calculateIntervalSeconds(0, 0)).toBe(3600);
  });

  it('retorna mínimo de 3600s para intervalo muito curto (0, 15)', () => {
    // 0h 15min = 900s < 3600, safeguard aplica
    expect(calculateIntervalSeconds(0, 15)).toBe(3600);
  });
});
