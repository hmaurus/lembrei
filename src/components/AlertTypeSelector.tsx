/**
 * Seletor de tipo de alerta (silencioso, vibração, som).
 * Chips escuros com destaque âmbar e emojis indicativos.
 */
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AlertType } from '../types/alarm';
import { colors, radii } from '../constants/theme';

interface AlertTypeSelectorProps {
  selected: AlertType;
  onSelect: (type: AlertType) => void;
  disabled: boolean;
}

const ALERT_OPTIONS: { type: AlertType; label: string; a11yLabel: string }[] = [
  { type: 'silencioso', label: '\u{1F507} Silencioso', a11yLabel: 'Silencioso' },
  { type: 'vibração', label: '\u{1F4F3} Vibração', a11yLabel: 'Vibração' },
  { type: 'som', label: '\u{1F50A} Som', a11yLabel: 'Som' },
];

/**
 * Renderiza três opções de tipo de alerta em layout horizontal.
 * @param selected - Tipo de alerta atualmente selecionado
 * @param onSelect - Callback ao selecionar um tipo
 * @param disabled - Desabilita interação quando alarme está ativo
 */
export function AlertTypeSelector({
  selected,
  onSelect,
  disabled,
}: AlertTypeSelectorProps) {
  const handleSelect = (type: AlertType) => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>TIPO DE ALERTA</Text>
      <View
        style={styles.options}
        accessibilityRole="radiogroup"
        accessibilityLabel="Tipo de alerta"
      >
        {ALERT_OPTIONS.map(({ type, label, a11yLabel }) => {
          const isSelected = type === selected;
          return (
            <Pressable
              key={type}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                disabled && styles.optionDisabled,
              ]}
              onPress={() => handleSelect(type)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityLabel={a11yLabel}
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                  disabled && styles.optionTextDisabled,
                ]}
                maxFontSizeMultiplier={1.2}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  options: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  option: {
    flex: 1,
    height: 48,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: colors.accent,
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.textOnAccent,
  },
  optionTextDisabled: {
    color: colors.disabledText,
  },
});
