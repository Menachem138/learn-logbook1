import { parseYouTubeUrl, isValidYouTubeUrl } from '../youtube';

describe('YouTube Utils', () => {
  describe('parseYouTubeUrl', () => {
    it('should parse youtube.com watch URLs', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(parseYouTubeUrl(url)).toBe('dQw4w9WgXcQ');
    });

    it('should parse youtu.be URLs', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(parseYouTubeUrl(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URLs', () => {
      const url = 'https://example.com';
      expect(parseYouTubeUrl(url)).toBeNull();
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('should return true for valid youtube.com URLs', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(isValidYouTubeUrl(url)).toBe(true);
    });

    it('should return true for valid youtu.be URLs', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(isValidYouTubeUrl(url)).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      const url = 'https://example.com';
      expect(isValidYouTubeUrl(url)).toBe(false);
    });
  });
});
