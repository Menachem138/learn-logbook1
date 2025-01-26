export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  images?: string[];
  tags?: string[];
}

export interface JournalFormData {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
}
