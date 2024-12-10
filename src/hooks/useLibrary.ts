import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LibraryItem, CreateLibraryItemInput, transformToLibraryItem } from '@/types/library';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

export function useLibrary() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['library-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching library items:', error);
        throw error;
      }

      return (data?.map(transformToLibraryItem).filter(Boolean) as LibraryItem[]) || [];
    }
  });

  const createItem = useMutation({
    mutationFn: async (input: CreateLibraryItemInput) => {
      if (!user?.id) throw new Error('User not authenticated');

      const itemWithUserId = {
        ...input,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('library_items')
        .insert([itemWithUserId])
        .select()
        .single();

      if (error) throw error;
      return transformToLibraryItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-items'] });
      toast({
        title: "פריט נוסף בהצלחה",
        description: "הפריט נוסף לספריית התוכן שלך",
      });
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להוסיף את הפריט",
        variant: "destructive",
      });
    }
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-items'] });
      toast({
        title: "פריט נמחק",
        description: "הפריט נמחק מספריית התוכן שלך",
      });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו למחוק את הפריט",
        variant: "destructive",
      });
    }
  });

  const toggleStar = useMutation({
    mutationFn: async ({ id, is_starred }: { id: string; is_starred: boolean }) => {
      const { error } = await supabase
        .from('library_items')
        .update({ is_starred })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-items'] });
    },
    onError: (error) => {
      console.error('Error updating star:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לעדכן את הסימון",
        variant: "destructive",
      });
    }
  });

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.content.toLowerCase().includes(filter.toLowerCase())
  );

  return {
    items: filteredItems,
    isLoading,
    filter,
    setFilter,
    createItem,
    deleteItem,
    toggleStar
  };
}