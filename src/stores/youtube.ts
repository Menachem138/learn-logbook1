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
    return 'מפתח ה-API של YouTube לא מוגדר. אנא פנה למנהל המערכת.';
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
    (set, get) => ({
      videos: [],
      isLoading: false,
      error: null,

      fetchVideos: async () => {
        console.log('Fetching videos from Supabase...');
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('Unauthorized');
          }

          const { data, error } = await supabase
            .from('youtube_videos')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ videos: data || [], isLoading: false, error: null });
        } catch (error) {
          console.error('Error in fetchVideos:', error);
          set({ error: getHebrewError(error.message), isLoading: false });
        }
      },

      addVideo: async (url: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('Unauthorized');
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
              user_id: user.id,
            });

          if (error) throw error;
          await get().fetchVideos();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add video';
          set({ error: getHebrewError(errorMessage), isLoading: false });
          throw error;
        }
      },

      deleteVideo: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('Unauthorized');
          }

          const { error } = await supabase
            .from('youtube_videos')
            .delete()
            .eq('id', id);

          if (error) throw error;
          await get().fetchVideos();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
          set({ error: getHebrewError(errorMessage), isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'youtube-videos',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (error) {
            console.error('Error parsing storage:', error);
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        videos: state.videos,
        isLoading: state.isLoading,
        error: state.error
      }),
    }
  )
);