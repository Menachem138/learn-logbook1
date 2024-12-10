import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/types/content';
import { toast } from "sonner";
import { uploadFileToStorage } from '@/utils/fileStorage';

export const useContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי לצפות בפריטים');
        return;
      }

      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('שגיאה בטעינת הפריטים');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (content: string, type: ContentItem['type']) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להוסיף פריטים');
        return null;
      }

      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          type,
          content,
          starred: false,
          user_id: session.session.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data as ContentItem, ...prev]);
      toast.success('הפריט נוסף בהצלחה');
      return data as ContentItem;
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('שגיאה בהוספת פריט');
      return null;
    }
  }, []);

  const addFile = useCallback(async (file: File) => {
    try {
      const publicUrl = await uploadFileToStorage(file);
      if (!publicUrl) {
        toast.error('שגיאה בהעלאת הקובץ');
        return null;
      }

      const type = file.type.startsWith('image/') ? 'image' : 'video';
      return await addItem(publicUrl, type);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('שגיאה בהעלאת קובץ');
      return null;
    }
  }, [addItem]);

  const removeItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('הפריט נמחק בהצלחה');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('שגיאה במחיקת פריט');
    }
  }, []);

  const toggleStar = useCallback(async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('content_items')
        .update({ starred: !item.starred })
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, starred: !item.starred } : item
      ));
      toast.success('הפריט עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating star:', error);
      toast.error('שגיאה בעדכון פריט');
    }
  }, [items]);

  const updateNote = useCallback(async (id: string, content: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ content })
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, content } : item
      ));
      toast.success('הפתק עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('שגיאה בעדכון פתק');
    }
  }, []);

  return {
    items,
    loading,
    loadItems,
    addItem,
    addFile,
    removeItem,
    toggleStar,
    updateNote
  };
};