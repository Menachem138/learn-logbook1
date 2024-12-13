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

    // Fetch schedule
    const { data: schedules, error: schedulesError } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError)
    }

    // Fetch recent timer sessions with better date handling
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: timerSessions, error: timerError } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (timerError) {
      console.error('Error fetching timer sessions:', timerError)
    }

    console.log('Timer sessions found:', timerSessions)

    const completedLessons = progress?.length || 0
    const totalLessons = 206

    // Calculate total study and break time for today with proper duration handling
    const todaysStudyTime = timerSessions
      ?.filter(session => session.type === 'study')
      .reduce((total, session) => total + (session.duration || 0), 0) || 0

    const todaysBreakTime = timerSessions
      ?.filter(session => session.type === 'break')
      .reduce((total, session) => total + (session.duration || 0), 0) || 0

    console.log('Calculated study time:', todaysStudyTime)
    console.log('Calculated break time:', todaysBreakTime)

    // Format schedule data for better readability
    const formattedSchedule = schedules?.map(schedule => {
      return `${schedule.day_name}:\n${schedule.schedule.map((item: any) => 
        `  - ${item.time}: ${item.activity}`
      ).join('\n')}`
    }).join('\n\n') || 'לא נמצא לוח זמנים'

    // Create context with all user data
    const context = `
      מידע על ההתקדמות שלך:
      - השלמת ${completedLessons} מתוך ${totalLessons} שיעורים (${((completedLessons / totalLessons) * 100).toFixed(1)}%).
      
      זמני למידה להיום:
      - זמן למידה: ${Math.floor(todaysStudyTime / 60)} שעות ו-${todaysStudyTime % 60} דקות
      - זמן הפסקות: ${Math.floor(todaysBreakTime / 60)} שעות ו-${todaysBreakTime % 60} דקות
      
      לוח הזמנים השבועי שלך:
      ${formattedSchedule}

      רשומות יומן אחרונות:
      ${journalEntries?.map(entry => 
        `- ${entry.content} ${entry.is_important ? '(חשוב)' : ''} - ${new Date(entry.created_at).toLocaleDateString('he-IL')}`
      ).join('\n') || 'אין רשומות יומן אחרונות'}
    `

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `אתה עוזר לימודי תומך לקורס מסחר בקריפטו. 
        יש לך גישה לנתוני הלמידה של התלמיד ואתה יכול לספק משוב ותמיכה מותאמים אישית.
        עליך להיות מעודד אך גם כנה לגבי תחומים הדורשים שיפור.
        תמיד ענה בעברית ושמור על טון ידידותי ותומך.
        
        הנה ההקשר הנוכחי על התקדמות התלמיד ופעילויותיו:
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
        model: 'gpt-4',
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