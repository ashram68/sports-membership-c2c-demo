import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { ListingCard } from '@/components';
import { Listing } from '@/data/listings';

const TABS = ['내 판매글', '찜한 매물', '채팅방', '거래 이력'];

const MENU_ITEMS = [
  { icon: 'heart-outline' as const, label: '관심 목록' },
  { icon: 'time-outline' as const, label: '최근 본 상품' },
  { icon: 'ban-outline' as const, label: '차단 사용자 관리' },
  { icon: 'megaphone-outline' as const, label: '공지사항' },
  { icon: 'headset-outline' as const, label: '고객센터' },
];

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

export default function MyPageScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const listings = useAppStore((s) => s.listings);
  const getLikedListings = useAppStore((s) => s.getLikedListings);
  const logout = useAppStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState('내 판매글');

  const myListings = listings.slice(0, 3);
  const likedListings: Listing[] = getLikedListings();
  const displayListings = activeTab === '찜한 매물' ? likedListings : myListings;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <View style={styles.headerActions}>
            <Pressable hitSlop={8}>
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            </Pressable>
            <Pressable hitSlop={8}>
              <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* ── Profile card ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Image
              source={{ uri: currentUser.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nicknameRow}>
                <Text style={styles.nickname}>{currentUser.nickname}</Text>
                <Pressable hitSlop={8}>
                  <Ionicons name="pencil" size={14} color={Colors.textMuted} />
                </Pressable>
              </View>
              <View style={styles.dongRow}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.dong}>{currentUser.dong}</Text>
              </View>
              <View style={styles.badgesRow}>
                <View style={styles.mannerBadge}>
                  <Ionicons name="star" size={12} color={Colors.statusYellow} />
                  <Text style={styles.mannerText}>{currentUser.mannerScore}</Text>
                </View>
                <View style={styles.trustBadge}>
                  <Text style={styles.trustText}>신뢰도 {currentUser.trustRate}%</Text>
                </View>
              </View>
            </View>
          </View>
          <Pressable style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>프로필 편집</Text>
          </Pressable>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsCard}>
          {[
            { label: '판매 중', value: '3' },
            { label: '거래 완료', value: '12' },
            { label: '찜한 매물', value: '28' },
          ].map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <Pressable style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Pressable>
              {idx < 2 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Tab bar ── */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Listing list ── */}
        <View>
          {displayListings.length > 0 ? displayListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              showViews
              onPress={() => router.push(`/listing/${item.id}`)}
            />
          )) : (
            <View style={styles.emptyBox}>
              <Ionicons name="heart-outline" size={40} color={Colors.primaryLight} />
              <Text style={styles.emptyText}>목록이 없습니다</Text>
            </View>
          )}
        </View>

        {/* ── Menu ── */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <React.Fragment key={item.label}>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: Colors.background },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={Colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </Pressable>
              {idx < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Logout ── */}
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerActions: { flexDirection: 'row', gap: 12 },

  profileCard: {
    margin: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...cardShadow,
  },
  profileTop: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  profileInfo: { flex: 1, gap: 5 },
  nicknameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nickname: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  dongRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dong: { fontSize: FontSize.sm, color: Colors.textSecondary },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  mannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  mannerText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  trustBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  trustText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },
  editProfileBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editProfileText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    ...cardShadow,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  statDivider: { width: 1, backgroundColor: Colors.border },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
    backgroundColor: Colors.surface,
  },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted },

  menuCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...cardShadow,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 18 + 12,
  },

  logoutBtn: { alignItems: 'center', paddingVertical: Spacing.lg },
  logoutText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
