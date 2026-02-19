/**
 * Seletor de minutos (00, 15, 30, 45) lado a lado.
 * Chips escuros com destaque âmbar no item selecionado.
 */
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MINUTE_OPTIONS } from '../constants/alarm';
import { colors, radii, spacing } from '../constants/theme';

interface MinutePickerProps {
  selected: number;
  onSelect: (minute: number) => void;
  disabled: boolean;
}

/**
 * Renderiza opções de minutos em layout horizontal.
 * @param selected - Minuto atualmente selecionado
 * @param onSelect - Callback ao selecionar um minuto
 * @param disabled - Desabilita interação quando alarme está ativo
 */
export function MinutePicker({ selected, onSelect, disabled }: MinutePickerProps) {
  const handleSelect = (minute: number) => {
    if (disabled) return;
    Haptics.selectionAsync();
    onSelect(minute);
  };

  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="Minutos"
    >
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        MINUTOS
      </Text>
      <View style={styles.options}>
        {MINUTE_OPTIONS.map((minute) => {
          const isSelected = minute === selected;
          return (
            <Pressable
              key={minute}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                disabled && styles.optionDisabled,
              ]}
              onPress={() => handleSelect(minute)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityLabel={`${minute} minutos`}
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
                {minute.toString().padStart(2, '0')}
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
    gap: spacing.sm,
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
    width: 48,
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
    fontSize: 18,
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
