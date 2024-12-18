import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { v2 as cloudinary } from "https://esm.sh/cloudinary@1.37.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Log environment variables (without secrets)
    console.log('Checking Cloudinary configuration...')
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials')
      throw new Error('Cloudinary configuration is incomplete')
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Parse and validate request body
    const body = await req.json()
    console.log('Received request body:', { ...body, apiKey: '[REDACTED]' })
    
    const { publicId } = body
    if (!publicId) {
      return new Response(
        JSON.stringify({ error: 'Public ID is required' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        }
      )
    }

    console.log('Attempting to delete Cloudinary asset with public ID:', publicId)
    const result = await cloudinary.uploader.destroy(publicId)
    console.log('Cloudinary deletion result:', result)

    return new Response(
      JSON.stringify({ result: 'ok', details: result }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})