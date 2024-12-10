export type ContentItemType = 'link' | 'image' | 'whatsapp' | 'video' | 'note';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  content: string;
  starred: boolean;
  created_at?: string;
  user_id: string;
}

export type NewContentItem = Omit<ContentItem, 'id' | 'created_at'>;