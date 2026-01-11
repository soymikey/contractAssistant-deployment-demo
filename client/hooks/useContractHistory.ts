import { useCallback, useEffect } from 'react';
import { useContractStore } from '@/stores/contractStore';

/**
 * Hook for managing contract history list
 */
export const useContractHistory = () => {
  const { contracts, isLoading, error, fetchContracts, deleteContract } = useContractStore();

  // Load contracts on mount
  useEffect(() => {
    fetchContracts();
  }, []);

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
