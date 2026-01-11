import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Contract } from '@/types/store';

interface ContractListProps {
  contracts: Contract[];
  onContractPress: (id: string) => void;
  onDeleteContract: (id: string) => void;
  isLoading: boolean;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  onContractPress,
  onDeleteContract,
  isLoading,
}) => {
  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Contract', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDeleteContract(id),
      },
    ]);
  };

  if (contracts.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No recent contracts found</Text>
      </View>
    );
  }

  return (
    <>
      {contracts.map((contract) => (
        <TouchableOpacity
          key={contract.id}
          style={styles.contractItem}
          activeOpacity={0.7}
          onPress={() => onContractPress(contract.id)}
        >
          <View style={styles.contractIcon}>
            <Text style={styles.contractIconText}>📋</Text>
          </View>
          <View style={styles.contractInfo}>
            <Text style={styles.contractName} numberOfLines={1}>
              {contract.name}
            </Text>
            <Text style={styles.contractMeta}>
              {new Date(contract.uploadedAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.rightActions}>
            <View
              style={[
                styles.contractStatus,
                contract.status === 'completed' && styles.statusCompleted,
                contract.status === 'failed' && styles.statusFailed,
              ]}
            >
              <Text style={styles.contractStatusText}>{contract.status}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(contract.id, contract.name)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  contractItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contractIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractIconText: {
    fontSize: 20,
  },
  contractInfo: {
    flex: 1,
  },
  contractName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contractMeta: {
    fontSize: 11,
    color: '#999',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contractStatus: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  contractStatusText: {
    fontSize: 11,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusCompleted: {
    backgroundColor: '#e6fffa',
  },
  statusFailed: {
    backgroundColor: '#fff5f5',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});
