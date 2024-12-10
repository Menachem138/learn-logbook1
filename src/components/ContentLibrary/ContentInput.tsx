import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

interface ContentInputProps {
  newItem: string;
  noteContent: string;
  onItemChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onAddItem: () => void;
  onAddNote: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ContentInput = ({
  newItem,
  noteContent,
  onItemChange,
  onNoteChange,
  onAddItem,
  onAddNote,
  onFileUpload,
  fileInputRef
}: ContentInputProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          value={newItem}
          onChange={(e) => onItemChange(e.target.value)}
          placeholder="הוסף קישור או הודעת וואטסאפ"
          className="flex-grow"
        />
        <div className="flex space-x-2">
          <Button onClick={onAddItem}>הוסף</Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> העלה קובץ
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Textarea
          value={noteContent}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="הוסף פתק חדש..."
          className="min-h-[100px]"
        />
        <Button onClick={onAddNote} variant="secondary">הוסף פתק</Button>
      </div>
    </div>
  );
};