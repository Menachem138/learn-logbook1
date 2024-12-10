export type ContentItemType = 'link' | 'image' | 'whatsapp' | 'video' | 'note';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  content: string;
  starred: boolean | null;
  user_id: string;
  created_at: string;
  file_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

export type NewContentItem = Omit<ContentItem, 'id' | 'created_at'>;

// Type guard to check if a string is a valid ContentItemType
export function isContentItemType(type: string): type is ContentItemType {
  return ['link', 'image', 'whatsapp', 'video', 'note'].includes(type);
}

// Raw data type from database
export interface RawContentItem {
  id: string;
  type: string;
  content: string;
  starred: boolean | null;
  user_id: string;
  created_at: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
}

// Function to validate and transform raw data into ContentItem
export function transformToContentItem(item: RawContentItem): ContentItem | null {
  if (!isContentItemType(item.type)) {
    console.error('Invalid content type:', item.type);
    return null;
  }

  return {
    id: item.id,
    type: item.type,
    content: item.content,
    starred: item.starred,
    user_id: item.user_id,
    created_at: item.created_at,
    file_path: item.file_path,
    file_name: item.file_name,
    file_size: item.file_size,
    mime_type: item.mime_type
  };
}

// Function to validate an array of raw items
export function transformToContentItems(items: RawContentItem[]): ContentItem[] {
  return items
    .map(transformToContentItem)
    .filter((item): item is ContentItem => item !== null);
}