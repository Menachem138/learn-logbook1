import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

    // Fetch user's progress
    const { data: progress, error: progressError } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true)

    if (progressError) {
      console.error('Error fetching progress:', progressError)
    }

    // Fetch learning journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('learning_journal')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (journalError) {
      console.error('Error fetching journal:', journalError)
    }

    // Fetch library items
    const { data: libraryItems, error: libraryError } = await supabase
      .from('library_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (libraryError) {
      console.error('Error fetching library:', libraryError)
    }

    // Fetch questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
    }

    // Fetch schedule
    const { data: schedules, error: schedulesError } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError)
    }

    // Fetch recent timer sessions
    const { data: timerSessions, error: timerError } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (timerError) {
      console.error('Error fetching timer sessions:', timerError)
    }

    const completedLessons = progress?.length || 0
    const totalLessons = 206

    // Calculate total study and break time for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaysSessions = timerSessions?.filter(session => {
      const sessionDate = new Date(session.created_at)
      return sessionDate >= today
    }) || []

    const todaysStudyTime = todaysSessions
      .filter(session => session.type === 'study')
      .reduce((total, session) => total + (session.duration || 0), 0)

    const todaysBreakTime = todaysSessions
      .filter(session => session.type === 'break')
      .reduce((total, session) => total + (session.duration || 0), 0)

    // Create context with all user data
    const context = `
      Current learning progress: ${completedLessons} out of ${totalLessons} lessons completed (${((completedLessons / totalLessons) * 100).toFixed(1)}%).

      Today's study time: ${Math.floor(todaysStudyTime / 60)} hours and ${todaysStudyTime % 60} minutes
      Today's break time: ${Math.floor(todaysBreakTime / 60)} hours and ${todaysBreakTime % 60} minutes

      Weekly Schedule:
      ${schedules?.map(schedule => `
        ${schedule.day_name}:
        ${JSON.stringify(schedule.schedule, null, 2)}
      `).join('\n') || 'No schedule set up yet.'}

      Recent journal entries:
      ${journalEntries?.map(entry => `- ${entry.content} (${entry.is_important ? 'Important' : 'Regular'}) - ${new Date(entry.created_at).toLocaleDateString()}`).join('\n') || 'No recent journal entries.'}

      Recent library items:
      ${libraryItems?.map(item => `- ${item.title}: ${item.content} (Type: ${item.type})`).join('\n') || 'No recent library items.'}

      Recent questions:
      ${questions?.map(q => `- Q: ${q.content}${q.answer ? `\n  A: ${q.answer}` : ' (Unanswered)'}`).join('\n') || 'No recent questions.'}
    `

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a supportive learning assistant for a cryptocurrency trading course. 
        You have access to the student's learning data and can provide personalized feedback and support.
        You should be encouraging but also honest about areas where improvement is needed.
        Always respond in Hebrew and maintain a friendly, supportive tone.
        
        Here is the current context about the student's progress and activities:
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
        model: 'gpt-4o',
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