/**
 * Seletor horizontal de horas (1–12) com scroll.
 * Chips escuros com destaque âmbar no item selecionado.
 */
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HOUR_OPTIONS } from '../constants/alarm';
import { colors, radii } from '../constants/theme';

interface HourPickerProps {
  selected: number;
  onSelect: (hour: number) => void;
  disabled: boolean;
}

/**
 * Renderiza uma lista horizontal scrollável de opções de hora.
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
    <View style={styles.container}>
      <Text style={styles.label}>HORAS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {HOUR_OPTIONS.map((hour) => (
          <Pressable
            key={hour}
            style={[
              styles.option,
              hour === selected && styles.optionSelected,
              disabled && styles.optionDisabled,
            ]}
            onPress={() => handleSelect(hour)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.optionText,
                hour === selected && styles.optionTextSelected,
                disabled && styles.optionTextDisabled,
              ]}
            >
              {hour}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
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
  scrollContent: {
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
    color: colors.background,
  },
  optionTextDisabled: {
    color: colors.disabledText,
  },
});
