import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Play as PlayIcon } from "lucide-react";
import { useYouTubeStore } from "../../stores/youtube";
import { YouTubePlayer } from "./YouTubePlayer";
import { AddVideoDialog } from "./AddVideoDialog";
import { useAuth } from "../../components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export function YouTubeLibrary() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { videos, isLoading, fetchVideos } = useYouTubeStore();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log('No authenticated user, redirecting to login');
        setError('נא להתחבר כדי לצפות בסרטונים');
        navigate('/login', { replace: true });
        return;
      }

      console.log('Initializing videos with auth state:', {
        isAuthenticated: !!user,
        videosCount: videos.length,
        isLoading
      });

      try {
        console.log('Fetching videos from Supabase...');
        fetchVideos();
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('אירעה שגיאה בטעינת הסרטונים');
      }
    }
  }, [user, authLoading, navigate, fetchVideos]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">טוען...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => navigate('/login')}>התחבר</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ספריית סרטוני YouTube</h2>
        <div className="space-x-2 flex flex-row-reverse">
          <Button onClick={() => setIsAddingVideo(true)}>
            הוסף סרטון
          </Button>
          <Button onClick={handleSignOut}>התנתק</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="p-4">
            <div
              className="relative aspect-video cursor-pointer group"
              onClick={() => setSelectedVideo(video.video_id)}
            >
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="mt-2 font-medium line-clamp-2">{video.title}</h3>
          </Card>
        ))}
      </div>

      {selectedVideo && (
        <YouTubePlayer
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      <AddVideoDialog
        isOpen={isAddingVideo}
        onClose={() => setIsAddingVideo(false)}
      />
    </div>
  );
}
