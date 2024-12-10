import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/components/auth/AuthProvider';
import { ContentItem, ContentItemType, isContentItemType } from '@/types/content';
import * as queries from './queries';
import type { UseContentLibraryReturn } from './types';

export const useContentLibrary = (): UseContentLibraryReturn => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadItems = useCallback(async () => {
    if (!user?.id) {
      console.error('No user found');
      setLoading(false);
      return;
    }

    try {
      const data = await queries.fetchUserItems(user.id);
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
  }, [user?.id]);

  const addItem = useCallback(async (content: string, type: ContentItemType) => {
    if (!user?.id) {
      toast.error('יש להתחבר כדי להוסיף פריטים');
      return null;
    }

    try {
      const data = await queries.insertItem(user.id, content, type);
      
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
  }, [user?.id]);

  const addFile = useCallback(async (file: File) => {
    if (!user?.id) {
      toast.error('יש להתחבר כדי להעלות קבצים');
      return null;
    }

    try {
      const data = await queries.uploadFile(user.id, file);
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
        toast.success('הקובץ הועלה בהצלחה');
        return newItem;
      }
      return null;
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בהעלאת קובץ');
      return null;
    }
  }, [user?.id]);

  const removeItem = useCallback(async (id: string) => {
    try {
      await queries.deleteItem(id);
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

      await queries.updateItemStar(id, !item.starred);
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
      await queries.updateItemContent(id, content);
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