import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LibraryItemType } from '@/types/library';
import { cloudinaryResponseToJson, uploadToCloudinary } from '@/utils/cloudinaryUtils';
import { CloudinaryResponse } from '@/types/cloudinary';

export const useLibraryBaseMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: async ({ title, content, type, files }: { 
      title: string;
      content: string;
      type: LibraryItemType;
      files?: File | File[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let cloudinaryResponses: CloudinaryResponse[] = [];

      if (files) {
        const filesToUpload = Array.isArray(files) ? files : [files];
        console.log('Uploading files to Cloudinary:', filesToUpload);
        
        const uploadPromises = filesToUpload.map(file => uploadToCloudinary(file));
        cloudinaryResponses = await Promise.all(uploadPromises);
        
        console.log('Cloudinary upload responses:', cloudinaryResponses);
      }

      const { error } = await supabase
        .from('library_items')
        .insert({
          title,
          content,
          type,
          cloudinary_data: cloudinaryResponses.length > 0
            ? type === 'image_gallery' 
              ? cloudinaryResponses.map(cloudinaryResponseToJson)
              : cloudinaryResponseToJson(cloudinaryResponses[0])
            : null,
          user_id: user.id,
          file_details: cloudinaryResponses.length > 0 
            ? type === 'image_gallery'
              ? {
                  paths: cloudinaryResponses.map(r => r.url),
                  types: Array.isArray(files) ? files.map(f => f.type) : [files.type],
                  names: Array.isArray(files) ? files.map(f => f.name) : [files.name],
                  sizes: Array.isArray(files) ? files.map(f => f.size) : [files.size],
                }
              : {
                  path: cloudinaryResponses[0].url,
                  type: Array.isArray(files) ? files[0].type : files.type,
                  name: Array.isArray(files) ? files[0].name : files.name,
                  size: Array.isArray(files) ? files[0].size : files.size,
                }
            : null,
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

  return { addItem };
};
