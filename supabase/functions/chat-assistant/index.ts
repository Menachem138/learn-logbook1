import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch relevant data from Supabase
    console.log('Fetching user data from Supabase...')
    const [journalEntries, libraryItems, tweets, youtubeVideos] = await Promise.all([
      supabase.from('learning_journal').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('library_items').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('tweets').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('youtube_videos').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)
    ])

    // Prepare context from fetched data
    const context = {
      journal: journalEntries.data || [],
      library: libraryItems.data || [],
      tweets: tweets.data || [],
      videos: youtubeVideos.data || []
    }

    // Initialize Gemini
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    console.log('Initializing Gemini model...')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Prepare the prompt with context
    const prompt = `You are a helpful AI assistant that has access to the user's learning materials and content. 
    Here is the relevant context from their data:
    
    Journal Entries: ${JSON.stringify(context.journal)}
    Library Items: ${JSON.stringify(context.library)}
    Tweets: ${JSON.stringify(context.tweets)}
    YouTube Videos: ${JSON.stringify(context.videos)}
    
    User Question: ${message}
    
    Please provide a helpful response based on this context. If the user asks about specific content, reference it directly.
    If the user asks about media or files, provide information about their existence and content.
    Keep the response natural and conversational.`

    console.log('Sending request to Gemini...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('Successfully generated response')
    return new Response(
      JSON.stringify({ response: text }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in chat-assistant function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})