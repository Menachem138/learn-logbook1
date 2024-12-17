import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');

    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured');
    }

    console.log(`Fetching details for video ID: ${videoId}`);
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('YouTube API Error:', error);
      throw new Error(`Failed to fetch video details: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('YouTube API Response:', data);

    if (!data.items?.[0]) {
      throw new Error('Video not found');
    }

    const videoDetails = {
      title: data.items[0].snippet.title,
      thumbnail: data.items[0].snippet.thumbnails.high.url,
    };

    return new Response(
      JSON.stringify(videoDetails),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-youtube-video-details:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});