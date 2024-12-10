import { supabase } from '@/integrations/supabase/client';

export const uploadFileToStorage = async (file: File, userId: string) => {
  console.log('Uploading file to storage:', { fileName: file.name, userId });
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('content_library')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  console.log('File uploaded successfully:', data);
  const { data: { publicUrl } } = supabase.storage
    .from('content_library')
    .getPublicUrl(filePath);

  return {
    publicUrl,
    filePath,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type
  };
};