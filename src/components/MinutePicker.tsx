/**
 * Seletor de minutos (00 ou 30) lado a lado.
 * Chips escuros com destaque âmbar no item selecionado.
 */
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MINUTE_OPTIONS } from '../constants/alarm';
import { colors, radii } from '../constants/theme';

interface MinutePickerProps {
  selected: number;
  onSelect: (minute: number) => void;
  disabled: boolean;
}

/**
 * Renderiza duas opções de minutos (00, 30) em layout horizontal.
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
    <View style={styles.container}>
      <Text style={styles.label}>MINUTOS</Text>
      <View style={styles.options}>
        {MINUTE_OPTIONS.map((minute) => (
          <Pressable
            key={minute}
            style={[
              styles.option,
              minute === selected && styles.optionSelected,
              disabled && styles.optionDisabled,
            ]}
            onPress={() => handleSelect(minute)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.optionText,
                minute === selected && styles.optionTextSelected,
                disabled && styles.optionTextDisabled,
              ]}
            >
              {minute.toString().padStart(2, '0')}
            </Text>
          </Pressable>
        ))}
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
