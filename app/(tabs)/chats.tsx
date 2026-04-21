import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const CHAT_LIST = [
  {
    id: '1',
    user: '헬스매니아77',
    dong: '역삼동',
    lastMessage: '80만원에 가능하시면 바로 결제하겠습니다',
    time: '오후 2:23',
    unread: 2,
    listing: '강남 퍼펙트짐 PT 30회 양도합니다',
    price: 850000,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100',
  },
  {
    id: '2',
    user: '골퍼준영',
    dong: '삼성동',
    lastMessage: '네, 아직 판매 중입니다!',
    time: '오전 11:05',
    unread: 0,
    listing: '스크린골프 GDR 12개월 회원권',
    price: 1200000,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=100',
  },
];

export default function ChatsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
      </View>
      <FlatList
        data={CHAT_LIST}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.chatItem, pressed && { backgroundColor: Colors.background }]}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
            <View style={styles.info}>
              <View style={styles.topRow}>
                <Text style={styles.userName}>{item.user}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
              <Text style={styles.listingName} numberOfLines={1}>{item.listing}</Text>
            </View>
            <View style={styles.right}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                contentFit="cover"
              />
              {item.unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: Colors.surface,
  },
  avatarWrap: {},
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.border,
  },
  info: { flex: 1, gap: 3 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  lastMsg: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  listingName: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
  },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.pill,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: FontWeight.bold,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 52 + 12,
  },
});
