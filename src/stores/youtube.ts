import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../utils/youtube';
import type { Database } from '../integrations/supabase/types';

type YouTubeVideo = Database['public']['Tables']['youtube_videos']['Row'];

interface YouTubeStore {
  videos: YouTubeVideo[];
  isLoading: boolean;
  error: string | null;
  addVideo: (url: string) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  fetchVideos: () => Promise<void>;
}

export const useYouTubeStore = create<YouTubeStore>((set, get) => ({
  videos: [],
  isLoading: false,
  error: null,

  fetchVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ videos: data || [], isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addVideo: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const videoId = parseYouTubeUrl(url);
      if (!videoId) throw new Error('Invalid YouTube URL');

      const details = await getYouTubeVideoDetails(videoId);
      const { error } = await supabase
        .from('youtube_videos')
        .insert({
          url,
          video_id: videoId,
          title: details.title,
          thumbnail_url: details.thumbnail,
        });

      if (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }

      await get().fetchVideos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add video';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteVideo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }

      await get().fetchVideos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));
