import { useYouTubeStore } from '../youtube';
import { supabase } from '../../integrations/supabase/client';
import { parseYouTubeUrl, getYouTubeVideoDetails } from '../../utils/youtube';

// Mock dependencies
jest.mock('../../integrations/supabase/client', () => {
  const mockOrder = jest.fn();
  const mockEq = jest.fn();
  const mockInsert = jest.fn();
  const mockSelect = jest.fn(() => ({ order: mockOrder }));
  const mockDelete = jest.fn(() => ({ eq: mockEq }));
  const mockFrom = jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
  }));

  return {
    supabase: {
      from: mockFrom,
    },
  };
});

jest.mock('../../utils/youtube', () => ({
  parseYouTubeUrl: jest.fn(),
  getYouTubeVideoDetails: jest.fn(),
}));

describe('YouTubeStore', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockOrder: jest.Mock;
  let mockInsert: jest.Mock;
  let mockDelete: jest.Mock;
  let mockEq: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useYouTubeStore.setState({ videos: [], isLoading: false, error: null });

    // Get mock functions
    mockFrom = (supabase.from as jest.Mock);
    mockSelect = mockFrom().select;
    mockOrder = mockSelect().order;
    mockInsert = mockFrom().insert;
    mockDelete = mockFrom().delete;
    mockEq = mockDelete().eq;
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

      mockOrder.mockResolvedValueOnce({
        data: mockVideos,
        error: null,
      });

      const store = useYouTubeStore.getState();
      await store.fetchVideos();

      expect(mockFrom).toHaveBeenCalledWith('youtube_videos');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(store.videos).toEqual(mockVideos);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Failed to fetch');
      mockOrder.mockResolvedValueOnce({
        data: null,
        error: mockError,
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

      mockInsert.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const store = useYouTubeStore.getState();
      await store.addVideo(url);

      expect(parseYouTubeUrl).toHaveBeenCalledWith(url);
      expect(getYouTubeVideoDetails).toHaveBeenCalledWith(videoId);
      expect(mockInsert).toHaveBeenCalledWith({
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

      mockEq.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const store = useYouTubeStore.getState();
      await store.deleteVideo(videoId);

      expect(mockFrom).toHaveBeenCalledWith('youtube_videos');
      expect(mockEq).toHaveBeenCalledWith('id', videoId);
    });
  });
});
