import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Link, FileText, Image, Video, MessageCircle, Edit2 } from 'lucide-react';
import { LibraryItem as LibraryItemType } from '@/types/library';

interface LibraryItemProps {
  item: LibraryItemType;
  onEdit: (item: LibraryItemType) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string, isStarred: boolean) => void;
}

const getIcon = (type: string) => {
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
    default:
      return <FileText className="w-4 h-4" />;
  }
};

export const LibraryItemComponent = ({ item, onEdit, onDelete, onToggleStar }: LibraryItemProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {getIcon(item.type)}
          <h3 className="font-semibold">{item.title}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStar(item.id, !item.is_starred)}
            className="hover:text-yellow-400"
          >
            <Star className={`w-4 h-4 ${item.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="hover:text-blue-500"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
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
  );
};