import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../utils/youtube';

interface YouTubeVideo {
  id: string;
  url: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
}

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

      if (error) throw error;
      set({ videos: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
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
      const { error } = await supabase
        .from('youtube_videos')
        .insert({
          url,
          video_id: videoId,
          title: details.title,
          thumbnail_url: details.thumbnail,
        });

      if (error) throw error;
      get().fetchVideos();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVideo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      get().fetchVideos();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
