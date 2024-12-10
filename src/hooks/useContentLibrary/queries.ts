import { supabase } from '@/integrations/supabase/client';
import { ContentItem, ContentItemType } from '@/types/content';
import { uploadFileToStorage } from '@/utils/fileStorage';

export const fetchUserItems = async (userId: string) => {
  console.log('Fetching items for user:', userId);
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }

  return data;
};

export const insertItem = async (userId: string, content: string, type: ContentItemType) => {
  console.log('Inserting item:', { userId, content, type });
  const { data, error } = await supabase
    .from('content_items')
    .insert([{
      type,
      content,
      user_id: userId,
      starred: false
    }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting item:', error);
    throw error;
  }

  console.log('Item inserted successfully:', data);
  return data;
};

export const uploadFile = async (userId: string, file: File) => {
  console.log('Processing file upload:', { fileName: file.name, userId });
  
  const publicUrl = await uploadFileToStorage(file, userId);
  if (!publicUrl) {
    console.error('Failed to get public URL for uploaded file');
    throw new Error('Failed to upload file');
  }

  console.log('File uploaded successfully, public URL:', publicUrl);
  const type: ContentItemType = file.type.startsWith('image/') ? 'image' : 'video';
  return await insertItem(userId, publicUrl, type);
};

export const deleteItem = async (id: string) => {
  console.log('Deleting item:', id);
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const updateItemStar = async (id: string, starred: boolean) => {
  console.log('Updating star:', { id, starred });
  const { error } = await supabase
    .from('content_items')
    .update({ starred })
    .eq('id', id);

  if (error) {
    console.error('Error updating star:', error);
    throw error;
  }
};

export const updateItemContent = async (id: string, content: string) => {
  console.log('Updating content:', { id, content });
  const { error } = await supabase
    .from('content_items')
    .update({ content })
    .eq('id', id);

  if (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};