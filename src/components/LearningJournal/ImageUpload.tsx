import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

export function ImageUpload({ onUploadComplete, uploading, setUploading }: ImageUploadProps) {
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('content_library')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content_library')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast.success('התמונה הועלתה בהצלחה!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full"
        disabled={uploading}
      >
        <label className="cursor-pointer flex items-center justify-center w-full">
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'מעלה תמונה...' : 'העלה תמונה'}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
          />
        </label>
      </Button>
    </div>
  );
}