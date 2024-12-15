import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Play } from "lucide-react";
import { YouTubePlayer } from './YouTubePlayer';

interface YouTubeCardProps {
  videoId: string;
  title: string;
  onDelete: () => void;
}

export function YouTubeCard({ videoId, title, onDelete }: YouTubeCardProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative group cursor-pointer" onClick={() => setIsPlayerOpen(true)}>
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full aspect-video object-cover transition-opacity group-hover:opacity-90"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70"
            >
              <Play className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg line-clamp-2 hover:cursor-pointer" onClick={() => setIsPlayerOpen(true)}>
              {title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <YouTubePlayer
        videoId={videoId}
        title={title}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}