import { useState, useCallback } from 'react';
import { ContentItem } from '@/types/content';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { readFileAsDataURL } from '@/utils/fileHandlers';

export const useContentItems = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const validateContentType = (type: string): ContentItem['type'] => {
    const validTypes: ContentItem['type'][] = ['link', 'image', 'whatsapp', 'video', 'note'];
    if (validTypes.includes(type as ContentItem['type'])) {
      return type as ContentItem['type'];
    }
    console.warn(`Invalid content type encountered: ${type}`);
    return 'link';
  };

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

      const validatedData = (data || []).map(item => ({
        ...item,
        type: validateContentType(item.type)
      }));

      setItems(validatedData);
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
        return;
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

      if (data) {
        setItems(prev => [data as ContentItem, ...prev]);
        toast.success('הפריט נוסף בהצלחה');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('שגיאה בהוספת פריט');
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להעלות קבצים');
        return;
      }

      const content = await readFileAsDataURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';

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

      if (data) {
        setItems(prev => [data as ContentItem, ...prev]);
        toast.success('הקובץ הועלה בהצלחה');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('שגיאה בהעלאת קובץ');
    }
  }, []);

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
    const item = items.find(item => item.id === id);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('content_items')
        .update({ starred: !item.starred })
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, starred: !item.starred } : item
      ));
    } catch (error) {
      console.error('Error updating star:', error);
      toast.error('שגיאה בעדכון פריט');
    }
  }, [items]);

  return {
    items,
    loading,
    loadItems,
    addItem,
    uploadFile,
    removeItem,
    toggleStar
  };
};