import { useCallback, useEffect } from 'react';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useContractStore } from '@/stores/contractStore';

/**
 * Hook for managing contract history list
 */
export const useContractHistory = () => {
  const { contracts, isLoading, error, fetchContracts, deleteContract } = useContractStore();
  const { isLoggedIn } = useAuthContext();

  // Load contracts on mount
  useEffect(() => {
    if (isLoggedIn) {
      // Call fetchContracts directly from store to avoid dependency issues
      useContractStore.getState().fetchContracts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

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
