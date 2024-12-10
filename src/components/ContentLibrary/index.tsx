'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ContentItem } from '@/types/content'
import { ContentInput } from './ContentInput'
import { ContentList } from './ContentList'
import { readFileAsDataURL } from '@/utils/fileHandlers'

const ContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי לצפות בפריטים');
        return;
      }

      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Validate and transform the type field
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
  };

  // Add type validation helper
  const validateContentType = (type: string): ContentItem['type'] => {
    const validTypes: ContentItem['type'][] = ['link', 'image', 'whatsapp', 'video', 'note'];
    if (validTypes.includes(type as ContentItem['type'])) {
      return type as ContentItem['type'];
    }
    // Default to 'link' if invalid type is encountered
    console.warn(`Invalid content type encountered: ${type}`);
    return 'link';
  };

  const addItem = useCallback(async () => {
    if (!newItem) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להוסיף פריטים');
        return;
      }

      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          type: newItem.startsWith('http') ? 'link' : 'whatsapp',
          content: newItem,
          starred: false,
          user_id: session.session.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setItems(prev => [data as ContentItem, ...prev]);
        setNewItem('');
        toast.success('הפריט נוסף בהצלחה');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('שגיאה בהוספת פריט');
    }
  }, [newItem]);

  const addNote = useCallback(async () => {
    if (!noteContent) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להוסיף פתקים');
        return;
      }

      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          type: 'note',
          content: noteContent,
          starred: false,
          user_id: session.session.user.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setItems(prev => [data as ContentItem, ...prev]);
        setNoteContent('');
        toast.success('הפתק נוסף בהצלחה');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('שגיאה בהוספת פתק');
    }
  }, [noteContent]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להעלות קבצים');
        return;
      }

      const content = await readFileAsDataURL(file);
      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          type: file.type.startsWith('image/') ? 'image' : 'video',
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

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error('יש להתחבר כדי להעלות קבצים');
        return;
      }

      const content = await readFileAsDataURL(file);
      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          type: file.type.startsWith('image/') ? 'image' : 'video',
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

  if (loading) {
    return <div>טוען...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>ספריית תוכן</CardTitle>
      </CardHeader>
      <CardContent>
        <ContentInput
          newItem={newItem}
          noteContent={noteContent}
          onItemChange={setNewItem}
          onNoteChange={setNoteContent}
          onAddItem={addItem}
          onAddNote={addNote}
          onFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
        />

        <div 
          className="border-2 border-dashed border-gray-300 p-4 text-center mb-4 mt-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          גרור ושחרר תמונות או סרטונים כאן
        </div>

        <ContentList
          items={items}
          onDelete={removeItem}
          onToggleStar={toggleStar}
          onEdit={(id) => {
            const item = items.find(item => item.id === id);
            if (item) {
              setEditingNote(id);
              setNoteContent(item.content);
            }
          }}
          onImageClick={setSelectedImage}
        />

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img src={selectedImage || ''} alt="Preview" className="w-full h-auto" />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={async () => {
                if (!editingNote) return;

                try {
                  const { error } = await supabase
                    .from('content_items')
                    .update({ content: noteContent })
                    .eq('id', editingNote);

                  if (error) throw error;

                  setItems(prev => prev.map(item =>
                    item.id === editingNote ? { ...item, content: noteContent } : item
                  ));
                  setEditingNote(null);
                  toast.success('הפתק עודכן בהצלחה');
                } catch (error) {
                  console.error('Error updating note:', error);
                  toast.error('שגיאה בעדכון פתק');
                }
              }}>
                שמור שינויים
              </Button>
              <Button variant="outline" onClick={() => setEditingNote(null)}>
                ביטול
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;