import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadToCloudinary, deleteFromCloudinary, CloudinaryResponse } from '@/utils/cloudinaryStorage';
import { LibraryItemType } from '@/types/library';
import { Json } from '@/integrations/supabase/types';

// Helper function to convert CloudinaryResponse to Json
const cloudinaryResponseToJson = (response: CloudinaryResponse | null): Json => {
  if (!response) return null;
  return {
    publicId: response.publicId,
    url: response.url,
    resourceType: response.resourceType,
    format: response.format,
    size: response.size,
  } as Json;
};

// Helper function to convert Json to CloudinaryResponse
const jsonToCloudinaryResponse = (json: Json): CloudinaryResponse | null => {
  if (!json || typeof json !== 'object') return null;
  const data = json as Record<string, any>;
  return {
    publicId: data.publicId,
    url: data.url,
    resourceType: data.resourceType,
    format: data.format,
    size: data.size,
  };
};

export const useLibraryMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: async ({ title, content, type, file }: { 
      title: string;
      content: string;
      type: LibraryItemType;
      file?: File;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let cloudinaryResponse: CloudinaryResponse | null = null;

      if (file) {
        cloudinaryResponse = await uploadToCloudinary(file);
      }

      const { error } = await supabase
        .from('library_items')
        .insert({
          title,
          content,
          type,
          cloudinary_data: cloudinaryResponseToJson(cloudinaryResponse),
          user_id: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-items'] });
      toast({
        title: "הפריט נוסף בהצלחה",
      });
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast({
        title: "שגיאה בהוספת הפריט",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, title, content, type, file }: {
      id: string;
      title: string;
      content: string;
      type: LibraryItemType;
      file?: File;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: currentItem } = await supabase
        .from('library_items')
        .select('cloudinary_data')
        .eq('id', id)
        .single();

      let cloudinaryResponse = currentItem?.cloudinary_data ? 
        jsonToCloudinaryResponse(currentItem.cloudinary_data as Json) : 
        null;

      if (file) {
        if (cloudinaryResponse?.publicId) {
          await deleteFromCloudinary(cloudinaryResponse.publicId);
        }
        cloudinaryResponse = await uploadToCloudinary(file);
      }

      const { error } = await supabase
        .from('library_items')
        .update({
          title,
          content,
          type,
          cloudinary_data: cloudinaryResponseToJson(cloudinaryResponse),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-items'] });
      toast({
        title: "הפריט עודכן בהצלחה",
      });
    },
    onError: (error) => {
      console.error('Error updating item:', error);
      toast({
        title: "שגיאה בעדכון הפריט",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      // Get the item to delete its file if it exists
      const { data: item } = await supabase
        .from('library_items')
        .select('cloudinary_data')
        .eq('id', id)
        .single();

      const cloudinaryData = (item?.cloudinary_data as CloudinaryData | null) ?? null;
      if (cloudinaryData?.publicId) {
        await deleteFromCloudinary(cloudinaryData.publicId);
      }

      const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-items'] });
      toast({
        title: "הפריט נמחק בהצלחה",
      });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast({
        title: "שגיאה במחיקת הפריט",
        description: error.message,
        variant: "destructive",
      });
    },
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
      console.error('Error toggling star:', error);
      toast({
        title: "שגיאה בעדכון הפריט",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addItem,
    updateItem,
    deleteItem,
    toggleStar,
  };
};