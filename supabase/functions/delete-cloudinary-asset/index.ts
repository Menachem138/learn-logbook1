import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts';
import { v2 as cloudinary } from 'npm:cloudinary';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

cloudinary.config({
  cloud_name: 'dxrl4mtlw',
  api_key: '616227531379291',
  api_secret: 'kS7wT7mHt_peNerzMEapZnSGhdI',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { publicId } = await req.json();
    
    if (!publicId) {
      return new Response(JSON.stringify({ error: 'Public ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Attempting to delete Cloudinary asset with public ID:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting Cloudinary asset:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete asset' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});