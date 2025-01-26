export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      youtube_videos: {
        Row: {
          id: string
          url: string
          title: string
          description: string | null
          created_at: string
          user_id: string
        }
      }
      // Add other tables as needed
    }
  }
}
