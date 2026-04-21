import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { LISTINGS, RELATED_LISTINGS } from '@/data/listings';
import StatusPill from '@/components/ui/StatusPill';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 300;

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const likedIds = useAppStore((s) => s.likedIds);
  const toggleLike = useAppStore((s) => s.toggleLike);

  const listing = LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
  const isLiked = likedIds.includes(listing.id);

  const images: string[] = (listing.images && listing.images.length > 0)
    ? listing.images
    : ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'];

  const [imgPage, setImgPage] = useState(0);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces
      >
        {/* ── Hero carousel ── */}
        <View style={styles.heroContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={32}
            onScroll={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setImgPage(page);
            }}
            style={styles.heroScroll}
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={styles.heroImage}
                contentFit="cover"
                transition={200}
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

          {/* Page counter */}
          <View style={styles.pageCounter}>
            <Text style={styles.pageCounterText}>{imgPage + 1} / {images.length}</Text>
          </View>
        </View>

        {/* ── Seller card ── */}
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
              <Text style={styles.sep}> · </Text>
              <Ionicons name="star" size={12} color={Colors.statusYellow} />
              <Text style={styles.sellerScore}> 4.8</Text>
            </View>
          </View>
          <Pressable hitSlop={8}>
            <Text style={styles.profileLink}>판매자 프로필 &gt;</Text>
          </Pressable>
        </View>

        {/* ── Content block ── */}
        <View style={styles.contentBlock}>
          <View style={styles.chipsRow}>
            <View style={styles.catChip}>
              <Text style={styles.catChipText}>{listing.category}</Text>
            </View>
            <StatusPill status={listing.status} size="md" />
          </View>

          <Text style={styles.listingTitle}>{listing.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{listing.timeAgo}</Text>
            <Text style={styles.sep}> · </Text>
            <Text style={styles.metaText}>조회 {listing.views ?? 142}</Text>
            <Text style={styles.sep}> · </Text>
            <Ionicons name="heart-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}> {listing.likes}</Text>
          </View>

          <Text style={styles.priceText}>{listing.price.toLocaleString()}원</Text>

          <Text style={styles.description}>{listing.description}</Text>
        </View>

        {/* ── Location section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>거래 장소</Text>
          <View style={styles.mapCard}>
            <View style={styles.mapBg}>
              <MaterialCommunityIcons name="map-marker-radius" size={40} color={Colors.primary} />
              <Text style={styles.mapLabel}>지도 보기</Text>
            </View>
            <View style={styles.mapInfoRow}>
              <MaterialCommunityIcons name="office-building" size={16} color={Colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.centerName}>{listing.centerName} (역삼점)</Text>
                <Text style={styles.addressText}>{listing.address ?? '서울 강남구 테헤란로 123'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Related listings ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이 스포츠센터의 다른 매물</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedList}
          >
            {RELATED_LISTINGS.map((rel) => (
              <Pressable key={rel.id} style={styles.relatedCard}>
                <Image
                  source={{ uri: rel.image }}
                  style={styles.relatedImg}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.relatedCatBadge}>
                  <Text style={styles.relatedCatText}>{rel.category}</Text>
                </View>
                <Text style={styles.relatedTitle} numberOfLines={2}>{rel.title}</Text>
                <Text style={styles.relatedPrice}>{rel.price.toLocaleString()}원</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable style={styles.likeBtn} onPress={() => toggleLike(listing.id)}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? Colors.danger : Colors.textSecondary}
          />
          <Text style={[styles.likeCount, isLiked && { color: Colors.danger }]}>
            {listing.likes + (isLiked ? 1 : 0)}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.chatBtn, pressed && { backgroundColor: Colors.primaryDark }]}
          onPress={() => router.push(`/chat/${listing.id}`)}
        >
          <Text style={styles.chatBtnText}>채팅하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  android: { elevation: 2 },
  default: {},
});

const elevatedShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: { elevation: 5 },
  default: {},
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingBottom: 110 },

  // Hero
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    backgroundColor: Colors.border,
  },
  heroScroll: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRightBtns: { flexDirection: 'row', gap: 8 },
  pageCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  pageCounterText: { color: '#fff', fontSize: FontSize.xs },

  // Seller
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
    backgroundColor: Colors.surface,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.border,
  },
  sellerInfo: { flex: 1 },
  sellerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  sellerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  sellerDong: { fontSize: FontSize.sm, color: Colors.textMuted },
  sep: { color: Colors.textMuted },
  sellerScore: { fontSize: FontSize.sm, color: Colors.textMuted },
  profileLink: { fontSize: FontSize.sm, color: Colors.textSecondary },

  // Content
  contentBlock: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: 8,
    borderBottomWidth: 8,
    borderBottomColor: Colors.background,
  },
  chipsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.pill,
  },
  catChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  listingTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: FontSize.xs, color: Colors.textMuted },
  priceText: {
    fontSize: 26,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    marginTop: 4,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: 4,
  },

  // Section
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
    marginBottom: 12,
  },

  // Map
  mapCard: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...cardShadow,
  },
  mapBg: {
    height: 160,
    backgroundColor: '#d4e6c3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  mapInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.surface,
  },
  centerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  addressText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  // Related
  relatedList: { gap: 12, paddingRight: 16 },
  relatedCard: {
    width: 140,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    ...cardShadow,
  },
  relatedImg: { width: 140, height: 110 },
  relatedCatBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  relatedCatText: { fontSize: FontSize.xs, color: '#fff' },
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

  // Bottom CTA
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 12,
    ...elevatedShadow,
  },
  likeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 3,
    minWidth: 44,
    minHeight: 44,
  },
  likeCount: { fontSize: FontSize.xs, color: Colors.textMuted },
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
