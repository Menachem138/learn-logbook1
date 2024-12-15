import { useYouTubeStore } from '../youtube';
import { supabase } from '../../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../../utils/youtube';

// Mock the entire Supabase module
const mockSupabaseModule = {
  from: jest.fn(),
  select: jest.fn(),
  order: jest.fn(),
  insert: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn(),
};

// Mock dependencies
jest.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => {
      mockSupabaseModule.from(...args);
      return {
        select: (...args: any[]) => {
          mockSupabaseModule.select(...args);
          return {
            order: (...args: any[]) => {
              mockSupabaseModule.order(...args);
              return mockSupabaseModule.order();
            },
          };
        },
        insert: (...args: any[]) => {
          mockSupabaseModule.insert(...args);
          return mockSupabaseModule.insert();
        },
        delete: () => ({
          eq: (...args: any[]) => {
            mockSupabaseModule.eq(...args);
            return mockSupabaseModule.eq();
          },
        }),
      };
    },
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

      mockSupabaseModule.order.mockResolvedValueOnce({
        data: mockVideos,
        error: null,
        status: 200,
        statusText: 'OK',
        count: null,
      });

      const store = useYouTubeStore.getState();
      await store.fetchVideos();

      expect(mockSupabaseModule.from).toHaveBeenCalledWith('youtube_videos');
      expect(mockSupabaseModule.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseModule.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(store.videos).toEqual(mockVideos);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Failed to fetch');
      mockSupabaseModule.order.mockResolvedValueOnce({
        data: null,
        error: mockError,
        status: 500,
        statusText: 'Error',
        count: null,
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

      mockSupabaseModule.insert.mockResolvedValueOnce({
        data: null,
        error: null,
        status: 201,
        statusText: 'Created',
        count: null,
      });

      mockSupabaseModule.order.mockResolvedValueOnce({
        data: [],
        error: null,
        status: 200,
        statusText: 'OK',
        count: null,
      });

      const store = useYouTubeStore.getState();
      await store.addVideo(url);

      expect(parseYouTubeUrl).toHaveBeenCalledWith(url);
      expect(getYouTubeVideoDetails).toHaveBeenCalledWith(videoId);
      expect(mockSupabaseModule.insert).toHaveBeenCalledWith({
        url,
        video_id: videoId,
        title: videoDetails.title,
        thumbnail_url: videoDetails.thumbnail,
      });
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

      mockSupabaseModule.eq.mockResolvedValueOnce({
        data: null,
        error: null,
        status: 200,
        statusText: 'OK',
        count: null,
      });

      mockSupabaseModule.order.mockResolvedValueOnce({
        data: [],
        error: null,
        status: 200,
        statusText: 'OK',
        count: null,
      });

      const store = useYouTubeStore.getState();
      await store.deleteVideo(videoId);

      expect(mockSupabaseModule.from).toHaveBeenCalledWith('youtube_videos');
      expect(mockSupabaseModule.eq).toHaveBeenCalledWith('id', videoId);
    });
  });
});
