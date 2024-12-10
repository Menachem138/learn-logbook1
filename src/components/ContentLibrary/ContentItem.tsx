import { Button } from "@/components/ui/button"
import { Star, Trash2, Edit, CheckCircle2, CloudOff } from 'lucide-react'
import { ContentItem as ContentItemType } from '@/types/content'
import { useState, useEffect } from 'react'

interface ContentItemProps extends ContentItemType {
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
  const [isSaved, setIsSaved] = useState(true);
  const [showSaveStatus, setShowSaveStatus] = useState(true);

  // Show save status for 3 seconds when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSaveStatus(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <li className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-sm relative">
      {showSaveStatus && (
        <div className="absolute top-2 right-2 z-10">
          {isSaved ? (
            <CheckCircle2 className="text-green-500 h-6 w-6" />
          ) : (
            <CloudOff className="text-red-500 h-6 w-6" />
          )}
        </div>
      )}
      
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