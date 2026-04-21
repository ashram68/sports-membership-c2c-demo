import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { ListingCard } from '@/components';
import { Listing } from '@/data/listings';

const TABS = ['내 판매글', '찜한 매물', '채팅방', '거래 이력'];

const MENU_ITEMS = [
  { icon: 'heart-outline', label: '관심 목록' },
  { icon: 'time-outline', label: '최근 본 상품' },
  { icon: 'ban-outline', label: '차단 사용자 관리' },
  { icon: 'megaphone-outline', label: '공지사항' },
  { icon: 'headset-outline', label: '고객센터' },
];

export default function MyPageScreen() {
  const router = useRouter();
  const { currentUser, listings, getLikedListings, logout } = useAppStore((s) => ({
    currentUser: s.currentUser,
    listings: s.listings,
    getLikedListings: s.getLikedListings,
    logout: s.logout,
  }));
  const [activeTab, setActiveTab] = useState('내 판매글');

  const myListings = listings.slice(0, 3);
  const likedListings: Listing[] = getLikedListings();

  const displayListings = activeTab === '찜한 매물' ? likedListings : myListings;

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, '해당 기능은 정식 출시 버전에서 제공될 예정입니다.', [
      { text: '확인', style: 'default' },
    ]);
  };

  const handleStatPress = (label: string) => {
    if (label === '판매 중') setActiveTab('내 판매글');
    else if (label === '찜한 매물') setActiveTab('찜한 매물');
    else if (label === '거래 완료') setActiveTab('거래 이력');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <View style={styles.headerActions}>
            <Pressable hitSlop={8} onPress={() => showComingSoon('알림')}>
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            </Pressable>
            <Pressable hitSlop={8} onPress={() => showComingSoon('설정')}>
              <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Image
              source={{ uri: currentUser.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.profileInfo}>
              <View style={styles.nicknameRow}>
                <Text style={styles.nickname}>{currentUser.nickname}</Text>
                <Pressable hitSlop={8} onPress={() => showComingSoon('닉네임 수정')}>
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
          <Pressable style={styles.editProfileBtn} onPress={() => showComingSoon('프로필 편집')}>
            <Text style={styles.editProfileText}>프로필 편집</Text>
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={styles.statsCard}>
          {[
            { label: '판매 중', value: '3' },
            { label: '거래 완료', value: '12' },
            { label: '찜한 매물', value: '28' },
          ].map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <Pressable style={styles.statItem} onPress={() => handleStatPress(stat.label)}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Pressable>
              {idx < 2 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Tab bar */}
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

        {/* Listing list */}
        <View style={{ gap: 0 }}>
          {displayListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              showViews
              onPress={() => router.push(`/listing/${item.id}`)}
            />
          ))}
        </View>

        {/* Menu items */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <React.Fragment key={item.label}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: Colors.background }]}
                onPress={() => showComingSoon(item.label)}
              >
                <Ionicons name={item.icon as any} size={18} color={Colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </Pressable>
              {idx < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout */}
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
    ...Shadow.card,
  },
  profileTop: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  profileInfo: { flex: 1, gap: 5 },
  nicknameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nickname: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
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
  mannerText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  trustBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  trustText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.accent },
  editProfileBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editProfileText: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: FontWeight.medium },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    ...Shadow.card,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
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
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },

  menuCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: 12,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.md + 18 + 12 },

  logoutBtn: { alignItems: 'center', paddingVertical: Spacing.lg },
  logoutText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
