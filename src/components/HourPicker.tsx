/**
 * Seletor de horas com visualização compacta (1–3h) e expansão para 4–12h.
 * Mostra as horas mais comuns por padrão, com botão "+" para mais opções.
 */
import { useState } from 'react';
import { Pressable, Text, StyleSheet, View, LayoutAnimation } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HOUR_OPTIONS, DEFAULT_VISIBLE_HOURS } from '../constants/alarm';
import { colors, radii, spacing } from '../constants/theme';

interface HourPickerProps {
  selected: number;
  onSelect: (hour: number) => void;
  disabled: boolean;
}

/** Horas exibidas apenas após expansão (4–12). */
const EXPANDED_HOURS = HOUR_OPTIONS.filter(
  (h) => !DEFAULT_VISIBLE_HOURS.includes(h as (typeof DEFAULT_VISIBLE_HOURS)[number]),
);

/**
 * Renderiza horas 1–3 numa row compacta + botão de expansão para 4–12.
 * @param selected - Hora atualmente selecionada
 * @param onSelect - Callback ao selecionar uma hora
 * @param disabled - Desabilita interação quando alarme está ativo
 */
export function HourPicker({ selected, onSelect, disabled }: HourPickerProps) {
  const [isExpanded, setIsExpanded] = useState(
    () => selected >= 4,
  );

  const handleSelect = (hour: number) => {
    if (disabled) return;
    Haptics.selectionAsync();
    onSelect(hour);
  };

  const handleExpand = () => {
    if (disabled) return;
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(true);
  };

  const hasHiddenSelection = !isExpanded && selected >= 4;

  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="Horas"
    >
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        HORAS
      </Text>

      {/* Row principal: horas 1–3 + botão expand */}
      <View style={styles.chipRow}>
        {DEFAULT_VISIBLE_HOURS.map((hour) => {
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

        {!isExpanded && (
          <Pressable
            style={[
              styles.expandButton,
              hasHiddenSelection && styles.expandButtonActive,
              disabled && styles.optionDisabled,
            ]}
            onPress={handleExpand}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Ver mais horas"
            accessibilityHint="Exibe horas de 4 a 12"
            accessibilityState={{ disabled }}
          >
            <Text
              style={[
                styles.expandButtonText,
                hasHiddenSelection && styles.expandButtonTextActive,
                disabled && styles.optionTextDisabled,
              ]}
              maxFontSizeMultiplier={1.2}
            >
              {hasHiddenSelection ? `${selected}h` : '+'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Grid expandida: horas 4–12 */}
      {isExpanded && (
        <View style={styles.expandedGrid}>
          {EXPANDED_HOURS.map((hour) => {
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
                accessibilityLabel={`${hour} horas`}
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
      )}
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
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: 4,
  },
  expandedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  expandButton: {
    width: 48,
    height: 48,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButtonActive: {
    borderColor: colors.accent,
  },
  expandButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  expandButtonTextActive: {
    color: colors.accent,
  },
});
