import React, { useState } from "react";
import { MediaViewer } from "./MediaViewer";

interface MediaCardProps {
  type: "image" | "video";
  src: string;
  title: string;
  className?: string;
}

export function MediaCard({ type, src, title, className = "" }: MediaCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <div
        className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
        onClick={() => setIsViewerOpen(true)}
      >
        {type === "image" ? (
          <img
            src={src}
            alt={title}
            className="w-full h-48 object-cover rounded-md"
          />
        ) : (
          <video
            src={src}
            className="w-full rounded-md"
          />
        )}
      </div>
      <MediaViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        type={type}
        src={src}
        title={title}
      />
    </>
  );
}