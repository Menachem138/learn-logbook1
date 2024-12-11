export type LibraryItemType = 'link' | 'image' | 'whatsapp' | 'video' | 'note';

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  content: string;
  is_starred: boolean;
  user_id: string;
  created_at: string;
  file_details?: {
    path?: string;
    name?: string;
    size?: number;
    type?: string;
  } | null;
}