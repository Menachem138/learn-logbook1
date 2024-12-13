import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received request with message:', message, 'and userId:', userId);

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

    // Fetch user's progress and other data
    const [progress, journalEntries, schedules, activeTimerSessions, completedTimerSessions] = await Promise.all([
      supabase.from('course_progress').select('lesson_id').eq('user_id', userId).eq('completed', true),
      supabase.from('learning_journal').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('schedules').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('timer_sessions').select('*').eq('user_id', userId).is('ended_at', null),
      supabase.from('timer_sessions').select('*').eq('user_id', userId).not('ended_at', 'is', null)
        .gte('ended_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    ]);

    // Calculate study times
    let todaysStudyTime = 0;
    let todaysBreakTime = 0;

    // Process completed sessions
    if (completedTimerSessions.data) {
      completedTimerSessions.data.forEach(session => {
        if (session.type === 'study') {
          todaysStudyTime += session.duration || 0;
        } else if (session.type === 'break') {
          todaysBreakTime += session.duration || 0;
        }
      });
    }

    // Add active sessions
    if (activeTimerSessions.data) {
      const now = new Date();
      activeTimerSessions.data.forEach(session => {
        const startTime = new Date(session.started_at);
        const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        
        if (session.type === 'study') {
          todaysStudyTime += duration;
        } else if (session.type === 'break') {
          todaysBreakTime += duration;
        }
      });
    }

    const completedLessons = progress.data?.length || 0;
    const totalLessons = 206;

    // Format schedule data
    const formattedSchedule = schedules.data?.map(schedule => {
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
      ${journalEntries.data?.map(entry => 
        `- ${entry.content} ${entry.is_important ? '(חשוב)' : ''} - ${new Date(entry.created_at).toLocaleDateString('he-IL')}`
      ).join('\n') || 'אין רשומות יומן אחרונות'}
    `;

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Sending request to OpenAI with context');

    // Call OpenAI API with retries
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
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
            ],
            temperature: 0.7,
          }),
        });

        if (!openAiResponse.ok) {
          const errorData = await openAiResponse.text();
          console.error('OpenAI API Error:', errorData);
          
          if (errorData.includes('billing_not_active')) {
            throw new Error('העוזר האישי אינו זמין כרגע עקב בעיית חיוב. אנא נסה שוב מאוחר יותר.');
          }
          
          throw new Error(`שגיאה בשירות העוזר האישי: ${openAiResponse.status}`);
        }

        const data = await openAiResponse.json();
        console.log('Received response from OpenAI:', data);

        if (!data?.choices?.[0]?.message?.content) {
          throw new Error('תשובה לא תקינה מהעוזר האישי');
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
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        lastError = error;
        retryCount++;
        
        if (error.message.includes('בעיית חיוב')) {
          // Don't retry billing errors
          break;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    // If we get here, all retries failed
    throw lastError || new Error('שגיאה בלתי צפויה בשירות העוזר האישי');

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