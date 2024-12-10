import { Json } from '@/integrations/supabase/types';

export type LibraryItemType = 'link' | 'note' | 'image' | 'video' | 'whatsapp';

export interface LibraryItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: LibraryItemType;
  is_starred: boolean | null;
  file_details: Json | null;
  created_at: string;
}

export interface CreateLibraryItemInput {
  user_id: string;
  title: string;
  content: string;
  type: LibraryItemType;
  file_details?: Json;
  is_starred?: boolean;
}

export function isLibraryItemType(type: string): type is LibraryItemType {
  return ['link', 'note', 'image', 'video', 'whatsapp'].includes(type);
}

export function transformToLibraryItem(raw: any): LibraryItem | null {
  if (!isLibraryItemType(raw.type)) {
    console.error('Invalid library item type:', raw.type);
    return null;
  }

  return {
    id: raw.id,
    user_id: raw.user_id,
    title: raw.title,
    content: raw.content,
    type: raw.type,
    is_starred: raw.is_starred,
    file_details: raw.file_details,
    created_at: raw.created_at
  };
}