import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentItem {
  id: string;
  type: 'image' | 'video';
  content: string;
  starred: boolean;
}

export function ContentLibrary() {
  const [items, setItems] = useState<ContentItem[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setItems(prev => [...prev, {
          id: crypto.randomUUID(),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          content: result,
          starred: false
        }]);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ספריית תוכן</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="file" onChange={handleFileUpload} />
        <div className="mt-4">
          {items.map(item => (
            <div key={item.id} className="mb-2">
              {item.type === 'image' ? (
                <img src={item.content} alt="Uploaded content" className="w-full h-auto" />
              ) : (
                <video controls className="w-full h-auto">
                  <source src={item.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ContentLibrary;
