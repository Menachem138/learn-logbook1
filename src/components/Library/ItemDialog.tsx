import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { LibraryItem, LibraryItemType } from "@/types/library";
import { Upload } from "lucide-react";

interface ItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LibraryItem> & { file?: File }) => void;
  initialData?: LibraryItem | null;
}

export function ItemDialog({ isOpen, onClose, onSubmit, initialData }: ItemDialogProps) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: initialData || {
      title: "",
      content: "",
      type: "note" as LibraryItemType,
    },
  });

  const selectedType = watch("type");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const onSubmitForm = (data: any) => {
    const formData = {
      ...data,
      files: selectedType === 'image_gallery' ? selectedFiles : selectedFiles[0],
    };
    onSubmit(formData);
    setSelectedFiles([]);
    reset();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (selectedType === 'image_gallery') {
        setSelectedFiles(prev => [...prev, ...Array.from(files)]);
      } else {
        setSelectedFiles([files[0]]);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "ערוך פריט" : "הוסף פריט חדש"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Input
              placeholder="כותרת"
              {...register("title", { required: true })}
            />
          </div>
          <div>
            <select
              className="w-full p-2 border rounded-md"
              {...register("type", { required: true })}
            >
              <option value="note">הערה</option>
              <option value="link">קישור</option>
              <option value="image">תמונה</option>
              <option value="image_gallery">אלבום תמונות</option>
              <option value="video">וידאו</option>
              <option value="whatsapp">וואטסאפ</option>
              <option value="pdf">PDF</option>
              <option value="question">שאלה</option>
            </select>
          </div>
          <div>
            <Textarea
              placeholder={selectedType === 'question' ? "מה השאלה שלך?" : "תוכן"}
              {...register("content", { required: true })}
            />
          </div>

          {(selectedType === 'image' || selectedType === 'image_gallery' || selectedType === 'video' || selectedType === 'pdf') && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {selectedType === 'image' ? 'העלה תמונה' : 
                 selectedType === 'image_gallery' ? 'העלה תמונות' :
                 selectedType === 'video' ? 'העלה וידאו' : 'העלה PDF'}
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple={selectedType === 'image_gallery'}
                  accept={
                    selectedType === 'image' || selectedType === 'image_gallery'
                      ? "image/*" 
                      : selectedType === 'video' 
                      ? "video/*" 
                      : "application/pdf"
                  }
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {selectedFiles.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedFiles.length} {selectedFiles.length === 1 ? 'קובץ' : 'קבצים'} נבחרו
                  </span>
                )}
              </div>
              {selectedType === 'image_gallery' && selectedFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`תמונה ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">
              {initialData ? "עדכן" : "הוסף"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
