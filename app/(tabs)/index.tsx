import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { ListingCard, CategoryChip } from '@/components';
import { Listing } from '@/data/listings';

const CATEGORIES = ['전체', '헬스', '골프', '수영', '요가', '필라테스', '테니스', '크로스핏'];

export default function HomeScreen() {
  const router = useRouter();
  const listings = useAppStore((s) => s.listings);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setCategory = useAppStore((s) => s.setCategory);

  const filtered = selectedCategory === '전체'
    ? listings
    : listings.filter((l) => l.category === selectedCategory);

  const renderItem = useCallback(({ item }: { item: Listing }) => (
    <ListingCard
      listing={item}
      onPress={() => router.push(`/listing/${item.id}`)}
    />
  ), [router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.locationBtn}>
          <Ionicons name="location-sharp" size={18} color={Colors.primary} />
          <Text style={styles.locationText}>역삼동</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="search" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <View>
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              <View style={styles.notiBadge}>
                <Text style={styles.notiBadgeText}>3</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Category chips */}
      <View style={styles.categoryRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Pressable style={styles.sortBtn}>
          <Text style={styles.sortText}>최신순</Text>
          <Ionicons name="chevron-down" size={13} color={Colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.filterBtn}>
          <Ionicons name="options-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.filterText}>필터</Text>
        </Pressable>
      </View>

      {/* Listings */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.94 }] }]}
        onPress={() => router.push('/create')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notiBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: Radius.pill,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notiBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  categoryRow: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingTop: Spacing.xs,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.elevated,
  },
});
