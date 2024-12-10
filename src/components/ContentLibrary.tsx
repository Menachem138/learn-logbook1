'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentInput } from './ContentLibrary/ContentInput'
import { ContentList } from './ContentLibrary/ContentList'
import { ImagePreview } from './ContentLibrary/ImagePreview'
import { NoteEditor } from './ContentLibrary/NoteEditor'
import { DropZone } from './ContentLibrary/DropZone'
import { ContentItem } from '@/types/content'
import { readFileAsDataURL } from '@/utils/fileHandlers'

const ContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createContentItem = (type: ContentItem['type'], content: string): ContentItem => ({
    id: Date.now().toString(),
    type,
    content,
    starred: false,
    user_id: 'temp', // This will be replaced with actual user_id when integrated with Supabase
    created_at: new Date().toISOString()
  });

  const addItem = useCallback(() => {
    if (newItem) {
      const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
      setItems(prev => [...prev, createContentItem(type, newItem)]);
      setNewItem('');
    }
  }, [newItem]);

  const addNote = useCallback(() => {
    setItems(prev => [...prev, createContentItem('note', noteContent)]);
    setNoteContent('');
    setEditingNote(null);
  }, [noteContent]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        const content = await readFileAsDataURL(file);
        setItems(prev => [...prev, createContentItem(
          file.type.startsWith('image/') ? 'image' : 'video',
          content
        )]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const content = await readFileAsDataURL(file);
        setItems(prev => [...prev, createContentItem(
          file.type.startsWith('image/') ? 'image' : 'video',
          content
        )]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
  }, []);

  const handleSaveNote = useCallback(() => {
    if (!editingNote) return;
    setItems(prev => prev.map(item =>
      item.id === editingNote ? { ...item, content: noteContent } : item
    ));
    setEditingNote(null);
  }, [editingNote, noteContent]);

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

        <DropZone onDrop={handleDrop} />

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

        <ImagePreview
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />

        <NoteEditor
          isOpen={!!editingNote}
          noteContent={noteContent}
          onContentChange={setNoteContent}
          onSave={handleSaveNote}
          onClose={() => setEditingNote(null)}
        />
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;