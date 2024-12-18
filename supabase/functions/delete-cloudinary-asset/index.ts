import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { v2 as cloudinary } from 'https://esm.sh/cloudinary@1.37.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: Deno.env.get('CLOUDINARY_CLOUD_NAME'),
      api_key: Deno.env.get('CLOUDINARY_API_KEY'),
      api_secret: Deno.env.get('CLOUDINARY_API_SECRET'),
    })

    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Parse request body
    const { publicId } = await req.json()
    
    if (!publicId) {
      throw new Error('Public ID is required')
    }

    console.log('Attempting to delete asset with public ID:', publicId)

    // Delete the asset from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)
    console.log('Cloudinary deletion result:', result)

    return new Response(
      JSON.stringify({ result: 'ok', details: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in delete-cloudinary-asset function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})