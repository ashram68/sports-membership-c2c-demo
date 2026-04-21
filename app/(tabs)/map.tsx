import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { LISTINGS } from '@/data/listings';

const { width: SCREEN_W } = Dimensions.get('window');

// OpenStreetMap static tile centered on 강남역(37.4979, 127.0276) — license-free public map
const MAP_URL =
  'https://staticmap.openstreetmap.de/staticmap.php?center=37.4979,127.0276&zoom=15&size=780x1100&maptype=mapnik';

// Mock pin placements (overlay coordinates within map image, percentage-based)
const PINS = [
  { listing: LISTINGS[0], top: '28%', left: '42%' }, // 강남 퍼펙트짐
  { listing: LISTINGS[1], top: '18%', left: '62%' }, // GDR 강남점
  { listing: LISTINGS[2], top: '45%', left: '32%' }, // 코어필라테스
  { listing: LISTINGS[3], top: '52%', left: '68%' }, // 센트럴스포츠센터
  { listing: LISTINGS[4], top: '38%', left: '50%' }, // 웰빙요가
  { listing: LISTINGS[5], top: '62%', left: '44%' }, // 크로스핏 강남박스
];

export default function MapScreen() {
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top header */}
      <View style={styles.header}>
        <Pressable style={styles.dongBtn}>
          <Ionicons name="location" size={14} color={Colors.primary} />
          <Text style={styles.dongText}>강남구 역삼동</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.filterBtn}>
          <Ionicons name="options-outline" size={16} color={Colors.textPrimary} />
          <Text style={styles.filterText}>필터</Text>
        </Pressable>
      </View>

      {/* Map image + overlay pins */}
      <View style={styles.mapWrap}>
        <Image
          source={{ uri: MAP_URL }}
          style={styles.mapImage}
          contentFit="cover"
          transition={300}
        />

        {/* "내 위치" 파란 원 중앙 표시 */}
        <View style={styles.myLocation}>
          <View style={styles.myLocationDot} />
        </View>

        {/* Listing pins */}
        {PINS.map((pin, idx) => (
          <Pressable
            key={pin.listing.id}
            style={[
              styles.pin,
              {
                top: pin.top as any,
                left: pin.left as any,
                zIndex: selectedIdx === idx ? 10 : 1,
              },
              selectedIdx === idx && styles.pinActive,
            ]}
            onPress={() => setSelectedIdx(idx)}
          >
            <Text style={styles.pinText}>
              {Math.round(pin.listing.price / 10000)}만
            </Text>
          </Pressable>
        ))}

        {/* 지도 컨트롤 버튼들 */}
        <View style={styles.mapControls}>
          <Pressable style={styles.mapCtrlBtn}>
            <Ionicons name="locate" size={20} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.mapCtrlBtn}>
            <Ionicons name="add" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.mapCtrlBtn}>
            <Ionicons name="remove" size={22} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* 선택된 매물 카드 carousel (하단) */}
      <View style={styles.cardsWrap}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={SCREEN_W - Spacing.md * 2 + 12}
          contentContainerStyle={styles.cardsContent}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / (SCREEN_W - Spacing.md * 2 + 12)
            );
            setSelectedIdx(Math.min(Math.max(0, idx), PINS.length - 1));
          }}
        >
          {PINS.map((pin, idx) => (
            <Pressable
              key={pin.listing.id}
              style={[styles.card, idx === selectedIdx && styles.cardActive]}
              onPress={() => router.push(`/listing/${pin.listing.id}`)}
            >
              <Image
                source={{ uri: pin.listing.images?.[0] }}
                style={styles.cardThumb}
                contentFit="cover"
              />
              <View style={styles.cardBody}>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardCategory}>{pin.listing.category}</Text>
                  <Text style={styles.cardDot}>·</Text>
                  <Text style={styles.cardCenterName} numberOfLines={1}>
                    {pin.listing.centerName}
                  </Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {pin.listing.title}
                </Text>
                <Text style={styles.cardPrice}>
                  {pin.listing.price.toLocaleString()}원
                </Text>
                <View style={styles.cardFooter}>
                  <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.cardDistance}>{pin.listing.distance}</Text>
                  <Ionicons name="heart-outline" size={12} color={Colors.textMuted} style={{ marginLeft: 8 }} />
                  <Text style={styles.cardDistance}>{pin.listing.likes}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
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
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 2,
  },
  dongBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  dongText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  mapWrap: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: { width: '100%', height: '100%' },

  myLocation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -14,
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#fff',
  },

  pin: {
    position: 'absolute',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadow.card,
  },
  pinActive: {
    backgroundColor: Colors.primary,
    transform: [{ scale: 1.12 }],
  },
  pinText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },

  mapControls: {
    position: 'absolute',
    right: 12,
    top: 12,
    gap: 6,
  },
  mapCtrlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },

  cardsWrap: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  cardsContent: {
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  card: {
    width: SCREEN_W - Spacing.md * 2,
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 12,
    gap: 12,
    ...Shadow.elevated,
  },
  cardActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cardThumb: {
    width: 84,
    height: 84,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardCategory: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  cardDot: { fontSize: FontSize.xs, color: Colors.textMuted },
  cardCenterName: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  cardPrice: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardDistance: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
