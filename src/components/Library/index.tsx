import React, { useState } from 'react';
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Trash2, Link, FileText, Image, Video, MessageCircle, Plus } from 'lucide-react';
import { LibraryItem, LibraryItemType } from '@/types/library';

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

const AddItemDialog = ({ onAdd }: { onAdd: (data: any) => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<LibraryItemType>('note');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, content, type, file });
    setTitle('');
    setContent('');
    setType('note');
    setFile(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          הוסף פריט
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>הוסף פריט חדש</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="כותרת"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="תוכן"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              className="w-full p-2 border rounded"
              value={type}
              onChange={(e) => setType(e.target.value as LibraryItemType)}
            >
              <option value="note">הערה</option>
              <option value="link">קישור</option>
              <option value="image">תמונה</option>
              <option value="video">וידאו</option>
              <option value="whatsapp">וואטסאפ</option>
            </select>
          </div>
          {(type === 'image' || type === 'video') && (
            <div>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept={type === 'image' ? 'image/*' : 'video/*'}
              />
            </div>
          )}
          <Button type="submit">שמור</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Library = () => {
  const { items, isLoading, filter, setFilter, addItem, deleteItem, toggleStar } = useLibrary();

  const handleAddItem = async (data: any) => {
    try {
      await addItem.mutateAsync(data);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  if (isLoading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="space-y-4">
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
          <AddItemDialog onAdd={handleAddItem} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item: LibraryItem) => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <h3 className="font-semibold">{item.title}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStar.mutate({ id: item.id, is_starred: !item.is_starred })}
                >
                  <Star className={`w-4 h-4 ${item.is_starred ? 'fill-yellow-400' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem.mutate(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{item.content}</p>
            {item.file_details?.path && (
              <div className="mt-2">
                {item.type === 'image' ? (
                  <img
                    src={item.file_details.path}
                    alt={item.title}
                    className="max-w-full h-auto rounded"
                  />
                ) : item.type === 'video' ? (
                  <video
                    src={item.file_details.path}
                    controls
                    className="max-w-full h-auto rounded"
                  />
                ) : null}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Library;