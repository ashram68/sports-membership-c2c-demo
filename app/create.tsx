import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import CategoryChip from '@/components/ui/CategoryChip';
import { useAlert } from '@/template';

const CATEGORIES = ['헬스', '골프', '수영', '필라테스', '요가', '테니스', '크로스핏'];
const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200',
];

export default function CreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const [selectedCategory, setSelectedCategory] = useState('헬스');
  const [title, setTitle] = useState('강남 퍼펙트짐 PT 30회 양도합니다');
  const [price, setPrice] = useState('850,000');
  const [allowNegotiation, setAllowNegotiation] = useState(false);
  const [description, setDescription] = useState(
    '개인 사정으로 이사하게 되어 강남 퍼펙트짐 역삼점 PT 30회권 양도합니다.\n\n- 남은 횟수: 30회 (1회도 사용하지 않음)\n- 유효기간: 2026년 12월 31일까지\n- 양도비: 5만원 (제가 부담합니다!)\n- 헬스장 이용권 3개월 포함되어 있습니다.'
  );
  const [locationText, setLocationText] = useState('강남 퍼펙트짐');
  const [transaction, setTransaction] = useState<'direct' | 'online'>('direct');

  const handleSubmit = () => {
    showAlert('등록 완료!', '판매글이 성공적으로 등록되었습니다.', [
      { text: '확인', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ backgroundColor: Colors.surface }} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>이용권 판매하기</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.draftText}>임시저장</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Photo grid */}
          <View style={styles.section}>
            <View style={styles.photoGrid}>
              {/* Upload button */}
              <Pressable style={styles.photoUploadBtn}>
                <Ionicons name="camera" size={24} color={Colors.textMuted} />
                <Text style={styles.photoCount}>0/10</Text>
              </Pressable>
              {MOCK_PHOTOS.map((uri, idx) => (
                <View key={idx} style={styles.photoThumb}>
                  <View style={[styles.photoThumbImg, { backgroundColor: Colors.border }]} />
                  {idx === 0 && (
                    <View style={styles.repBadge}>
                      <Text style={styles.repBadgeText}>대표사진</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.photoHint}>첫 번째 사진이 대표 이미지로 설정됩니다. 시설의 전경이 잘 보이는 사진을 권장합니다.</Text>
          </View>

          <View style={styles.divider} />

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>카테고리 <Text style={styles.required}>*</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                  variant="outline"
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>제목 <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="제목을 입력하세요"
                placeholderTextColor={Colors.textMuted}
                maxLength={40}
              />
              <Text style={styles.charCount}>{title.length} / 40</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.label}>가격 <Text style={styles.required}>*</Text></Text>
            <View style={styles.priceInputWrap}>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                placeholder="가격을 입력하세요"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
              <Text style={styles.won}>원</Text>
            </View>
            <Pressable
              style={styles.checkRow}
              onPress={() => setAllowNegotiation(!allowNegotiation)}
            >
              <View style={[styles.checkbox, allowNegotiation && styles.checkboxChecked]}>
                {allowNegotiation && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.checkLabel}>가격 제안 받기</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>상품 설명 <Text style={styles.required}>*</Text></Text>
            <View style={styles.textareaWrap}>
              <TextInput
                style={styles.textarea}
                value={description}
                onChangeText={setDescription}
                placeholder="상품 설명을 입력하세요"
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={2000}
                textAlignVertical="top"
              />
              <Text style={styles.textareaCount}>{description.length} / 2000</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>스포츠센터 위치 <Text style={styles.required}>*</Text></Text>
            <View style={styles.locationInputWrap}>
              <Ionicons name="search" size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.locationInput}
                value={locationText}
                onChangeText={setLocationText}
                placeholder="스포츠 센터를 검색하세요"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            {/* Map placeholder */}
            <View style={styles.mapPreview}>
              <View style={styles.mapBg}>
                <MaterialCommunityIcons name="map-marker" size={32} color={Colors.primary} />
              </View>
              <View style={styles.mapInfoBar}>
                <MaterialCommunityIcons name="office-building" size={16} color={Colors.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapCenterName}>강남 퍼펙트짐 (역삼점)</Text>
                  <Text style={styles.mapAddress}>서울특별시 강남구 테헤란로 123 (역삼동)</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Transaction method */}
          <View style={styles.section}>
            <Text style={styles.label}>거래 방식</Text>
            <View style={styles.transactionRow}>
              <Pressable
                style={[styles.transactionBtn, transaction === 'direct' && styles.transactionBtnSelected]}
                onPress={() => setTransaction('direct')}
              >
                <Ionicons
                  name="handshake-outline"
                  size={20}
                  color={transaction === 'direct' ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[styles.transactionText, transaction === 'direct' && styles.transactionTextSelected]}>
                  직접 만나서 거래
                </Text>
                {transaction === 'direct' && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={styles.transactionCheck} />
                )}
              </Pressable>
              <Pressable
                style={[styles.transactionBtn, transaction === 'online' && styles.transactionBtnSelected]}
                onPress={() => setTransaction('online')}
              >
                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={20}
                  color={transaction === 'online' ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[styles.transactionText, transaction === 'online' && styles.transactionTextSelected]}>
                  비대면 거래
                </Text>
                {transaction === 'online' && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={styles.transactionCheck} />
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { backgroundColor: Colors.primaryDark }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>등록하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  draftText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  scroll: { paddingBottom: 20 },
  section: { padding: Spacing.md, gap: Spacing.sm },
  divider: { height: 8, backgroundColor: Colors.background },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  required: { color: Colors.primary },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoUploadBtn: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  photoThumb: { position: 'relative' },
  photoThumbImg: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
  },
  repBadge: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  repBadgeText: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  photoHint: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },

  inputWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  charCount: { fontSize: FontSize.xs, color: Colors.textMuted },

  priceInputWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  won: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },

  textareaWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 150,
  },
  textarea: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22, flex: 1 },
  textareaCount: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right', marginTop: 4 },

  locationInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 8,
  },
  locationInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  mapPreview: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  mapBg: {
    height: 130,
    backgroundColor: '#d4e6c3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapInfoBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.surface,
  },
  mapCenterName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  mapAddress: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  transactionRow: { flexDirection: 'row', gap: 12 },
  transactionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  transactionBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  transactionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    flex: 1,
  },
  transactionTextSelected: { color: Colors.primaryDark },
  transactionCheck: { position: 'absolute', top: 6, right: 6 },

  bottomBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: 54,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.elevated,
  },
  submitText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
});
