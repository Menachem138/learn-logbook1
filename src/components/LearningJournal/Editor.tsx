import React from 'react';
import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Quote,
  ChevronDown
} from 'lucide-react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[150px] rtl text-right',
        dir: 'rtl',
      },
    },
  })

  if (!editor) {
    return null
  }

  const headingOptions = [
    { label: 'טקסט רגיל', command: () => editor.chain().focus().setParagraph().run() },
    { label: 'כותרת', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'כותרת משנית', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'תת-כותרת', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  ]

  return (
    <div className="border rounded-lg overflow-hidden" dir="rtl">
      <div className="flex items-center gap-2 border-b p-3 bg-gray-50/80">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-right px-3 font-normal">
              טקסט רגיל
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px]">
            {headingOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onClick={option.command}
                className="text-right px-3 py-2"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-[1px] bg-gray-200 mx-1" />

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 mx-1" />

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
      </div>
    </div>
  )
}

export default Editor
