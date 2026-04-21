import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import StatusPill from './StatusPill';
import { Listing } from '@/data/listings';

const CATEGORY_IMAGES: Record<string, string> = {
  '헬스': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=240',
  '골프': 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=240',
  '필라테스': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=240',
  '수영': 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=240',
  '요가': 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=240',
  '크로스핏': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=240',
  '테니스': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=240',
};

interface Props {
  listing: Listing;
  onPress?: () => void;
  showViews?: boolean;
}

export default function ListingCard({ listing, onPress, showViews = false }: Props) {
  const isCompleted = listing.status === '판매완료';
  const imageUrl = listing.images?.[0] ?? CATEGORY_IMAGES[listing.category] ?? CATEGORY_IMAGES['헬스'];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.thumbnailWrap}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.thumbnail, isCompleted && styles.thumbnailDimmed]}
          contentFit="cover"
          transition={200}
        />
        {isCompleted && (
          <View style={styles.completedOverlay}>
            <Text style={styles.completedOverlayText}>거래완료</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.textDimmed]} numberOfLines={2}>
          {listing.title}
        </Text>
        <View style={styles.metaRow}>
          <StatusPill status={listing.status} />
          <Text style={styles.metaText}> {listing.dong} · {listing.distance}</Text>
        </View>
        <Text style={[styles.price, isCompleted && styles.priceDimmed]}>
          {listing.price.toLocaleString()}원
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.statText}>{listing.likes}</Text>
          </View>
          {listing.comments > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.statText}>{listing.comments}</Text>
            </View>
          )}
          {showViews && listing.views && (
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.statText}>{listing.views}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
    gap: Spacing.md,
  },
  thumbnailWrap: {
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: Radius.sm,
  },
  thumbnailDimmed: {
    opacity: 0.5,
  },
  completedOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedOverlayText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  content: {
    flex: 1,
    gap: 6,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  textDimmed: {
    color: Colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  price: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  priceDimmed: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
