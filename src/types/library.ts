export type LibraryItemType = 'link' | 'note' | 'image' | 'video' | 'whatsapp';

export interface LibraryItem {
  id: string;
  title: string;
  content: string;
  type: LibraryItemType;
  is_starred: boolean;
  file_details?: {
    path?: string;
    name?: string;
    size?: number;
    type?: string;
  } | null;
  created_at: string;
}

export interface CreateLibraryItemInput {
  title: string;
  content: string;
  type: LibraryItemType;
  file_details?: {
    path?: string;
    name?: string;
    size?: number;
    type?: string;
  };
}