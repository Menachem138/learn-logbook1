import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function YouTubePlayer({ videoId, title, isOpen, onClose }: YouTubePlayerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-6">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}