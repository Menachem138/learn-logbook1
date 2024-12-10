export type ContentItemType = 'link' | 'image' | 'whatsapp' | 'video' | 'note';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  content: string;
  starred: boolean;
  user_id: string;
  created_at: string;
  file_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

export type NewContentItem = Omit<ContentItem, 'id' | 'created_at'>;

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

// Type guard to check if a string is a valid ContentItemType
export function isContentItemType(type: string): type is ContentItemType {
  return ['link', 'image', 'whatsapp', 'video', 'note'].includes(type);
}

// Function to validate and transform raw data into ContentItem
export function transformToContentItem(raw: RawContentItem): ContentItem | null {
  if (!isContentItemType(raw.type)) {
    console.error('Invalid content type:', raw.type);
    return null;
  }

  return {
    id: raw.id,
    type: raw.type,
    content: raw.content,
    starred: raw.starred ?? false,
    user_id: raw.user_id,
    created_at: raw.created_at,
    file_path: raw.file_path,
    file_name: raw.file_name,
    file_size: raw.file_size,
    mime_type: raw.mime_type
  };
}

// Function to validate an array of raw items
export function transformToContentItems(items: RawContentItem[]): ContentItem[] {
  return items
    .map(transformToContentItem)
    .filter((item): item is ContentItem => item !== null);
}