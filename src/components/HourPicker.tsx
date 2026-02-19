/**
 * Seletor de horas (1–12) em grid de duas linhas.
 * Exibe todas as opções sem scroll para máxima discoverability.
 */
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HOUR_OPTIONS } from '../constants/alarm';
import { colors, radii } from '../constants/theme';

interface HourPickerProps {
  selected: number;
  onSelect: (hour: number) => void;
  disabled: boolean;
}

/**
 * Renderiza uma grid 6×2 de opções de hora (1–12).
 * @param selected - Hora atualmente selecionada
 * @param onSelect - Callback ao selecionar uma hora
 * @param disabled - Desabilita interação quando alarme está ativo
 */
export function HourPicker({ selected, onSelect, disabled }: HourPickerProps) {
  const handleSelect = (hour: number) => {
    if (disabled) return;
    Haptics.selectionAsync();
    onSelect(hour);
  };

  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="Horas"
    >
      <View style={styles.grid}>
        {HOUR_OPTIONS.map((hour) => {
          const isSelected = hour === selected;
          return (
            <Pressable
              key={hour}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                disabled && styles.optionDisabled,
              ]}
              onPress={() => handleSelect(hour)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityLabel={`${hour} hora${hour > 1 ? 's' : ''}`}
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
                {hour}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
