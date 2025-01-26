import { supabase } from '../config/supabase';
import type { Document, DocumentFormData } from '../components/Documents/types';
import { uploadToCloudinary } from '../utils/media';

class DocumentService {
  private static instance: DocumentService;

  private constructor() {}

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  async getDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async uploadDocument(formData: DocumentFormData): Promise<Document> {
    try {
      // Upload file to Cloudinary
      const fileUrl = await uploadToCloudinary(formData.file.uri);

      // Save document metadata to Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            title: formData.title,
            url: fileUrl,
            file_type: formData.file.type,
            size: 0, // TODO: Add actual file size
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const documentService = DocumentService.getInstance();
