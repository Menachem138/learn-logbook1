'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ContentItem } from '@/types/content'
import { ContentInput } from './ContentInput'
import { readFileAsDataURL } from '@/utils/fileHandlers'

const ContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load items from Supabase on component mount
  useEffect(() => {
    const loadItems = async () => {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('שגיאה בטעינת הפריטים');
        return;
      }

      if (data) {
        setItems(data as ContentItem[]);
      }
    };

    loadItems();
  }, []);

  const addItem = useCallback(async () => {
    if (!newItem) return;

    const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
    const newContentItem = {
      type,
      content: newItem,
      starred: false,
    };

    const { data, error } = await supabase
      .from('content_items')
      .insert([newContentItem])
      .select()
      .single();

    if (error) {
      toast.error('שגיאה בהוספת פריט');
      return;
    }

    if (data) {
      setItems(prev => [data as ContentItem, ...prev]);
      setNewItem('');
      toast.success('הפריט נוסף בהצלחה');
    }
  }, [newItem]);

  const addNote = useCallback(async () => {
    if (!noteContent) return;

    const newContentItem = {
      type: 'note' as const,
      content: noteContent,
      starred: false,
    };

    const { data, error } = await supabase
      .from('content_items')
      .insert([newContentItem])
      .select()
      .single();

    if (error) {
      toast.error('שגיאה בהוספת פתק');
      return;
    }

    if (data) {
      setItems(prev => [data as ContentItem, ...prev]);
      setNoteContent('');
      toast.success('הפתק נוסף בהצלחה');
    }
  }, [noteContent]);

  const removeItem = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('שגיאה במחיקת פריט');
      return;
    }

    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('הפריט נמחק בהצלחה');
  }, []);

  const toggleStar = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    const { error } = await supabase
      .from('content_items')
      .update({ starred: !item.starred })
      .eq('id', id);

    if (error) {
      toast.error('שגיאה בעדכון פריט');
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
  }, [items]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const content = await readFileAsDataURL(file);
      const newContentItem = {
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        content,
        starred: false,
      };

      const { data, error } = await supabase
        .from('content_items')
        .insert([newContentItem])
        .select()
        .single();

      if (error) {
        toast.error('שגיאה בהעלאת קובץ');
        return;
      }

      if (data) {
        setItems(prev => [data as ContentItem, ...prev]);
        toast.success('הקובץ הועלה בהצלחה');
      }
    } catch (error) {
      toast.error('שגיאה בעיבוד הקובץ');
    }
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsDataURL(file);
      const newContentItem = {
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        content,
        starred: false,
      };

      const { data, error } = await supabase
        .from('content_items')
        .insert([newContentItem])
        .select()
        .single();

      if (error) {
        toast.error('שגיאה בהעלאת קובץ');
        return;
      }

      if (data) {
        setItems(prev => [data as ContentItem, ...prev]);
        toast.success('הקובץ הועלה בהצלחה');
      }
    } catch (error) {
      toast.error('שגיאה בעיבוד הקובץ');
    }
  }, []);

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

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(item => (
            <li key={item.id} className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex-grow mb-2">
                {item.type === 'image' && (
                  <img 
                    src={item.content} 
                    alt="Uploaded content" 
                    className="w-full h-40 object-cover rounded-md cursor-pointer" 
                    onClick={() => setSelectedImage(item.content)}
                  />
                )}
                {item.type === 'video' && (
                  <video src={item.content} className="w-full h-40 object-cover rounded-md" controls />
                )}
                {item.type === 'note' && (
                  <div className="w-full h-40 flex items-center justify-center bg-yellow-100 rounded-md p-4">
                    <p className="text-gray-800 break-words overflow-auto">{item.content}</p>
                  </div>
                )}
                {(item.type === 'link' || item.type === 'whatsapp') && (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
                    <span className="text-gray-600 text-sm break-all p-2">{item.content}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => toggleStar(item.id)}>
                  <Star className={item.starred ? "fill-yellow-400" : ""} />
                </Button>
                {item.type === 'note' && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingNote(item.id);
                    setNoteContent(item.content);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>

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

                const { error } = await supabase
                  .from('content_items')
                  .update({ content: noteContent })
                  .eq('id', editingNote);

                if (error) {
                  toast.error('שגיאה בעדכון פתק');
                  return;
                }

                setItems(prev => prev.map(item =>
                  item.id === editingNote ? { ...item, content: noteContent } : item
                ));
                setEditingNote(null);
                toast.success('הפתק עודכן בהצלחה');
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