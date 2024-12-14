import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextEditorToolbarProps {
  onFormatText: (format: string) => void;
}

export function TextEditorToolbar({ onFormatText }: TextEditorToolbarProps) {
  return (
    <div className="flex gap-2 mb-2 p-2 border-b" dir="rtl">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex gap-2">
            טקסט רגיל
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>טקסט רגיל</DropdownMenuItem>
          <DropdownMenuItem>כותרת משנית</DropdownMenuItem>
          <DropdownMenuItem>תת-כותרת</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('> ')}
        title="ציטוט"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('- ')}
        title="רשימה"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText('1. ')}
        title="רשימה ממוספרת"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

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
    </div>
  );
}