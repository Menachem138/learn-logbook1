import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video" | "image_gallery";
  src: string | string[];
  title: string;
}

export function MediaViewer({ isOpen, onClose, type, src, title }: MediaViewerProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const images = Array.isArray(src) ? src : [src];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 bg-black/20 hover:bg-black/40"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
          {type === "video" ? (
            <video
              src={typeof src === 'string' ? src : src[0]}
              controls
              className="w-full max-h-[80vh]"
              autoPlay
            >
              <source src={typeof src === 'string' ? src : src[0]} type="video/mp4" />
              הדפדפן שלך לא תומך בתגית וידאו.
            </video>
          ) : (
            <div className="flex flex-col gap-4 p-4">
              <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-black/95">
                <img
                  src={images[selectedImageIndex]}
                  alt={`${title} ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {images.length > 1 && (
                <div className="flex justify-center gap-2 overflow-x-auto p-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden focus:outline-none transition-transform duration-200 hover:scale-105 ${
                        index === selectedImageIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
