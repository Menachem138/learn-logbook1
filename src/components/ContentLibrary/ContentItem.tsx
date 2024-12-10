import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Trash2, Edit } from 'lucide-react'

interface ContentItemProps {
  id: string;
  type: 'link' | 'image' | 'whatsapp' | 'video' | 'note';
  content: string;
  starred: boolean;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit?: (id: string) => void;
  onImageClick?: (content: string) => void;
}

export const ContentItem = ({
  id,
  type,
  content,
  starred,
  onDelete,
  onToggleStar,
  onEdit,
  onImageClick
}: ContentItemProps) => {
  return (
    <li className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex-grow mb-2">
        {type === 'image' && (
          <img 
            src={content} 
            alt="Uploaded content" 
            className="w-full h-40 object-cover rounded-md cursor-pointer" 
            onClick={() => onImageClick?.(content)}
          />
        )}
        {type === 'video' && (
          <video src={content} className="w-full h-40 object-cover rounded-md" controls />
        )}
        {type === 'note' && (
          <div className="w-full h-40 flex items-center justify-center bg-yellow-100 rounded-md p-4">
            <p className="text-gray-800 break-words overflow-auto">{content}</p>
          </div>
        )}
        {(type === 'link' || type === 'whatsapp') && (
          <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-gray-600 text-sm break-all p-2">{content}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => onToggleStar(id)}>
          <Star className={starred ? "fill-yellow-400" : ""} />
        </Button>
        {type === 'note' && onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
          <Trash2 />
        </Button>
      </div>
    </li>
  );
};