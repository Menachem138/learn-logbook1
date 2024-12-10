'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ContentItem } from './ContentItem'
import { ContentInput } from './ContentInput'
import { readFileAsDataURL } from '@/utils/fileHandlers'

interface ContentItem {
  id: string;
  type: 'link' | 'image' | 'whatsapp' | 'video' | 'note';
  content: string;
  starred: boolean;
}

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
        toast.error('Error loading items');
        return;
      }

      if (data) {
        setItems(data);
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
      user_id: (await supabase.auth.getUser()).data.user?.id
    };

    const { data, error } = await supabase
      .from('content_items')
      .insert([newContentItem])
      .select()
      .single();

    if (error) {
      toast.error('Error adding item');
      return;
    }

    if (data) {
      setItems(prev => [data, ...prev]);
      setNewItem('');
      toast.success('Item added successfully');
    }
  }, [newItem]);

  const addNote = useCallback(async () => {
    if (!noteContent) return;

    const newContentItem = {
      type: 'note' as const,
      content: noteContent,
      starred: false,
      user_id: (await supabase.auth.getUser()).data.user?.id
    };

    const { data, error } = await supabase
      .from('content_items')
      .insert([newContentItem])
      .select()
      .single();

    if (error) {
      toast.error('Error adding note');
      return;
    }

    if (data) {
      setItems(prev => [data, ...prev]);
      setNoteContent('');
      toast.success('Note added successfully');
    }
  }, [noteContent]);

  const removeItem = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting item');
      return;
    }

    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  }, []);

  const toggleStar = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    const { error } = await supabase
      .from('content_items')
      .update({ starred: !item.starred })
      .eq('id', id);

    if (error) {
      toast.error('Error updating item');
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
        type: file.type.startsWith('image/') ? 'image' : 'video' as const,
        content,
        starred: false,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('content_items')
        .insert([newContentItem])
        .select()
        .single();

      if (error) {
        toast.error('Error uploading file');
        return;
      }

      if (data) {
        setItems(prev => [data, ...prev]);
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      toast.error('Error processing file');
    }
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsDataURL(file);
      const newContentItem = {
        type: file.type.startsWith('image/') ? 'image' : 'video' as const,
        content,
        starred: false,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('content_items')
        .insert([newContentItem])
        .select()
        .single();

      if (error) {
        toast.error('Error uploading file');
        return;
      }

      if (data) {
        setItems(prev => [data, ...prev]);
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      toast.error('Error processing file');
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
            <ContentItem
              key={item.id}
              {...item}
              onDelete={removeItem}
              onToggleStar={toggleStar}
              onEdit={item.type === 'note' ? (id) => {
                setEditingNote(id);
                setNoteContent(item.content);
              } : undefined}
              onImageClick={setSelectedImage}
            />
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
                  toast.error('Error updating note');
                  return;
                }

                setItems(prev => prev.map(item =>
                  item.id === editingNote ? { ...item, content: noteContent } : item
                ));
                setEditingNote(null);
                toast.success('Note updated successfully');
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