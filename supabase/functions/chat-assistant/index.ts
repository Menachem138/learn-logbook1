import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory rate limiting
const requestTimestamps: { [key: string]: number[] } = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_MINUTE = 5;

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

// Retry logic with exponential backoff
async function fetchWithRetry(model: any, prompt: string, retries = 3, baseDelay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return await result.response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if (error.message?.includes('429') || error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        if (i === retries - 1) throw error; // Last retry, propagate the error
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Rate limit hit. Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error; // For non-rate-limit errors, propagate immediately
    }
  }
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
    const [journalEntries, timerSessions, studyGoals, courseProgress] = await Promise.all([
      supabase.from('learning_journal')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('timer_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'study')
        .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('started_at', { ascending: false }),
      supabase.from('study_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .limit(3),
      supabase.from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
    ])

    // Calculate total study time for today
    const totalStudyTime = timerSessions.data?.reduce((acc, session) => {
      return acc + (session.duration || 0)
    }, 0) || 0
    const studyHours = Math.floor(totalStudyTime / (1000 * 60 * 60))
    const studyMinutes = Math.floor((totalStudyTime % (1000 * 60 * 60)) / (1000 * 60))

    // Prepare context from fetched data
    const context = {
      studyTime: `${studyHours} hours and ${studyMinutes} minutes today`,
      recentJournalEntries: journalEntries.data?.map(entry => ({
        content: entry.content,
        date: new Date(entry.created_at).toLocaleDateString()
      })) || [],
      activeGoals: studyGoals.data?.map(goal => ({
        title: goal.title,
        description: goal.description,
        deadline: goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'
      })) || [],
      completedLessons: courseProgress.data?.length || 0
    }

    // Initialize Gemini
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    console.log('Initializing Gemini model...')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Prepare the prompt with context
    const prompt = `You are a helpful AI assistant that has access to the user's learning data. 
    Here is the relevant context about their learning journey:
    
    Study Time: ${context.studyTime}
    Recent Journal Entries: ${JSON.stringify(context.recentJournalEntries, null, 2)}
    Active Goals: ${JSON.stringify(context.activeGoals, null, 2)}
    Completed Lessons: ${context.completedLessons}
    
    User Question: ${message}
    
    Please provide a helpful response based on this context. Reference their study time, goals, or journal entries when relevant.
    Keep the response natural and conversational, and provide specific suggestions based on their learning journey.`

    // Use retry logic for the Gemini API call
    console.log('Generating response with retry logic...')
    const response = await fetchWithRetry(model, prompt)
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