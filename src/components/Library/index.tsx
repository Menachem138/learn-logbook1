import React from 'react';
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Link, FileText, Image, Video, MessageCircle } from 'lucide-react';
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

const Library = () => {
  const { items, isLoading, filter, setFilter, deleteItem, toggleStar } = useLibrary();

  if (isLoading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ספריית תוכן</h2>
        <Input
          type="search"
          placeholder="חיפוש..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Library;