import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useContractStore } from '@/stores/contractStore';

/**
 * Hook for managing contract history list
 */
export const useContractHistory = () => {
  const { contracts, isLoading, error, fetchContracts, deleteContract } = useContractStore();
  const { isAuthenticated } = useAuthStore();

  // Load contracts on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchContracts();
    }
  }, [isAuthenticated, fetchContracts]);

  const refreshHistory = useCallback(async () => {
    await fetchContracts();
  }, [fetchContracts]);

  const deleteHistoryItem = useCallback(
    async (id: string) => {
      await deleteContract(id);
    },
    [deleteContract]
  );

  return {
    contracts,
    isLoading,
    error,
    refreshHistory,
    deleteHistoryItem,
  };
};
