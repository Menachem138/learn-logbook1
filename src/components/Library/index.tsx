import React, { useState, useCallback } from 'react';
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Trash2, Link, FileText, Image, Video, MessageCircle, Edit2, Upload } from 'lucide-react';
import { LibraryItem, LibraryItemType } from '@/types/library';
import { useDropzone } from 'react-dropzone';

const getIcon = (type: LibraryItemType) => {
  switch (type) {
    case 'link':
      return <Link className="w-4 h-4" />;
    case 'note':
      return <FileText className="w-4 h-4" />;
    case 'image':
      return <Image className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'whatsapp':
      return <MessageCircle className="w-4 h-4" />;
  }
};

const ItemDialog = ({ 
  onSubmit, 
  initialData = null, 
  isOpen, 
  onClose 
}: { 
  onSubmit: (data: any) => void;
  initialData?: LibraryItem | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [type, setType] = useState<LibraryItemType>(initialData?.type || 'note');
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setType(acceptedFiles[0].type.startsWith('image/') ? 'image' : 'video');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, type, file });
    setTitle('');
    setContent('');
    setType('note');
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'ערוך פריט' : 'הוסף פריט חדש'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="כותרת"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              placeholder="תוכן"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={type === 'note' ? 'default' : 'outline'}
              onClick={() => setType('note')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              הערה
            </Button>
            <Button
              type="button"
              variant={type === 'link' ? 'default' : 'outline'}
              onClick={() => setType('link')}
              className="flex items-center gap-2"
            >
              <Link className="w-4 h-4" />
              קישור
            </Button>
            <Button
              type="button"
              variant={type === 'image' ? 'default' : 'outline'}
              onClick={() => setType('image')}
              className="flex items-center gap-2"
            >
              <Image className="w-4 h-4" />
              תמונה
            </Button>
            <Button
              type="button"
              variant={type === 'video' ? 'default' : 'outline'}
              onClick={() => setType('video')}
              className="flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              וידאו
            </Button>
            <Button
              type="button"
              variant={type === 'whatsapp' ? 'default' : 'outline'}
              onClick={() => setType('whatsapp')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              וואטסאפ
            </Button>
          </div>
          {(type === 'image' || type === 'video') && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              {isDragActive ? (
                <p>שחרר את הקובץ כאן...</p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">גרור קובץ לכאן או לחץ לבחירת קובץ</p>
                  {file && <p className="mt-2 text-sm text-primary">{file.name}</p>}
                </div>
              )}
            </div>
          )}
          <Button type="submit" className="w-full">
            {initialData ? 'שמור שינויים' : 'הוסף פריט'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Library = () => {
  const { items, isLoading, filter, setFilter, addItem, deleteItem, toggleStar, updateItem } = useLibrary();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);

  const handleAddOrUpdateItem = async (data: any) => {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...data });
      } else {
        await addItem.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ספריית תוכן</h2>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="חיפוש..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
          <Button 
            onClick={() => {
              setEditingItem(null);
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            הוסף פריט
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item: LibraryItem) => (
          <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <h3 className="font-semibold">{item.title}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStar.mutate({ id: item.id, is_starred: !item.is_starred })}
                  className="hover:text-yellow-400"
                >
                  <Star className={`w-4 h-4 ${item.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(item)}
                  className="hover:text-blue-500"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem.mutate(item.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{item.content}</p>
            {item.file_details?.path && (
              <div className="mt-2">
                {item.type === 'image' ? (
                  <img
                    src={item.file_details.path}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : item.type === 'video' ? (
                  <video
                    src={item.file_details.path}
                    controls
                    className="w-full rounded-md"
                  />
                ) : null}
              </div>
            )}
          </Card>
        ))}
      </div>

      <ItemDialog
        onSubmit={handleAddOrUpdateItem}
        initialData={editingItem}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingItem(null);
        }}
      />
    </div>
  );
};

export default Library;