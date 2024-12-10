export interface ContentItem {
  id: string;
  type: 'link' | 'image' | 'whatsapp' | 'video' | 'note';
  content: string;
  starred: boolean;
  created_at?: string;
  user_id?: string;
}