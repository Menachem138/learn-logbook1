import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LibraryItem } from '@/types/library';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FileDetails {
  path: string;
  name: string;
  size: number;
  type: string;
}

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
        type: item.type as LibraryItem['type'],
        is_starred: item.is_starred || false,
        file_details: item.file_details ? {
          path: (item.file_details as FileDetails).path,
          name: (item.file_details as FileDetails).name,
          size: (item.file_details as FileDetails).size,
          type: (item.file_details as FileDetails).type,
        } : null,
        created_at: item.created_at
      }));

      return transformedData;
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes (replaces cacheTime)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};