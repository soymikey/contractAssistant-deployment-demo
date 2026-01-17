import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContractStore, useAnalysisStore } from '@/stores';
import { useContractHistory } from '@/hooks';

type FilterTab = 'all' | 'favorites';

/**
 * History Tab Screen (Replaces Favorites)
 * Displays all contracts with search and filter capabilities
 */
export default function HistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const { contracts, isLoading, refreshHistory, deleteHistoryItem } = useContractHistory();
  const favorites = useContractStore((state) => state.favorites);
  const toggleFavorite = useContractStore((state) => state.toggleFavorite);

  // Filter contracts based on search and tab
  const filteredContracts = useMemo(() => {
    let result = contracts;

    // Apply favorites filter
    if (activeFilter === 'favorites') {
      result = result.filter((contract) => favorites.includes(contract.id));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((contract) => contract.name.toLowerCase().includes(query));
    }

    return result;
  }, [contracts, activeFilter, favorites, searchQuery]);

  // Group contracts by date
  const groupedContracts = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups: { label: string; contracts: typeof filteredContracts }[] = [];

    const thisWeek = filteredContracts.filter((c) => new Date(c.updatedAt) >= oneWeekAgo);
    const lastMonth = filteredContracts.filter(
      (c) => new Date(c.updatedAt) < oneWeekAgo && new Date(c.updatedAt) >= oneMonthAgo
    );
    const older = filteredContracts.filter((c) => new Date(c.updatedAt) < oneMonthAgo);

    if (thisWeek.length > 0) groups.push({ label: 'This Week', contracts: thisWeek });
    if (lastMonth.length > 0) groups.push({ label: 'Last Month', contracts: lastMonth });
    if (older.length > 0) groups.push({ label: 'Older', contracts: older });

    return groups;
  }, [filteredContracts]);

  // Handle contract press - navigate to analysis
  const handleContractPress = useCallback(
    (id: string) => {
      const { loadHistoryResult } = useAnalysisStore.getState();
      loadHistoryResult(id);
      router.push('/analysis');
    },
    [router]
  );

  // Handle star toggle
  const handleToggleFavorite = useCallback(
    (id: string, event: any) => {
      event.stopPropagation();
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  // Handle delete
  const handleDelete = useCallback(
    (id: string, name: string) => {
      Alert.alert('Delete Contract', `Are you sure you want to delete "${name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHistoryItem(id),
        },
      ]);
    },
    [deleteHistoryItem]
  );

  // Format relative time
  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshHistory} />}
    >
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contracts..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'favorites' && styles.filterTabActive]}
          onPress={() => setActiveFilter('favorites')}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === 'favorites' && styles.filterTabTextActive,
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contract List */}
      {filteredContracts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{activeFilter === 'favorites' ? '⭐' : '📋'}</Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'favorites'
              ? 'No favorite contracts yet'
              : searchQuery
                ? 'No contracts match your search'
                : 'No contracts found'}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeFilter === 'favorites'
              ? 'Tap the star icon on any contract to add it here'
              : 'Upload a contract to get started'}
          </Text>
        </View>
      ) : (
        groupedContracts.map((group) => (
          <View key={group.label}>
            <Text style={styles.sectionLabel}>{group.label}</Text>
            {group.contracts.map((contract) => (
              <TouchableOpacity
                key={contract.id}
                style={styles.contractItem}
                activeOpacity={0.7}
                onPress={() => handleContractPress(contract.id)}
                onLongPress={() => handleDelete(contract.id, contract.name)}
              >
                <View style={styles.contractIcon}>
                  <Text style={styles.contractIconText}>📋</Text>
                </View>
                <View style={styles.contractInfo}>
                  <Text style={styles.contractName} numberOfLines={1}>
                    {contract.name}
                  </Text>
                  <Text style={styles.contractMeta}>{formatRelativeTime(contract.updatedAt)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={(e) => handleToggleFavorite(contract.id, e)}
                >
                  <Text
                    style={[styles.starIcon, favorites.includes(contract.id) && styles.starActive]}
                  >
                    {favorites.includes(contract.id) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Cool Slate background
  },
  contentContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glass effect
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)', // Slate border
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    paddingVertical: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: '#64748b',
    padding: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Lighter glass
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // Slate gradient color
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b', // Slate-500
  },
  filterTabTextActive: {
    fontWeight: '700',
    color: '#ffffff', // White for active
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8', // Slate-400
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
  },
  contractItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glass effect
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  contractIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(226, 232, 240, 0.5)', // Lighter slate
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractIconText: {
    fontSize: 22,
  },
  contractInfo: {
    flex: 1,
  },
  contractName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000', // Black for titles
    marginBottom: 4,
  },
  contractMeta: {
    fontSize: 12,
    color: '#64748b', // Slate-500
  },
  starButton: {
    padding: 8,
  },
  starIcon: {
    fontSize: 22,
    color: '#cbd5e1', // Slate-300 for inactive
  },
  starActive: {
    color: '#f59e0b', // Amber for active favorites
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
