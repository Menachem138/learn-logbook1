import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { ContentItem, ContentItemType } from '@/types/content';
import { uploadFileToStorage } from '@/utils/fileStorage';
import * as queries from './queries';

export const useContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async (userId: string) => {
    if (!userId) {
      console.error('No user ID provided');
      return;
    }

    try {
      setLoading(true);
      const data = await queries.fetchUserItems(userId);
      setItems(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בטעינת הפריטים');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (userId: string, content: string, type: ContentItemType) => {
    if (!userId) {
      console.error('No user ID provided');
      toast.error('יש להתחבר כדי להוסיף פריטים');
      return null;
    }

    try {
      const newItem = await queries.insertItem(userId, type, content);
      setItems(prev => [newItem, ...prev]);
      toast.success('הפריט נוסף בהצלחה');
      return newItem;
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בהוספת פריט');
      return null;
    }
  }, []);

  const addFile = useCallback(async (userId: string, file: File) => {
    if (!userId) {
      console.error('No user ID provided');
      toast.error('יש להתחבר כדי להעלות קבצים');
      return null;
    }

    try {
      const fileDetails = await uploadFileToStorage(file, userId);
      const type: ContentItemType = file.type.startsWith('image/') ? 'image' : 'video';
      
      const newItem = await queries.insertItem(userId, type, fileDetails.publicUrl, {
        filePath: fileDetails.filePath,
        fileName: fileDetails.fileName,
        fileSize: fileDetails.fileSize,
        mimeType: fileDetails.mimeType
      });

      setItems(prev => [newItem, ...prev]);
      toast.success('הקובץ הועלה בהצלחה');
      return newItem;
    } catch (error) {
      console.error('Error:', error);
      toast.error('שגיאה בהעלאת קובץ');
      return null;
    }
  }, []);

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