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
      const response = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (response.error) {
        set({ error: response.error.message });
        return;
      }

      set({ videos: response.data || [] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  addVideo: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const videoId = parseYouTubeUrl(url);
      if (!videoId) throw new Error('Invalid YouTube URL');

      const details = await getYouTubeVideoDetails(videoId);
      const response = await supabase
        .from('youtube_videos')
        .insert({
          url,
          video_id: videoId,
          title: details.title,
          thumbnail_url: details.thumbnail,
        });

      if (response.error) {
        set({ error: response.error.message });
        throw response.error;
      }

      await get().fetchVideos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add video';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVideo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (response.error) {
        set({ error: response.error.message });
        throw response.error;
      }

      await get().fetchVideos();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
