import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { LISTINGS, RELATED_LISTINGS } from '@/data/listings';
import StatusPill from '@/components/ui/StatusPill';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 320;

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { likedIds, toggleLike } = useAppStore((s) => ({
    likedIds: s.likedIds,
    toggleLike: s.toggleLike,
  }));

  const listing = LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
  const isLiked = likedIds.includes(listing.id);
  const images = listing.images ?? [];
  const [imgPage, setImgPage] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setImgPage(page);
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero carousel */}
        <View style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT, backgroundColor: '#ccc' }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          {/* Floating nav */}
          <View style={[styles.heroNav, { top: insets.top + 8 }]}>
            <Pressable style={styles.heroBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </Pressable>
            <View style={styles.heroRightBtns}>
              <Pressable style={styles.heroBtn}>
                <Ionicons name="share-social-outline" size={20} color="#fff" />
              </Pressable>
              <Pressable style={styles.heroBtn}>
                <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
          {/* Page indicator */}
          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>{imgPage + 1} / {images.length}</Text>
          </View>
          {/* Dots */}
          <View style={styles.dots}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, idx === imgPage && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Seller info */}
        <View style={styles.sellerCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
            style={styles.sellerAvatar}
            contentFit="cover"
          />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{listing.seller}</Text>
            <View style={styles.sellerMeta}>
              <Text style={styles.sellerDong}>강남구 {listing.dong}</Text>
              <Text style={styles.dot2}> · </Text>
              <Ionicons name="star" size={12} color={Colors.statusYellow} />
              <Text style={styles.sellerScore}> 4.8</Text>
            </View>
          </View>
          <Pressable style={styles.sellerProfileBtn}>
            <Text style={styles.sellerProfileText}>판매자 프로필 &gt;</Text>
          </Pressable>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Category + status */}
          <View style={styles.chipsRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{listing.category}장</Text>
            </View>
            <StatusPill status={listing.status} size="md" />
          </View>

          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{listing.timeAgo}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>조회 {listing.views ?? 142}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Ionicons name="heart-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}> {listing.likes}</Text>
          </View>
          <Text style={styles.price}>{listing.price.toLocaleString()}원</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        {/* Location card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>거래 장소</Text>
          <View style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              <MaterialCommunityIcons name="map-marker-radius" size={36} color={Colors.primary} />
              <Text style={styles.mapPlaceholderText}>지도 보기</Text>
            </View>
            <View style={styles.mapInfo}>
              <View style={styles.mapInfoLeft}>
                <MaterialCommunityIcons name="office-building" size={16} color={Colors.textSecondary} />
                <View>
                  <Text style={styles.centerName}>{listing.centerName} (역삼점)</Text>
                  <Text style={styles.address}>{listing.address}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Related listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이 스포츠센터의 다른 매물</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
            {RELATED_LISTINGS.map((rel) => (
              <Pressable key={rel.id} style={styles.relatedCard}>
                <Image
                  source={{ uri: rel.image }}
                  style={styles.relatedImage}
                  contentFit="cover"
                />
                <View style={styles.relatedCategoryBadge}>
                  <Text style={styles.relatedCategoryText}>{rel.category}</Text>
                </View>
                <Text style={styles.relatedTitle} numberOfLines={2}>{rel.title}</Text>
                <Text style={styles.relatedPrice}>{rel.price.toLocaleString()}원</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.likeBtn}
          onPress={() => toggleLike(listing.id)}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? Colors.danger : Colors.textSecondary}
          />
          <Text style={[styles.likeBtnCount, isLiked && { color: Colors.danger }]}>
            {listing.likes + (isLiked ? 1 : 0)}
          </Text>
        </Pressable>
        <Pressable
          style={styles.chatBtn}
          onPress={() => router.push(`/chat/${listing.id}`)}
        >
          <Text style={styles.chatBtnText}>채팅하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  heroNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  heroBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRightBtns: { flexDirection: 'row', gap: 8 },
  pageIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  pageIndicatorText: { color: '#fff', fontSize: FontSize.xs },
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 16 },

  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  sellerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  sellerDong: { fontSize: FontSize.sm, color: Colors.textMuted },
  dot2: { color: Colors.textMuted },
  sellerScore: { fontSize: FontSize.sm, color: Colors.textMuted },
  sellerProfileBtn: {},
  sellerProfileText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: 8,
    borderBottomWidth: 8,
    borderBottomColor: Colors.background,
    paddingBottom: Spacing.lg,
  },
  chipsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
  },
  categoryChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primaryDark },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: FontSize.xs, color: Colors.textMuted },
  metaDot: { color: Colors.textMuted },
  price: {
    fontSize: 24,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 8,
    borderBottomColor: Colors.background,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  mapCard: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: '#d4e6c3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapPlaceholderText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  mapInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  mapInfoLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  centerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  address: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  relatedScroll: { paddingRight: Spacing.md, gap: 12 },
  relatedCard: {
    width: 140,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    ...Shadow.card,
  },
  relatedImage: { width: 140, height: 110 },
  relatedCategoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  relatedCategoryText: { fontSize: FontSize.xs, color: '#fff' },
  relatedTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    paddingHorizontal: 8,
    paddingTop: 8,
    lineHeight: 18,
  },
  relatedPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    paddingHorizontal: 8,
    paddingBottom: 10,
    paddingTop: 4,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 12,
    ...Shadow.elevated,
  },
  likeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 3,
  },
  likeBtnCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  chatBtn: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
});
