import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORY_PILLS = ['헬스', '골프', '수영', '요가', '필라테스'];

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);

  const handleLogin = () => {
    login();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.logoCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="fitness" size={32} color="#fff" />
          </LinearGradient>
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark}>스포츠마켓</Text>
        <Text style={styles.tagline}>우리 동네 스포츠 회원권, 직거래로 알뜰하게</Text>

        {/* Category pills */}
        <View style={styles.pillsRow}>
          {CATEGORY_PILLS.map((pill) => (
            <View key={pill} style={styles.pill}>
              <Text style={styles.pillText}>{pill}</Text>
            </View>
          ))}
        </View>

        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('@/assets/images/login-hero.png')}
            style={styles.illustration}
            contentFit="cover"
            transition={300}
          />
        </View>

        {/* Login Buttons */}
        <View style={styles.buttons}>
          {/* Kakao */}
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnKakao, pressed && { opacity: 0.85 }]}
            onPress={handleLogin}
          >
            <Ionicons name="chatbubble" size={20} color="#000" />
            <Text style={[styles.btnText, { color: '#000' }]}>카카오로 3초 만에 시작하기</Text>
          </Pressable>

          {/* Apple */}
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnApple, pressed && { opacity: 0.85 }]}
            onPress={handleLogin}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={[styles.btnText, { color: '#fff' }]}>Apple로 로그인</Text>
          </Pressable>

          {/* Google */}
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnGoogle, pressed && { opacity: 0.85 }]}
            onPress={handleLogin}
          >
            <Ionicons name="logo-google" size={20} color={Colors.primary} />
            <Text style={[styles.btnText, { color: Colors.textPrimary }]}>Google로 로그인</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email */}
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnEmail, pressed && { opacity: 0.85 }]}
            onPress={handleLogin}
          >
            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            <Text style={[styles.btnText, { color: Colors.primary }]}>이메일로 가입 / 로그인</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          로그인함으로써{' '}
          <Text style={styles.footerLink}>이용약관</Text>
          {' '}및{' '}
          <Text style={styles.footerLink}>개인정보처리방침</Text>
          에 동의하게 됩니다.
        </Text>
        <Text style={styles.footer}>
          이미 계정이 있으신가요?{' '}
          <Text style={[styles.footerLink, { color: Colors.primary, fontWeight: FontWeight.bold }]} onPress={handleLogin}>
            로그인
          </Text>
        </Text>
        <Text style={styles.version}>v 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  logoWrap: { marginBottom: Spacing.md },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: FontSize.h0,
    fontWeight: FontWeight.extrabold,
    color: Colors.primaryDark,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  illustrationWrap: {
    width: 220,
    height: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primaryLight,
  },
  illustration: { width: '100%', height: '100%' },
  buttons: { width: '100%', gap: 10, marginBottom: Spacing.lg },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: Radius.md,
    gap: 10,
  },
  btnKakao: { backgroundColor: Colors.kakao },
  btnApple: { backgroundColor: Colors.black },
  btnGoogle: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnEmail: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  btnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 2,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: FontSize.sm, color: Colors.textMuted },
  footer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  footerLink: { color: Colors.textSecondary, textDecorationLine: 'underline' },
  version: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
