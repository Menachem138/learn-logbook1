import { useState } from 'react';
import { useLibraryQuery } from './library/useLibraryQuery';
import { useLibraryMutations } from './library/useLibraryMutations';
import { useQueryClient } from '@tanstack/react-query';
import { LibraryItem } from '@/types/library';

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
      mutate: async (data: Parameters<typeof mutations.addItem.mutateAsync>[0]) => {
        const result = await mutations.addItem.mutateAsync(data);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
      }
    },
    updateItem: {
      ...mutations.updateItem,
      mutate: async (data: Parameters<typeof mutations.updateItem.mutateAsync>[0]) => {
        const result = await mutations.updateItem.mutateAsync(data);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
      }
    },
    deleteItem: {
      ...mutations.deleteItem,
      mutate: async (data: Parameters<typeof mutations.deleteItem.mutateAsync>[0]) => {
        const result = await mutations.deleteItem.mutateAsync(data);
        await queryClient.invalidateQueries({ queryKey: ['library-items'] });
        return result;
      }
    },
    toggleStar: {
      ...mutations.toggleStar,
      mutate: async (data: Parameters<typeof mutations.toggleStar.mutateAsync>[0]) => {
        const result = await mutations.toggleStar.mutateAsync(data);
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