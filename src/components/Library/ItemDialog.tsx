import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Link, Image, Video, MessageCircle, Upload } from 'lucide-react';
import { LibraryItem, LibraryItemType } from '@/types/library';
import { useDropzone } from 'react-dropzone';

interface ItemDialogProps {
  onSubmit: (data: any) => void;
  initialData?: LibraryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDialog = ({ onSubmit, initialData = null, isOpen, onClose }: ItemDialogProps) => {
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

          <Button type="submit" className="w-full">
            {initialData ? 'שמור שינויים' : 'הוסף פריט'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};