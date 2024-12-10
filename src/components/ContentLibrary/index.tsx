'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { ContentInput } from './ContentInput'
import { ContentList } from './ContentList'
import { useContentItems } from './useContentItems'

const ContentLibrary = () => {
  const [newItem, setNewItem] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    items,
    loading,
    loadItems,
    addItem,
    uploadFile,
    removeItem,
    toggleStar
  } = useContentItems();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddItem = useCallback(() => {
    if (!newItem) return;
    const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
    addItem(newItem, type);
    setNewItem('');
  }, [newItem, addItem]);

  const handleAddNote = useCallback(() => {
    if (!noteContent) return;
    addItem(noteContent, 'note');
    setNoteContent('');
  }, [noteContent, addItem]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

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
          onAddItem={handleAddItem}
          onAddNote={handleAddNote}
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
                const item = items.find(item => item.id === editingNote);
                if (item) {
                  await addItem(noteContent, 'note');
                  setEditingNote(null);
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