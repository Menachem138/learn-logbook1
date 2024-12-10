import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface NoteEditorProps {
  isOpen: boolean;
  noteContent: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const NoteEditor = ({
  isOpen,
  noteContent,
  onContentChange,
  onSave,
  onClose
}: NoteEditorProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>עריכת פתק</DialogTitle>
        <Textarea
          value={noteContent}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[200px]"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onSave}>
            שמור שינויים
          </Button>
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};