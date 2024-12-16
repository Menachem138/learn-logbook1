import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../utils/youtube';
import type { Database } from '../integrations/supabase/types';

type YouTubeVideo = Database['public']['Tables']['youtube_videos']['Row'];

interface YouTubeStore {
  videos: YouTubeVideo[];
  isLoading: boolean;
  error: string | null;
  fetchVideos: () => Promise<void>;
  addVideo: (url: string) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
}

const getHebrewError = (error: string): string => {
  if (error.includes('API key')) {
    return 'מפתח ה-API של YouTube לא מוגדר';
  }
  if (error.includes('Invalid YouTube URL')) {
    return 'פורמט כתובת URL לא חוקי של YouTube';
  }
  if (error.includes('Failed to fetch')) {
    return 'שגיאה בטעינת הסרטונים';
  }
  if (error.includes('Failed to add')) {
    return 'שגיאה בהוספת הסרטון';
  }
  if (error.includes('Failed to delete')) {
    return 'שגיאה במחיקת הסרטון';
  }
  if (error.includes('Unauthorized')) {
    return 'נא להתחבר כדי לצפות בסרטונים';
  }
  return 'שגיאה לא צפויה';
};

export const useYouTubeStore = create<YouTubeStore>()(
  persist(
    (set) => ({
      videos: [],
      isLoading: false,
      error: null,

      fetchVideos: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            const hebrewError = getHebrewError('Unauthorized');
            set({ error: hebrewError, isLoading: false });
            return;
          }

          const { data, error } = await supabase
            .from('youtube_videos')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            const hebrewError = getHebrewError('Failed to fetch videos');
            set({ error: hebrewError, isLoading: false });
            return;
          }

          set({ videos: data || [], isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos';
          const hebrewError = getHebrewError(errorMessage);
          set({ error: hebrewError, isLoading: false });
        }
      },

      addVideo: async (url: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            const hebrewError = getHebrewError('Unauthorized');
            set({ error: hebrewError, isLoading: false });
            return;
          }

          if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
            throw new Error('YouTube API key is not configured');
          }

          const videoId = parseYouTubeUrl(url);
          if (!videoId) {
            throw new Error('Invalid YouTube URL format');
          }

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
            const hebrewError = getHebrewError('Failed to add video');
            set({ error: hebrewError, isLoading: false });
            throw error;
          }

          const store = useYouTubeStore.getState();
          await store.fetchVideos();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add video';
          const hebrewError = getHebrewError(errorMessage);
          set({ error: hebrewError, isLoading: false });
          throw error;
        }
      },

      deleteVideo: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            const hebrewError = getHebrewError('Unauthorized');
            set({ error: hebrewError, isLoading: false });
            return;
          }

          const { error } = await supabase
            .from('youtube_videos')
            .delete()
            .eq('id', id);

          if (error) {
            const hebrewError = getHebrewError('Failed to delete video');
            set({ error: hebrewError, isLoading: false });
            throw error;
          }

          const store = useYouTubeStore.getState();
          await store.fetchVideos();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
          const hebrewError = getHebrewError(errorMessage);
          set({ error: hebrewError, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'youtube-videos-storage',
      partialize: (state) => ({ videos: state.videos }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state?.videos?.length) {
          useYouTubeStore.setState({ videos: state.videos, isLoading: false });
        }
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            const store = useYouTubeStore.getState();
            store.fetchVideos();
          }
        });
        return state;
      },
    }
  )
);
