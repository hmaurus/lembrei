/**
 * Tokens de design centralizados para o tema "Amber Glow".
 * Todos os componentes devem importar cores, tipografia e espaçamento daqui.
 */

export const colors = {
  background: '#111111',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  accent: '#FF9F0A',
  accentMuted: 'rgba(255, 159, 10, 0.15)',
  accentBorder: 'rgba(255, 159, 10, 0.5)',
  textPrimary: '#F5F5F7',
  textSecondary: '#A1A1A6',
  textTertiary: '#636366',
  destructive: '#FF453A',
  active: '#30D158',
  disabledText: '#48484A',
  /** Texto sobre fundo accent — preto puro para contraste AA (4.1:1). */
  textOnAccent: '#000000',
} as const;

export const fonts = {
  mono: 'SpaceMono_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  chip: 12,
  card: 20,
  button: 16,
} as const;
