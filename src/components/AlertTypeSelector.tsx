/**
 * Seletor de tipo de alerta com layout em dois níveis:
 * - Nível 1: opção "Padrão do celular" (full-width, destaque)
 * - Nível 2: opções específicas (Visual, Vibração, Som)
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

const DEFAULT_OPTION = {
  type: 'padrão' as AlertType,
  label: '\u{1F4F1} Padrão do celular',
  a11yLabel: 'Padrão do celular',
};

const SPECIFIC_OPTIONS: { type: AlertType; label: string; a11yLabel: string }[] = [
  { type: 'silencioso', label: '\u{1F507} Visual', a11yLabel: 'Visual, sem som nem vibração' },
  { type: 'vibração', label: '\u{1F4F3} Vibração', a11yLabel: 'Vibração' },
  { type: 'som', label: '\u{1F50A} Som', a11yLabel: 'Som' },
];

/**
 * Renderiza opções de tipo de alerta em layout de dois níveis.
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

  const isDefaultSelected = selected === DEFAULT_OPTION.type;

  return (
    <View style={styles.container}>
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>TIPO DE ALERTA</Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Tipo de alerta"
        style={styles.group}
      >
        {/* Nível 1: Padrão do celular */}
        <Pressable
          style={[
            styles.defaultOption,
            isDefaultSelected && styles.optionSelected,
            disabled && styles.optionDisabled,
          ]}
          onPress={() => handleSelect(DEFAULT_OPTION.type)}
          disabled={disabled}
          accessibilityRole="radio"
          accessibilityLabel={DEFAULT_OPTION.a11yLabel}
          accessibilityState={{ selected: isDefaultSelected, disabled }}
        >
          <Text
            style={[
              styles.optionText,
              isDefaultSelected && styles.optionTextSelected,
              disabled && styles.optionTextDisabled,
            ]}
            maxFontSizeMultiplier={1.2}
          >
            {DEFAULT_OPTION.label}
          </Text>
        </Pressable>

        {/* Divider */}
        <Text
          style={[styles.dividerLabel, disabled && styles.optionTextDisabled]}
          maxFontSizeMultiplier={1.3}
        >
          ou escolha:
        </Text>

        {/* Nível 2: Opções específicas */}
        <View style={styles.specificOptions}>
          {SPECIFIC_OPTIONS.map(({ type, label, a11yLabel }) => {
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
  group: {
    gap: 8,
    paddingHorizontal: 4,
  },
  defaultOption: {
    height: 48,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  specificOptions: {
    flexDirection: 'row',
    gap: 8,
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
