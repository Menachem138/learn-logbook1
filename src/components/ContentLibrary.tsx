'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Star, Trash2, Upload, Edit, X } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface ContentItem {
  id: string;
  type: 'link' | 'image' | 'whatsapp' | 'video' | 'note';
  content: string;
  starred: boolean;
  note?: string;
}

const ContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = useCallback(() => {
    if (newItem) {
      const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
      setItems(prev => [...prev, { id: Date.now().toString(), type, content: newItem, starred: false }]);
      setNewItem('');
    }
  }, [newItem]);

  const addNote = useCallback(() => {
    setItems(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'note', 
      content: noteContent, 
      starred: false 
    }]);
    setNoteContent('');
    setEditingNote(null);
  }, [noteContent]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setItems(prev => [...prev, { 
            id: Date.now().toString(), 
            type: file.type.startsWith('image/') ? 'image' : 'video', 
            content: event.target.result, 
            starred: false 
          }]);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setItems(prev => [...prev, { 
            id: Date.now().toString(), 
            type: file.type.startsWith('image/') ? 'image' : 'video', 
            content: event.target.result, 
            starred: false 
          }]);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>ספריית תוכן</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="הוסף קישור או הודעת וואטסאפ"
              className="flex-grow"
            />
            <div className="flex space-x-2">
              <Button onClick={addItem}>הוסף</Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="mr-2 h-4 w-4" /> העלה קובץ
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                className="hidden"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="הוסף פתק חדש..."
              className="min-h-[100px]"
            />
            <Button onClick={addNote} variant="secondary">הוסף פתק</Button>
          </div>
        </div>

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
              <Button onClick={() => {
                setItems(prev => prev.map(item =>
                  item.id === editingNote ? { ...item, content: noteContent } : item
                ));
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
      </CardContent>
    </Card>
  );
}

export default ContentLibrary;
