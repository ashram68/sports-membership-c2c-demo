import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Mock sports center pin data (positioned as % of map image) ───
const PINS = [
  {
    id: '1',
    name: '강남 퍼펙트짐',
    category: '헬스',
    dong: '역삼동',
    price: 850000,
    listings: 3,
    color: Colors.primary,
    left: 0.42,
    top: 0.52,
  },
  {
    id: '2',
    name: 'GDR 강남점',
    category: '골프',
    dong: '삼성동',
    price: 1200000,
    listings: 1,
    color: '#6366F1',
    left: 0.67,
    top: 0.38,
  },
  {
    id: '3',
    name: '코어필라테스',
    category: '필라테스',
    dong: '논현동',
    price: 380000,
    listings: 2,
    color: '#EC4899',
    left: 0.25,
    top: 0.44,
  },
  {
    id: '4',
    name: '센트럴스포츠',
    category: '수영',
    dong: '선릉역',
    price: 220000,
    listings: 1,
    color: '#0EA5E9',
    left: 0.55,
    top: 0.60,
  },
  {
    id: '5',
    name: '웰빙요가',
    category: '요가',
    dong: '역삼동',
    price: 150000,
    listings: 1,
    color: '#10B981',
    left: 0.38,
    top: 0.64,
  },
  {
    id: '6',
    name: '크로스핏 강남',
    category: '크로스핏',
    dong: '신사동',
    price: 980000,
    listings: 2,
    color: '#F59E0B',
    left: 0.18,
    top: 0.32,
  },
  {
    id: '7',
    name: '로얄테니스클럽',
    category: '테니스',
    dong: '압구정동',
    price: 540000,
    listings: 1,
    color: '#8B5CF6',
    left: 0.14,
    top: 0.22,
  },
];

const CATEGORY_FILTERS = ['전체', '헬스', '골프', '수영', '요가', '필라테스', '테니스', '크로스핏'];
const CATEGORY_COLORS: Record<string, string> = {
  헬스: Colors.primary,
  골프: '#6366F1',
  필라테스: '#EC4899',
  수영: '#0EA5E9',
  요가: '#10B981',
  크로스핏: '#F59E0B',
  테니스: '#8B5CF6',
};

const MAP_HEIGHT = SH * 0.58;

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
  default: {},
});

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('전체');

  const selectedCenter = PINS.find((p) => p.id === selectedPin) ?? null;

  const filteredPins = activeFilter === '전체'
    ? PINS
    : PINS.filter((p) => p.category === activeFilter);

  const handlePinPress = (id: string) => {
    setSelectedPin(selectedPin === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color={Colors.primary} />
          <Text style={styles.headerTitle}>강남구 역삼동</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
        </View>
        <Pressable hitSlop={8}>
          <Ionicons name="search" size={22} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {/* ── Category filter chips ── */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = activeFilter === cat;
            const chipColor = cat === '전체' ? Colors.primary : (CATEGORY_COLORS[cat] ?? Colors.primary);
            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  isActive
                    ? { backgroundColor: chipColor, borderColor: chipColor }
                    : { backgroundColor: Colors.surface, borderColor: Colors.border },
                ]}
                onPress={() => {
                  setActiveFilter(cat);
                  setSelectedPin(null);
                }}
              >
                <Text style={[styles.filterChipText, isActive && { color: '#fff' }]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Map area ── */}
      <View style={styles.mapContainer}>
        {/* Background map image */}
        <Image
          source={require('@/assets/images/gangnam-map.png')}
          style={styles.mapImage}
          contentFit="cover"
          transition={300}
        />

        {/* Overlay grid lines for realism */}
        <View style={styles.mapOverlay} pointerEvents="none" />

        {/* District label */}
        <View style={styles.districtLabel} pointerEvents="none">
          <Text style={styles.districtLabelText}>강남구</Text>
        </View>

        {/* Road labels */}
        <View style={[styles.roadLabel, { top: '46%', left: '10%' }]} pointerEvents="none">
          <Text style={styles.roadLabelText}>테헤란로</Text>
        </View>
        <View style={[styles.roadLabel, { top: '20%', left: '44%' }]} pointerEvents="none">
          <Text style={styles.roadLabelText}>강남대로</Text>
        </View>

        {/* My location pin (center) */}
        <View style={styles.myLocation} pointerEvents="none">
          <View style={styles.myLocationDot} />
          <View style={styles.myLocationRing} />
        </View>

        {/* Sports center pins */}
        {filteredPins.map((pin) => {
          const isSelected = selectedPin === pin.id;
          return (
            <Pressable
              key={pin.id}
              style={[
                styles.pinContainer,
                {
                  left: `${pin.left * 100}%`,
                  top: `${pin.top * 100}%`,
                },
              ]}
              onPress={() => handlePinPress(pin.id)}
            >
              {/* Listing count badge */}
              {pin.listings > 1 && (
                <View style={[styles.badgeCount, { backgroundColor: pin.color }]}>
                  <Text style={styles.badgeCountText}>{pin.listings}</Text>
                </View>
              )}

              {/* Pin bubble */}
              <View style={[
                styles.pinBubble,
                { backgroundColor: pin.color },
                isSelected && styles.pinBubbleSelected,
              ]}>
                <Text style={styles.pinBubbleText}>{pin.category}</Text>
              </View>
              <View style={[styles.pinTail, { borderTopColor: pin.color }]} />
            </Pressable>
          );
        })}

        {/* Selected card overlay at bottom of map */}
        {selectedCenter && (
          <Pressable
            style={styles.selectedCard}
            onPress={() => router.push(`/listing/${selectedCenter.id}`)}
          >
            <View style={[styles.selectedCardAccent, { backgroundColor: selectedCenter.color }]} />
            <View style={styles.selectedCardBody}>
              <View style={styles.selectedCardTop}>
                <View style={[styles.selectedCatChip, { backgroundColor: selectedCenter.color + '22' }]}>
                  <Text style={[styles.selectedCatText, { color: selectedCenter.color }]}>
                    {selectedCenter.category}
                  </Text>
                </View>
                <Text style={styles.selectedListingCount}>매물 {selectedCenter.listings}건</Text>
              </View>
              <Text style={styles.selectedCenterName}>{selectedCenter.name}</Text>
              <View style={styles.selectedMeta}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.selectedDong}>{selectedCenter.dong}</Text>
              </View>
              <Text style={styles.selectedPrice}>
                {selectedCenter.price.toLocaleString()}원~
              </Text>
            </View>
            <View style={styles.selectedCardArrow}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>
          </Pressable>
        )}
      </View>

      {/* ── Bottom stats bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{filteredPins.length}</Text>
            <Text style={styles.statLbl}>시설</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>
              {filteredPins.reduce((sum, p) => sum + p.listings, 0)}
            </Text>
            <Text style={styles.statLbl}>매물</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>1.2km</Text>
            <Text style={styles.statLbl}>평균거리</Text>
          </View>
        </View>
        <Text style={styles.bottomHint}>핀을 눌러 매물을 확인하세요</Text>
      </View>
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
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  filterRow: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },

  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  districtLabel: {
    position: 'absolute',
    top: '8%',
    left: '38%',
  },
  districtLabelText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: 'rgba(100,100,120,0.5)',
    letterSpacing: 2,
  },
  roadLabel: {
    position: 'absolute',
  },
  roadLabelText: {
    fontSize: 10,
    color: 'rgba(80,80,100,0.55)',
    fontWeight: FontWeight.medium,
  },

  // My location blue dot
  myLocation: {
    position: 'absolute',
    left: '48%',
    top: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginLeft: -18,
    marginTop: -18,
  },
  myLocationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3B82F6',
    borderWidth: 2.5,
    borderColor: '#fff',
    zIndex: 2,
    ...Platform.select({
      ios: { shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6 },
      android: { elevation: 4 },
      default: {},
    }),
  },
  myLocationRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },

  // Pins
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -30 }, { translateY: -44 }],
    zIndex: 10,
  },
  badgeCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 12,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeCountText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  pinBubble: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 6 },
      android: { elevation: 5 },
      default: {},
    }),
  },
  pinBubbleSelected: {
    transform: [{ scale: 1.12 }],
    ...Platform.select({
      ios: { shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 8 },
      default: {},
    }),
  },
  pinBubbleText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  // Selected card (overlaid bottom of map)
  selectedCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...cardShadow,
  },
  selectedCardAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  selectedCardBody: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  selectedCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCatChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  selectedCatText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  selectedListingCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  selectedCenterName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  selectedDong: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  selectedPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 2,
  },
  selectedCardArrow: {
    paddingRight: 12,
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statLbl: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  bottomHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
