import { useYouTubeStore } from '../youtube';
import { supabase } from '../../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../../utils/youtube';

// Mock dependencies
jest.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('../../utils/youtube', () => ({
  parseYouTubeUrl: jest.fn(),
  getYouTubeVideoDetails: jest.fn(),
}));

describe('YouTubeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useYouTubeStore.setState({ videos: [], isLoading: false, error: null });
  });

  describe('fetchVideos', () => {
    it('should fetch videos successfully', async () => {
      const mockVideos = [{
        id: '1',
        title: 'Test Video',
        url: 'https://youtu.be/123',
        video_id: '123',
        thumbnail_url: 'https://example.com/thumb.jpg',
        created_at: new Date().toISOString(),
        user_id: null,
      }];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockVideos,
            error: null
          }),
        }),
      });

      const store = useYouTubeStore.getState();
      await store.fetchVideos();

      expect(store.videos).toEqual(mockVideos);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Failed to fetch');

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: mockError
          }),
        }),
      });

      const store = useYouTubeStore.getState();
      await store.fetchVideos();

      expect(store.videos).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(mockError.message);
    });
  });

  describe('addVideo', () => {
    it('should add video successfully', async () => {
      const url = 'https://youtu.be/123';
      const videoId = '123';
      const videoDetails = {
        title: 'Test Video',
        thumbnail: 'https://example.com/thumb.jpg',
      };

      (parseYouTubeUrl as jest.Mock).mockReturnValue(videoId);
      (getYouTubeVideoDetails as jest.Mock).mockResolvedValue(videoDetails);
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          }),
        }),
      });

      const store = useYouTubeStore.getState();
      await store.addVideo(url);

      expect(parseYouTubeUrl).toHaveBeenCalledWith(url);
      expect(getYouTubeVideoDetails).toHaveBeenCalledWith(videoId);
    });

    it('should handle invalid URL', async () => {
      (parseYouTubeUrl as jest.Mock).mockReturnValue(null);

      const store = useYouTubeStore.getState();
      await expect(store.addVideo('invalid-url')).rejects.toThrow('Invalid YouTube URL');
    });
  });

  describe('deleteVideo', () => {
    it('should delete video successfully', async () => {
      const videoId = '123';

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null
          }),
        }),
      });

      const store = useYouTubeStore.getState();
      await store.deleteVideo(videoId);

      expect(supabase.from).toHaveBeenCalledWith('youtube_videos');
    });
  });
});
