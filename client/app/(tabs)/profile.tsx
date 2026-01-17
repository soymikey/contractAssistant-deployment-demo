import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SignOutButton from '@/components/social-auth-buttons/sign-out-button';
import { useAuthContext } from '@/hooks/use-auth-context';

/**
 * Profile Tab Screen
 * Displays user profile and settings with Cool Slate design
 */
export default function ProfileScreen() {
  const { profile } = useAuthContext();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0).toUpperCase() || '👤'}
          </Text>
        </LinearGradient>
        <Text style={styles.userName}>{profile?.full_name || 'Username'}</Text>
        <Text style={styles.userEmail}>{profile?.email || 'user@example.com'}</Text>
      </View>

      {/* Settings Section Label */}
      <Text style={styles.sectionLabel}>SETTINGS</Text>

      {/* Menu Options - Each card is separate */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuIcon}>🛡️</Text>
          <Text style={styles.menuText}>Privacy & Security</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Feedback</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <SignOutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Cool slate background (slate-100)
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarText: {
    fontSize: 36,
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#94a3b8', // Slate 400
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8', // Slate 400
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    padding: 16,
    marginBottom: 12,
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
  menuItemMiddle: {
    // Same styling as menuItem for consistency
  },
  menuItemLast: {
    // Same styling as menuItem for consistency
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  menuArrow: {
    fontSize: 18,
    color: '#cbd5e1', // Slate 300
  },
});
