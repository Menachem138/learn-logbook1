export interface Document {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id: string;
  file_type: string;
  size: number;
}

export interface DocumentFormData {
  title: string;
  file: {
    uri: string;
    type: string;
    name: string;
  };
}
