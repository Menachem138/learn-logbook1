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
        <div className="relative group">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full aspect-video object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsPlayerOpen(true)}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg line-clamp-2 hover:cursor-pointer" onClick={() => setIsPlayerOpen(true)}>
              {title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
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