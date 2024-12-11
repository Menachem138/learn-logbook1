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
      mutate: async (...args) => {
        const result = await mutations.addItem.mutateAsync(...args);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
      }
    },
    updateItem: {
      ...mutations.updateItem,
      mutate: async (...args) => {
        const result = await mutations.updateItem.mutateAsync(...args);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
      }
    },
    deleteItem: {
      ...mutations.deleteItem,
      mutate: async (...args) => {
        const result = await mutations.deleteItem.mutateAsync(...args);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
      }
    },
    toggleStar: {
      ...mutations.toggleStar,
      mutate: async (...args) => {
        const result = await mutations.toggleStar.mutateAsync(...args);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
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