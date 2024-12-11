import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LibraryItem } from '@/types/library';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useLibraryQuery = (filter: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['library-items', filter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return [];
      }

      let query = supabase
        .from('library_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter) {
        query = query.or(`title.ilike.%${filter}%,content.ilike.%${filter}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching library items:', error);
        toast({
          title: "שגיאה בטעינת פריטים",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      // Transform the data to ensure all fields are properly typed
      const transformedData = data.map((item): LibraryItem => ({
        ...item,
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
        is_starred: item.is_starred || false,
        file_details: item.file_details,
        created_at: item.created_at
      }));

      return transformedData;
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });
};