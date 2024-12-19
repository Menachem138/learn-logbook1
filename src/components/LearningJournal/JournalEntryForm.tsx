import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Editor from "./Editor";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";

interface JournalEntryFormProps {
  onEntryAdded: () => void;
}

export function JournalEntryForm({ onEntryAdded }: JournalEntryFormProps) {
  const [newEntry, setNewEntry] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const addEntry = async (isImportant: boolean = false) => {
    if (!newEntry.trim()) {
      toast.error("אנא הכנס תוכן ליומן");
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("יש להתחבר כדי להוסיף רשומה");
        return;
      }

      const { error } = await supabase
        .from('learning_journal')
        .insert([{
          content: newEntry,
          is_important: isImportant,
          user_id: session.session.user.id,
          image_url: imageUrl
        }]);

      if (error) throw error;

      setNewEntry("");
      setImageUrl(null);
      onEntryAdded();
      toast.success("הרשומה נוספה בהצלחה!");
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error("שגיאה בהוספת רשומה");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg">מה למדת היום?</h3>
        <Editor
          content={newEntry}
          onChange={setNewEntry}
        />
        <ImageUpload
          onUploadComplete={(url) => setImageUrl(url)}
          uploading={uploading}
          setUploading={setUploading}
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={() => addEntry(false)} 
          className="flex-1"
          disabled={uploading}
        >
          הוסף רשומה
        </Button>
        <Button 
          onClick={() => addEntry(true)} 
          variant="secondary" 
          className="flex-1"
          disabled={uploading}
        >
          הוסף כהערה חשובה
        </Button>
      </div>
    </div>
  );
}