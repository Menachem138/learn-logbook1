import { RealtimeChannel } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      youtube_videos: {
        Row: {
          id: string;
          created_at: string;
          url: string;
          video_id: string;
          title: string;
          thumbnail_url: string;
        };
        Insert: {
          url: string;
          video_id: string;
          title: string;
          thumbnail_url: string;
        };
      };
    };
  };
}
