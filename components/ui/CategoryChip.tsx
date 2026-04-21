import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/theme';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'filled' | 'outline';
}

export default function CategoryChip({ label, selected = false, onPress, variant = 'filled' }: Props) {
  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.outlineChip,
          selected && styles.outlineChipSelected,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.outlineText, selected && styles.outlineTextSelected]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipDefault,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textDefault]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipDefault: {
    backgroundColor: Colors.primaryLight,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  textSelected: {
    color: Colors.white,
  },
  textDefault: {
    color: Colors.primary,
  },
  // Outline variant for create screen
  outlineChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  outlineChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  outlineText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  outlineTextSelected: {
    color: Colors.primaryDark,
  },
});
