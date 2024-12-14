import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, Strikethrough } from 'lucide-react';

interface TextEditorToolbarProps {
  onFormatText: (format: string) => void;
}

export function TextEditorToolbar({ onFormatText }: TextEditorToolbarProps) {
  return (
    <div className="flex gap-2 mb-2 bg-navy-800 p-3 rounded-lg shadow-md" dir="rtl">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onFormatText('**')}
        title="מודגש"
        className="hover:bg-navy-900"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onFormatText('*')}
        title="נטוי"
        className="hover:bg-navy-900"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onFormatText('__')}
        title="קו תחתון"
        className="hover:bg-navy-900"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onFormatText('~~')}
        title="קו חוצה"
        className="hover:bg-navy-900"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onFormatText('- ')}
        title="רשימה"
        className="hover:bg-navy-900"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}