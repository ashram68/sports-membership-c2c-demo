import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { CHAT_MESSAGES, ChatMessage } from '@/data/messages';
import { LISTINGS } from '@/data/listings';
import StatusPill from '@/components/ui/StatusPill';

const LISTING = LISTINGS[0];
const SELLER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      type: 'text',
      sender: 'sender',
      text: message.trim(),
      time: '오후 2:24',
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: ListRenderItemInfo<ChatMessage>) => {
    const isSender = item.sender === 'sender';

    if (item.type === 'photo') {
      return (
        <View style={[styles.msgRow, isSender ? styles.msgRowRight : styles.msgRowLeft]}>
          {!isSender && (
            <Image source={{ uri: SELLER_AVATAR }} style={styles.msgAvatar} contentFit="cover" />
          )}
          <View style={[styles.photoBubble, isSender && styles.photoBubbleSender]}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.photoMsg}
              contentFit="cover"
              transition={200}
            />
            {item.caption ? (
              <Text style={[styles.photoCaption, isSender && styles.photoCaptionSender]}>
                {item.caption}
              </Text>
            ) : null}
            {isSender && (
              <View style={styles.senderMeta}>
                <Text style={styles.readTag}>읽음</Text>
                <Text style={styles.timeTag}>{item.time}</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.msgRow, isSender ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isSender && (
          <Image source={{ uri: SELLER_AVATAR }} style={styles.msgAvatar} contentFit="cover" />
        )}
        <View style={styles.bubbleWrap}>
          {isSender && (
            <View style={styles.senderMeta}>
              <Text style={styles.readTag}>{item.read ? '읽음' : ''}</Text>
              <Text style={styles.timeTag}>{item.time}</Text>
            </View>
          )}
          <View style={[styles.bubble, isSender ? styles.bubbleSender : styles.bubbleReceiver]}>
            <Text style={[styles.bubbleText, isSender && styles.bubbleTextSender]}>
              {item.text}
            </Text>
          </View>
          {!isSender && (
            <Text style={styles.timeTagLeft}>{item.time}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerName}>{LISTING.seller}</Text>
            <Text style={styles.headerDong}>역삼동</Text>
          </View>
          <Pressable hitSlop={8}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Listing summary */}
      <Pressable style={styles.listingBar} onPress={() => router.back()}>
        <Image
          source={{ uri: LISTING.images?.[0] }}
          style={styles.listingThumb}
          contentFit="cover"
        />
        <View style={styles.listingInfo}>
          <Text style={styles.listingTitle} numberOfLines={1}>{LISTING.title}</Text>
          <Text style={styles.listingPrice}>{LISTING.price.toLocaleString()}원</Text>
        </View>
        <StatusPill status={LISTING.status} size="md" />
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </Pressable>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>2026년 4월 21일</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>입력 중...</Text>
            </View>
          }
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <Pressable style={styles.attachBtn} hitSlop={8}>
            <Ionicons name="add" size={22} color={Colors.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.msgInput}
            value={message}
            onChangeText={setMessage}
            placeholder="메시지 입력"
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  headerSafe: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 12,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  headerDong: { fontSize: FontSize.xs, color: Colors.textMuted },

  listingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
    backgroundColor: Colors.surface,
  },
  listingThumb: { width: 48, height: 48, borderRadius: Radius.sm },
  listingInfo: { flex: 1 },
  listingTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  listingPrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },

  messageList: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: Colors.background,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    marginBottom: 12,
  },
  dateSeparatorText: { fontSize: FontSize.xs, color: Colors.surface, fontWeight: FontWeight.medium },

  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  msgRowLeft: { justifyContent: 'flex-start' },
  msgRowRight: { justifyContent: 'flex-end' },
  msgAvatar: { width: 34, height: 34, borderRadius: 17 },

  bubbleWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    maxWidth: '75%',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
  },
  bubbleReceiver: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  bubbleSender: {
    backgroundColor: Colors.primaryLight,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextSender: { color: Colors.textPrimary },
  senderMeta: { alignItems: 'flex-end', gap: 2, justifyContent: 'flex-end' },
  readTag: { fontSize: 10, color: Colors.primary, fontWeight: FontWeight.medium },
  timeTag: { fontSize: 10, color: Colors.textMuted },
  timeTagLeft: { fontSize: 10, color: Colors.textMuted, alignSelf: 'flex-end' },

  photoBubble: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    maxWidth: '70%',
  },
  photoBubbleSender: { backgroundColor: Colors.primaryLight },
  photoMsg: { width: 180, height: 180 },
  photoCaption: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  photoCaptionSender: { color: Colors.textPrimary },

  typingIndicator: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  typingText: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    gap: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
});
