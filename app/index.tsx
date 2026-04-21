import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/login'} />;
}
