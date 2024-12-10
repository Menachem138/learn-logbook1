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

// Type guard to check if a string is a valid ContentItemType
export function isContentItemType(type: string): type is ContentItemType {
  return ['link', 'image', 'whatsapp', 'video', 'note'].includes(type);
}

// Type guard to validate ContentItem from database
export function isValidContentItem(item: any): item is ContentItem {
  return (
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.content === 'string' &&
    typeof item.user_id === 'string' &&
    typeof item.created_at === 'string' &&
    typeof item.type === 'string' &&
    isContentItemType(item.type) &&
    (item.starred === null || typeof item.starred === 'boolean') &&
    (item.file_path === null || typeof item.file_path === 'string' || item.file_path === undefined) &&
    (item.file_name === null || typeof item.file_name === 'string' || item.file_name === undefined) &&
    (item.file_size === null || typeof item.file_size === 'number' || item.file_size === undefined) &&
    (item.mime_type === null || typeof item.mime_type === 'string' || item.mime_type === undefined)
  );
}