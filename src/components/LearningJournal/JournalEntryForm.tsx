import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TextEditorToolbar } from './TextEditorToolbar';

interface JournalEntryFormProps {
  newEntry: string;
  setNewEntry: (value: string) => void;
  addEntry: (isImportant: boolean) => void;
}

export function JournalEntryForm({ newEntry, setNewEntry, addEntry }: JournalEntryFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newEntry.substring(start, end);

    let newText = newEntry;
    let newCursorPos = start;

    switch (format) {
      case 'align-right':
      case 'align-center':
      case 'align-left':
        // Add text-align class to the selected text
        newText = `${newEntry.substring(0, start)}<div class="${format}">${selectedText}</div>${newEntry.substring(end)}`;
        newCursorPos = start + format.length + 7;
        break;
      case 'quote':
        newText = `${newEntry.substring(0, start)}> ${selectedText}${newEntry.substring(end)}`;
        newCursorPos = start + 2;
        break;
      case 'bullet-list':
        newText = `${newEntry.substring(0, start)}• ${selectedText}${newEntry.substring(end)}`;
        newCursorPos = start + 2;
        break;
      case 'numbered-list':
        newText = `${newEntry.substring(0, start)}1. ${selectedText}${newEntry.substring(end)}`;
        newCursorPos = start + 3;
        break;
      default:
        // For bold (**), italic (*), and underline (__)
        newText = `${newEntry.substring(0, start)}${format}${selectedText}${format}${newEntry.substring(end)}`;
        newCursorPos = start + format.length;
    }

    setNewEntry(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
    }, 0);
  };

  return (
    <div className="space-y-4 bg-white rounded-lg border shadow-sm">
      <TextEditorToolbar onFormatText={handleFormatText} />
      <div className="px-4 pb-4">
        <Textarea
          ref={textareaRef}
          placeholder="מה למדת היום?"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="min-h-[150px] text-right bg-white resize-none"
          dir="rtl"
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => addEntry(true)}
            className="bg-white hover:bg-gray-50"
          >
            הוסף כהערה חשובה
          </Button>
          <Button 
            onClick={() => addEntry(false)}
            className="bg-black hover:bg-black/90 text-white"
          >
            הוסף רשומה
          </Button>
        </div>
      </div>
    </div>
  );
}