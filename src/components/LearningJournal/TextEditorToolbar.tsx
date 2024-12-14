import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, Strikethrough } from 'lucide-react';

interface TextEditorToolbarProps {
  onFormatText: (format: string) => void;
}

export function TextEditorToolbar({ onFormatText }: TextEditorToolbarProps) {
  return (
    <div className="flex gap-1 mb-2" dir="rtl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('**')}
        title="מודגש"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('*')}
        title="נטוי"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('__')}
        title="קו תחתון"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('~~')}
        title="קו חוצה"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('- ')}
        title="רשימה"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}