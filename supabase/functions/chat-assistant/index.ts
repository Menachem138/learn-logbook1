import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting
const requestTimestamps: { [key: string]: number[] } = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_MINUTE = 10; // Adjust based on your quota

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRequests = requestTimestamps[userId] || [];
  
  // Clean up old timestamps
  requestTimestamps[userId] = userRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (requestTimestamps[userId].length >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }
  
  requestTimestamps[userId].push(now);
  return false;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()

    // Check rate limiting
    if (isRateLimited(userId)) {
      console.log(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          details: 'Please wait a moment before sending another message'
        }),
        { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

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

    // Initialize Gemini with retries
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

    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} of ${maxAttempts} to generate response...`)
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
        console.error(`Attempt ${attempts + 1} failed:`, error)
        lastError = error
        attempts++
        
        if (attempts < maxAttempts) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000))
        }
      }
    }

    // If we get here, all attempts failed
    console.error('All attempts to generate response failed')
    throw lastError || new Error('Failed to generate response after multiple attempts')

  } catch (error) {
    console.error('Error in chat-assistant function:', error)
    
    // Determine if it's a rate limit error
    const isRateLimit = error.message?.includes('429') || 
                       error.message?.includes('RATE_LIMIT_EXCEEDED') ||
                       error.message?.includes('quota exceeded')
    
    return new Response(
      JSON.stringify({ 
        error: isRateLimit ? 'Rate limit exceeded' : 'Failed to process chat request',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: isRateLimit ? 429 : 500 
      }
    )
  }
})