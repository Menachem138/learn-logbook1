import React, { useState } from 'react';
import { useLibrary } from '@/hooks/useLibrary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ItemDialog } from './ItemDialog';
import { LibraryItemComponent } from './LibraryItem';
import { LibraryItem } from '@/types/library';

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
          <LibraryItemComponent
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={deleteItem.mutate}
            onToggleStar={(id, isStarred) => toggleStar.mutate({ id, is_starred: isStarred })}
          />
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