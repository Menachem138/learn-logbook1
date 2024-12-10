import { ContentItem as ContentItemType } from '@/types/content';
import { ContentItem } from './ContentItem';

interface ContentListProps {
  items: ContentItemType[];
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit?: (id: string) => void;
  onImageClick?: (content: string) => void;
}

export const ContentList = ({
  items,
  onDelete,
  onToggleStar,
  onEdit,
  onImageClick
}: ContentListProps) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <ContentItem
          key={item.id}
          {...item}
          onDelete={onDelete}
          onToggleStar={onToggleStar}
          onEdit={onEdit}
          onImageClick={onImageClick}
        />
      ))}
    </ul>
  );
};