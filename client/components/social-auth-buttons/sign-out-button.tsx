import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

async function onSignOutButtonPress() {
 const { error } = await supabase.auth.signOut()

 if (error) {
   console.error('Error signing out:', error)
 }
}

export default function SignOutButton() {
  const { isLoggedIn } = useAuthContext();

  return (
    <TouchableOpacity
      disabled={!isLoggedIn}
      onPress={onSignOutButtonPress}
      style={[styles.button, !isLoggedIn && styles.buttonDisabled]}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, !isLoggedIn && styles.buttonTextDisabled]}>
        Sign Out
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155', // Slate 700
  },
  buttonTextDisabled: {
    color: '#94a3b8', // Slate 400
  },
});