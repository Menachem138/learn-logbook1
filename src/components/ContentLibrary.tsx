import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Star, Trash2, Upload } from 'lucide-react'

interface ContentItem {
  id: string;
  type: 'link' | 'image' | 'whatsapp' | 'video';
  content: string;
  starred: boolean;
}

export default function ContentLibrary() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = useCallback(() => {
    if (newItem) {
      const type = newItem.startsWith('http') ? 'link' : 'whatsapp';
      setItems(prev => [...prev, { id: Date.now().toString(), type, content: newItem, starred: false }]);
      setNewItem('');
    }
  }, [newItem]);

  const toggleStarred = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setItems(prev => [...prev, { id: Date.now().toString(), type: 'image', content: reader.result as string, starred: false }]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>ספריית תוכן</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="הוסף קישור או הודעת וואטסאפ"
            className="flex-grow"
          />
          <Button onClick={addItem}>הוסף</Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()}><Upload /> העלה תמונה</Button>
        </div>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
              <span className={item.starred ? "font-bold" : ""}>{item.content}</span>
              <div className="flex items-center space-x-2">
                <Button onClick={() => toggleStarred(item.id)} variant="outline">
                  <Star className={item.starred ? "text-yellow-500" : ""} />
                </Button>
                <Button onClick={() => deleteItem(item.id)} variant="destructive">
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
