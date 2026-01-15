import { useEffect } from 'react';
import { useAuthContext } from '@/hooks/use-auth-context';
import { SplashScreen } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      console.log('SplashScreenController - Hiding splash screen');
      SplashScreen.hideAsync().catch((error) => {
        console.warn('Error hiding splash screen:', error);
      });
    }
  }, [isLoading]);

  return null;
}
