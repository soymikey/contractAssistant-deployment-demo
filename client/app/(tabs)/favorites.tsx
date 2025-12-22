import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useContractStore } from '../../src/stores';

/**
 * Favorites Tab Screen
 * Displays saved/favorited contracts
 * TODO: Implement full favorites UI with contract cards
 */
export default function FavoritesScreen() {
  const contracts = useContractStore((state) => state.contracts);
  const favorites = useContractStore((state) => state.favorites);

  const favoriteContracts = contracts.filter((contract) => favorites.includes(contract.id));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Saved Contracts</Text>
        <Text style={styles.description}>
          {favoriteContracts.length > 0
            ? `You have ${favoriteContracts.length} saved contract${favoriteContracts.length > 1 ? 's' : ''}`
            : 'Save contracts to quickly access them later'}
        </Text>

        {favoriteContracts.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>❤️</Text>
            <Text style={styles.placeholderText}>No saved contracts yet</Text>
            <Text style={styles.placeholderSubtext}>
              Tap the heart icon on any contract to save it
            </Text>
          </View>
        ) : (
          <View style={styles.contractList}>
            {favoriteContracts.map((contract) => (
              <TouchableOpacity key={contract.id} style={styles.contractCard}>
                <View style={styles.contractIcon}>
                  <Text style={styles.contractIconText}>📄</Text>
                </View>
                <View style={styles.contractInfo}>
                  <Text style={styles.contractName}>{contract.name}</Text>
                  <Text style={styles.contractDate}>
                    Uploaded: {new Date(contract.uploadedAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  contractList: {
    gap: 12,
  },
  contractCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contractIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contractIconText: {
    fontSize: 24,
  },
  contractInfo: {
    flex: 1,
  },
  contractName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contractDate: {
    fontSize: 14,
    color: '#999',
  },
});
