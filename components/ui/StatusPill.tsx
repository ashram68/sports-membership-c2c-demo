import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/theme';

type Status = '판매중' | '예약중' | '판매완료';

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  '판매중': { bg: Colors.accent, text: '#fff', label: '판매중' },
  '예약중': { bg: Colors.statusYellow, text: '#fff', label: '예약중' },
  '판매완료': { bg: Colors.textMuted, text: '#fff', label: '판매완료' },
};

export default function StatusPill({ status, size = 'sm' }: Props) {
  const config = statusConfig[status];
  return (
    <View style={[styles.pill, { backgroundColor: config.bg }, size === 'md' && styles.pillMd]}>
      <Text style={[styles.text, { color: config.text }, size === 'md' && styles.textMd]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  pillMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  textMd: {
    fontSize: FontSize.sm,
  },
});
