import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initializeStores, useAuthStore } from '../src/stores';
import { QueryClientWrapper } from '../src/providers/QueryClientWrapper';

/**
 * Root Layout Component
 * Sets up navigation stack and initializes app state
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  // Initialize stores on app startup
  useEffect(() => {
    const initialize = async () => {
      await initializeStores();
      setIsReady(true);
    };
    initialize();
  }, []);

  // Auth guard - redirect to appropriate screen based on auth state
  useEffect(() => {
    if (!isReady || !navigationState?.key) return; // Wait for store initialization and navigation to be ready

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      // User is not authenticated and trying to access protected routes
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated and on auth screens, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, navigationState, router, isReady]);

  return (
    <QueryClientWrapper>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Authentication screens */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* Main app with bottom tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Modal screens */}
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientWrapper>
  );
}
