import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ContractStore, Contract, ContractAnalysis } from '@/types/store';

const STORAGE_KEYS = {
  FAVORITES: '@contractAssistant:favorites',
};

/**
 * Contract Store
 * Manages contracts, analysis results, and favorites
 */
export const useContractStore = create<ContractStore>((set, get) => ({
  // Initial state
  contracts: [],
  currentContract: null,
  currentAnalysis: null,
  favorites: [],
  isLoading: false,
  error: null,

  // Actions
  fetchContracts: async () => {
    set({ isLoading: true, error: null });

    try {
      const { contractService } = await import('@/services/contractService');
      const response = await contractService.getContracts();

      // Map server fields (fileName) to client fields (name)
      // Note: server response structure might vary, adjust mapping as needed
      const contracts: Contract[] = (response.data || []).map((c: any) => ({
        ...c,
        name: c.fileName || c.name, // Handle both for safety
      }));

      set({ contracts: contracts, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contracts';
      set({ isLoading: false, error: errorMessage });

      // Don't re-throw 401 errors to avoid red screen, they are handled by interceptor alerts
      const { isApiError } = await import('@/services/apiV2');
      if (isApiError(error) && error.response?.status === 401) {
        return;
      }

      throw error;
    }
  },

  fetchContractById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      // const response = await contractService.getContractById(id);

      const contract = get().contracts.find((c) => c.id === id);
      if (!contract) {
        throw new Error('Contract not found');
      }

      set({ currentContract: contract, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contract';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  fetchAnalysis: async (contractId: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      // const response = await contractService.getAnalysis(contractId);

      // Mock analysis data aligned with English UI design
      const mockAnalysis: ContractAnalysis = {
        id: `analysis-${contractId}`,
        contractId,
        overview: {
          type: 'Employment Contract',
          parties: ['Party A (Company)', 'Party B (Employee)'],
          startDate: '2025-01-01',
          endDate: '2027-12-31',
          duration: '24 months',
          pages: 5,
        },
        risks: [
          {
            id: 'risk-1',
            level: 'high',
            title: 'Vague Termination Compensation',
            description:
              'Termination compensation standards not clearly defined, may lead to disputes',
            recommendation: 'Recommend supplementing per Labor Law Article 47',
            legalReference: 'Labor Law Article 47',
          },
          {
            id: 'risk-2',
            level: 'medium',
            title: 'Excessive Confidentiality Period',
            description: '10-year confidentiality period exceeds legal requirements',
            recommendation: 'Recommend changing to 3-5 years',
          },
          {
            id: 'risk-3',
            level: 'low',
            title: 'Incomplete Probation Terms',
            description: 'Probation assessment criteria not clearly described',
            recommendation: 'Recommend refining probation assessment standards and procedures',
          },
        ],
        suggestions: [
          {
            id: 'suggestion-1',
            type: 'add',
            title: 'Add Arbitration Clause',
            description:
              'Add arbitration clause and jurisdiction agreement to clarify dispute resolution',
            priority: 'high',
          },
          {
            id: 'suggestion-2',
            type: 'modify',
            title: 'Adjust Confidentiality Period',
            description: 'Adjust confidentiality period to legal range (3-5 years)',
            priority: 'high',
          },
        ],
        keyTerms: [
          {
            id: 'term-1',
            category: 'Compensation',
            label: 'Salary',
            value: '$15,000/month',
          },
          {
            id: 'term-2',
            category: 'Benefits',
            label: 'Insurance',
            value: 'Full Insurance',
          },
          {
            id: 'term-3',
            category: 'Work Arrangement',
            label: 'Work Location',
            value: 'Beijing HQ',
          },
        ],
        summary:
          'This employment contract has a complete overall structure, but has issues such as vague termination compensation clauses and excessive confidentiality periods. It is recommended to correct these promptly to reduce legal risks.',
      };

      set({ currentAnalysis: mockAnalysis, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analysis';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  addContract: (contract: Contract) => {
    set((state) => ({
      contracts: [contract, ...state.contracts],
    }));
  },

  updateContract: (id: string, updates: Partial<Contract>) => {
    set((state) => ({
      contracts: state.contracts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      currentContract:
        state.currentContract?.id === id
          ? { ...state.currentContract, ...updates }
          : state.currentContract,
    }));
  },

  deleteContract: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { contractService } = await import('@/services/contractService');
      await contractService.deleteContract(id);

      set((state) => ({
        contracts: state.contracts.filter((c) => c.id !== id),
        favorites: state.favorites.filter((fid) => fid !== id),
        currentContract: state.currentContract?.id === id ? null : state.currentContract,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contract';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  toggleFavorite: async (contractId: string) => {
    try {
      // Call the API to toggle favorite on the server
      const { favoriteService } = await import('@/services/favoriteService');
      const result = await favoriteService.toggleFavorite(contractId);

      // Update local state based on server response
      set((state) => {
        const newFavorites = result.isFavorited
          ? [...state.favorites, contractId]
          : state.favorites.filter((id) => id !== contractId);

        // Persist to AsyncStorage
        AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));

        return { favorites: newFavorites };
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  },

  setCurrentContract: (contract: Contract | null) => {
    set({ currentContract: contract });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearContracts: () => {
    set({
      contracts: [],
      currentContract: null,
      currentAnalysis: null,
      error: null,
    });
  },

  /**
   * Fetch favorites from the server
   */
  fetchFavorites: async () => {
    try {
      const { favoriteService } = await import('@/services/favoriteService');
      const favorites = await favoriteService.getFavorites();

      // Extract contract IDs from the favorites response
      const favoriteIds = favorites.map((fav) => fav.contractId);

      set({ favorites: favoriteIds });

      // Persist to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      // Fall back to AsyncStorage if API fails
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (favoritesJson) {
        const favorites: string[] = JSON.parse(favoritesJson);
        set({ favorites });
      }
    }
  },
}));

/**
 * Restore favorites from server on app startup
 * Falls back to AsyncStorage if API call fails
 */
export const restoreFavorites = async () => {
  try {
    // Try to fetch from server first
    await useContractStore.getState().fetchFavorites();
  } catch (error) {
    console.error('Failed to restore favorites from server:', error);
    // Fallback to AsyncStorage
    try {
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (favoritesJson) {
        const favorites: string[] = JSON.parse(favoritesJson);
        useContractStore.setState({ favorites });
      }
    } catch (storageError) {
      console.error('Failed to restore favorites from AsyncStorage:', storageError);
    }
  }
};
