import { useState } from 'react';
import { useLibraryQuery } from './library/useLibraryQuery';
import { useLibraryMutations } from './library/useLibraryMutations';
import { useQueryClient } from '@tanstack/react-query';

export const useLibrary = () => {
  const [filter, setFilter] = useState('');
  const queryClient = useQueryClient();
  
  const { data: items = [], isLoading } = useLibraryQuery(filter);
  const mutations = useLibraryMutations();

  // Ensure mutations update the cache properly
  const enhancedMutations = {
    ...mutations,
    addItem: {
      ...mutations.addItem,
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        if (mutations.addItem.onSuccess) {
          mutations.addItem.onSuccess(data);
        }
      }
    },
    updateItem: {
      ...mutations.updateItem,
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        if (mutations.updateItem.onSuccess) {
          mutations.updateItem.onSuccess(data);
        }
      }
    },
    deleteItem: {
      ...mutations.deleteItem,
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        if (mutations.deleteItem.onSuccess) {
          mutations.deleteItem.onSuccess(data);
        }
      }
    },
    toggleStar: {
      ...mutations.toggleStar,
      onSuccess: async (data: any) => {
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        if (mutations.toggleStar.onSuccess) {
          mutations.toggleStar.onSuccess(data);
        }
      }
    }
  };

  return {
    items,
    isLoading,
    filter,
    setFilter,
    ...enhancedMutations,
  };
};