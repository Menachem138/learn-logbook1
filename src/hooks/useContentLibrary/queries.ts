import { supabase } from '@/integrations/supabase/client';
import { ContentItem, ContentItemType, RawContentItem, transformToContentItems } from '@/types/content';

export const fetchUserItems = async (userId: string): Promise<ContentItem[]> => {
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

  return transformToContentItems(data as RawContentItem[]);
};

export const insertItem = async (
  userId: string,
  type: ContentItemType,
  content: string,
  fileDetails?: {
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  }
): Promise<ContentItem> => {
  console.log('Inserting item:', { userId, type, content, fileDetails });
  
  const { data, error } = await supabase
    .from('content_items')
    .insert([{
      user_id: userId,
      type,
      content,
      file_path: fileDetails?.filePath,
      file_name: fileDetails?.fileName,
      file_size: fileDetails?.fileSize,
      mime_type: fileDetails?.mimeType,
      starred: false
    }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting item:', error);
    throw error;
  }

  const contentItem = transformToContentItem(data as RawContentItem);
  if (!contentItem) {
    throw new Error('Invalid content type returned from database');
  }

  return contentItem;
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
