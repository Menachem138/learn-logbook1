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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's progress
    const { data: progress, error: progressError } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }

    // Fetch learning journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('learning_journal')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (journalError) {
      console.error('Error fetching journal:', journalError);
    }

    // Fetch schedule
    const { data: schedules, error: schedulesError } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError);
    }

    // Get active timer sessions
    const { data: activeTimerSessions, error: activeTimerError } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('ended_at', null);

    if (activeTimerError) {
      console.error('Error fetching active timer sessions:', activeTimerError);
    }

    // Get completed timer sessions for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: completedTimerSessions, error: completedTimerError } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', userId)
      .not('ended_at', 'is', null)
      .gte('ended_at', today.toISOString());

    if (completedTimerError) {
      console.error('Error fetching completed timer sessions:', completedTimerError);
    }

    // Calculate total study and break times
    let todaysStudyTime = 0;
    let todaysBreakTime = 0;

    // Process completed sessions
    if (completedTimerSessions) {
      completedTimerSessions.forEach(session => {
        if (session.type === 'study') {
          todaysStudyTime += session.duration || 0;
        } else if (session.type === 'break') {
          todaysBreakTime += session.duration || 0;
        }
      });
    }

    // Add active sessions
    if (activeTimerSessions) {
      const now = new Date();
      activeTimerSessions.forEach(session => {
        const startTime = new Date(session.started_at);
        const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        
        if (session.type === 'study') {
          todaysStudyTime += duration;
        } else if (session.type === 'break') {
          todaysBreakTime += duration;
        }
      });
    }

    const completedLessons = progress?.length || 0;
    const totalLessons = 206;

    // Format schedule data
    const formattedSchedule = schedules?.map(schedule => {
      return `${schedule.day_name}:\n${schedule.schedule.map((item: any) => 
        `  - ${item.time}: ${item.activity}`
      ).join('\n')}`;
    }).join('\n\n') || 'לא נמצא לוח זמנים';

    // Create context with all user data
    const context = `
      מידע על ההתקדמות שלך:
      - השלמת ${completedLessons} מתוך ${totalLessons} שיעורים (${((completedLessons / totalLessons) * 100).toFixed(1)}%).
      
      זמני למידה להיום:
      - זמן למידה: ${Math.floor(todaysStudyTime / 60)} דקות
      - זמן הפסקות: ${Math.floor(todaysBreakTime / 60)} דקות
      
      לוח הזמנים השבועי שלך:
      ${formattedSchedule}

      רשומות יומן אחרונות:
      ${journalEntries?.map(entry => 
        `- ${entry.content} ${entry.is_important ? '(חשוב)' : ''} - ${new Date(entry.created_at).toLocaleDateString('he-IL')}`
      ).join('\n') || 'אין רשומות יומן אחרונות'}
    `;

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
    ];

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Call OpenAI API
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
      }),
    });

    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${openAiResponse.status} ${errorData}`);
    }

    const data = await openAiResponse.json();

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    );
  }
});