import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, Download } from 'lucide-react'

interface ImagePreviewProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImagePreview = ({ imageUrl, onClose }: ImagePreviewProps) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${Date.now()}.jpg`; // Default name for downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!imageUrl) return null;

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>תצוגה מקדימה</DialogTitle>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <img src={imageUrl} alt="Preview" className="w-full h-auto" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 ml-2" />
            שמור תמונה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};