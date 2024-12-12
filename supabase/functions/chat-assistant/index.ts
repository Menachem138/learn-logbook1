import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch user's learning data
    const { data: progress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)

    const { data: journalEntries } = await supabase
      .from('learning_journal')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: libraryItems } = await supabase
      .from('library_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate completion percentage
    const totalLessons = 20 // Update this based on your actual total
    const completedLessons = progress?.filter(p => p.completed).length || 0
    const completionPercentage = (completedLessons / totalLessons) * 100

    // Create context for the AI
    const context = `
      Current learning progress: ${completionPercentage.toFixed(1)}% complete (${completedLessons}/${totalLessons} lessons)
      
      Recent journal entries:
      ${journalEntries?.map(entry => `- ${entry.content}`).join('\n')}
      
      Recent library items:
      ${libraryItems?.map(item => `- ${item.title}: ${item.content}`).join('\n')}
    `

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a supportive learning assistant for a cryptocurrency trading course. 
        You have access to the student's learning data and can provide personalized feedback and support.
        You should be encouraging but also honest about areas where improvement is needed.
        Always respond in Hebrew and maintain a friendly, supportive tone.
        
        Here is the current context about the student's progress:
        ${context}`
      },
      {
        role: 'user',
        content: message
      }
    ]

    // Call OpenAI API
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
      }),
    })

    const data = await openAiResponse.json()

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    )
  }
})