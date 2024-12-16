/**
 * Parses a YouTube URL to extract the video ID
 * Supports both formats:
 * - https://www.youtube.com/watch?v=XXXXXXXXXXX
 * - https://youtu.be/XXXXXXXXXXX
 */
export function parseYouTubeUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

/**
 * Fetches video details from YouTube API
 */
export async function getYouTubeVideoDetails(videoId: string) {
  // Check if API key is configured
  if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch video details');
  }

  const data = await response.json();

  if (!data.items?.[0]) {
    throw new Error('Video not found');
  }

  return {
    title: data.items[0].snippet.title,
    thumbnail: data.items[0].snippet.thumbnails.high.url,
  };
}

/**
 * Validates a YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return !!parseYouTubeUrl(url);
}