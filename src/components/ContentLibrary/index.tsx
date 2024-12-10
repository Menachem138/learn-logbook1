'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { ContentInput } from './ContentInput'
import { ContentList } from './ContentList'
import { useContentLibrary } from '@/hooks/useContentLibrary'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'

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
    if (user?.id) {
      console.log('Loading items for user:', user.id);
      loadItems();
    }
  }, [user?.id, loadItems]);

  const handleAddItem = useCallback(async () => {
    if (!user?.id) {
      console.log('No user found');
      toast.error('יש להתחבר כדי להוסיף פריטים');
      return;
    }
    if (!newItem) return;
    
    console.log('Adding new item:', newItem);
    const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
    await addItem(newItem, type);
    setNewItem('');
  }, [newItem, addItem, user?.id]);

  const handleAddNote = useCallback(async () => {
    if (!user?.id) {
      console.log('No user found');
      toast.error('יש להתחבר כדי להוסיף פתקים');
      return;
    }
    if (!noteContent) return;
    
    console.log('Adding new note:', noteContent);
    await addItem(noteContent, 'note');
    setNoteContent('');
  }, [noteContent, addItem, user?.id]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      console.log('No user found');
      toast.error('יש להתחבר כדי להעלות קבצים');
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file.name);
      await addFile(file);
    }
  }, [addFile, user?.id]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    if (!user?.id) {
      console.log('No user found');
      toast.error('יש להתחבר כדי להעלות קבצים');
      return;
    }
    
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('Uploading dropped file:', file.name);
      await addFile(file);
    }
  }, [addFile, user?.id]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>ספריית תוכן</CardTitle>
      </CardHeader>
      <CardContent>
        {!user?.id ? (
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
                <DialogTitle>תצוגה מקדימה</DialogTitle>
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
                <DialogTitle>עריכת פתק</DialogTitle>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={async () => {
                    if (!editingNote) return;
                    await updateNote(editingNote, noteContent);
                    setEditingNote(null);
                  }}>
                    שמור שינויים
                  </Button>
                  <Button variant="outline" onClick={() => setEditingNote(null)}>
                    ביטול
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;