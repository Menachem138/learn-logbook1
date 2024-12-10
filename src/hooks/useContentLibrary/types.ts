import { ContentItem, ContentItemType } from '@/types/content';

export interface ContentLibraryState {
  items: ContentItem[];
  loading: boolean;
}

export interface UseContentLibraryReturn {
  items: ContentItem[];
  loading: boolean;
  loadItems: () => Promise<void>;
  addItem: (content: string, type: ContentItemType) => Promise<ContentItem | null>;
  addFile: (file: File) => Promise<ContentItem | null>;
  removeItem: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
}