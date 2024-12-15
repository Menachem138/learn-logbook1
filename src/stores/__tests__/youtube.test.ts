import { useYouTubeStore } from '../youtube';
import { supabase } from '../../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../../utils/youtube';

// Mock dependencies
jest.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
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

      (supabase.from as jest.Mock).mockImplementationOnce(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: mockVideos, error: null })),
        })),
      }));

      const store = useYouTubeStore.getState();
      await store.fetchVideos();

      expect(store.videos).toEqual(mockVideos);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
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

      const store = useYouTubeStore.getState();
      await store.addVideo(url);

      expect(parseYouTubeUrl).toHaveBeenCalledWith(url);
      expect(getYouTubeVideoDetails).toHaveBeenCalledWith(videoId);
      expect(supabase.from).toHaveBeenCalledWith('youtube_videos');
    });
  });

  describe('deleteVideo', () => {
    it('should delete video successfully', async () => {
      const videoId = '123';

      const store = useYouTubeStore.getState();
      await store.deleteVideo(videoId);

      expect(supabase.from).toHaveBeenCalledWith('youtube_videos');
    });
  });
});
