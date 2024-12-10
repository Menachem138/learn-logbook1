import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem, ContentItemType, isContentItemType } from '@/types/content';
import { toast } from "sonner";

export const useContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        console.error('No user session found');
        return;
      }

      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading items:', error);
        toast.error('שגיאה בטעינת הפריטים');
        return;
      }

      // Validate and transform the data to ensure correct types
      const validItems = data?.filter((item): item is ContentItem => {
        return isContentItemType(item.type);
      }) || [];

      setItems(validItems);
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בטעינת הפריטים');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (content: string, type: ContentItemType) => {
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
          user_id: session.session.user.id,
          starred: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
        toast.error('שגיאה בהוספת פריט');
        return null;
      }

      if (data && isContentItemType(data.type)) {
        const newItem: ContentItem = {
          id: data.id,
          type: data.type,
          content: data.content,
          starred: data.starred || false,
          user_id: data.user_id,
          created_at: data.created_at
        };
        setItems(prev => [newItem, ...prev]);
        toast.success('הפריט נוסף בהצלחה');
        return newItem;
      }
      return null;
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בהוספת פריט');
      return null;
    }
  }, []);

  const addFile = useCallback(async (file: File) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להעלות קבצים');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${session.session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content_library')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('שגיאה בהעלאת קובץ');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content_library')
        .getPublicUrl(filePath);

      const type: ContentItemType = file.type.startsWith('image/') ? 'image' : 'video';
      return await addItem(publicUrl, type);
    } catch (error) {
      console.error('Error:', error);
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

      if (error) {
        console.error('Error removing item:', error);
        toast.error('שגיאה במחיקת פריט');
        return;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('הפריט נמחק בהצלחה');
    } catch (error) {
      console.error('Error:', error);
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

      if (error) {
        console.error('Error updating star:', error);
        toast.error('שגיאה בעדכון פריט');
        return;
      }

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, starred: !item.starred } : item
      ));
      toast.success('הפריט עודכן בהצלחה');
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בעדכון פריט');
    }
  }, [items]);

  const updateNote = useCallback(async (id: string, content: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ content })
        .eq('id', id);

      if (error) {
        console.error('Error updating note:', error);
        toast.error('שגיאה בעדכון פתק');
        return;
      }

      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, content } : item
      ));
      toast.success('הפתק עודכן בהצלחה');
    } catch (error) {
      console.error('Error:', error);
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