import { supabase } from '@/integrations/supabase/client';

export const uploadFileToStorage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Starting file upload to storage:', {
      fileName: file.name,
      filePath,
      fileType: file.type,
      fileSize: file.size
    });
    
    const { error: uploadError } = await supabase.storage
      .from('content_library')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully, getting public URL');
    const { data: { publicUrl } } = supabase.storage
      .from('content_library')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFileToStorage:', error);
    return null;
  }
};