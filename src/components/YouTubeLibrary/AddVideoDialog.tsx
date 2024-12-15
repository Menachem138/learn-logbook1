import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useYouTubeStore } from "../../stores/youtube";

interface AddVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVideoDialog({ isOpen, onClose }: AddVideoDialogProps) {
  const addVideo = useYouTubeStore(state => state.addVideo);
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVideo(url);
    setUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>הוסף סרטון YouTube</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="הכנס קישור YouTube"
            className="w-full"
          />
          <Button type="submit" className="w-full">
            הוסף
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
