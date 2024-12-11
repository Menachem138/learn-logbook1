import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface MediaCardProps {
  type: "image" | "video" | "pdf";
  src: string;
  title: string;
}

export function MediaCard({ type, src, title }: MediaCardProps) {
  if (type === "pdf") {
    return (
      <Card className="p-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-red-500" />
        <a 
          href={src} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          צפה ב-PDF
        </a>
      </Card>
    );
  }

  if (type === "image") {
    return (
      <Card className="overflow-hidden">
        <img src={src} alt={title} className="w-full h-auto" />
      </Card>
    );
  }

  if (type === "video") {
    return (
      <Card className="overflow-hidden">
        <video controls className="w-full h-auto">
          <source src={src} type="video/mp4" />
          הדפדפן שלך לא תומך בתגית וידאו.
        </video>
      </Card>
    );
  }

  return null;
}