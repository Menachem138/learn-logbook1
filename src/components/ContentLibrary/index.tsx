'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentInput } from './ContentInput'
import { ContentList } from './ContentList'
import { ImagePreview } from './ImagePreview'
import { NoteEditor } from './NoteEditor'
import { DropZone } from './DropZone'
import { useContentLibrary } from '@/hooks/useContentLibrary'
import { useAuth } from '@/components/auth/AuthProvider'

const ContentLibrary = () => {
  const { user } = useAuth();
  const {
    items,
    loading,
    loadItems,
    addItem,
    addFile,
    removeItem,
    toggleStar,
    updateNote
  } = useContentLibrary();

  const [newItem, setNewItem] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      console.log('Loading items for user:', user.id);
      loadItems();
    }
  }, [user, loadItems]);

  const handleAddItem = useCallback(async () => {
    if (!newItem) return;
    
    console.log('Adding new item:', newItem);
    const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
    await addItem(newItem, type);
    setNewItem('');
  }, [newItem, addItem]);

  const handleAddNote = useCallback(async () => {
    if (!noteContent) return;
    
    console.log('Adding new note:', noteContent);
    await addItem(noteContent, 'note');
    setNoteContent('');
  }, [noteContent, addItem]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file.name);
      await addFile(file);
    }
  }, [addFile]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('Uploading dropped file:', file.name);
      await addFile(file);
    }
  }, [addFile]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>ספריית תוכן</CardTitle>
      </CardHeader>
      <CardContent>
        {!user ? (
          <div className="text-center py-8">
            <p className="text-gray-500">יש להתחבר כדי להשתמש בספריית התוכן</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">טוען...</p>
          </div>
        ) : (
          <>
            <ContentInput
              newItem={newItem}
              noteContent={noteContent}
              onItemChange={setNewItem}
              onNoteChange={setNoteContent}
              onAddItem={handleAddItem}
              onAddNote={handleAddNote}
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
              onSave={async () => {
                if (!editingNote) return;
                await updateNote(editingNote, noteContent);
                setEditingNote(null);
              }}
              onClose={() => setEditingNote(null)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;