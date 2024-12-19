import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface UserData {
  timerData?: {
    totalStudyTime: number;
    totalBreakTime: number;
    recentSessions: any[];
  };
  journalEntries?: any[];
  libraryItems?: any[];
  courseProgress?: any[];
}

export const fetchUserData = async (
  supabase: any,
  userId: string,
  context: string[]
): Promise<UserData> => {
  const data: UserData = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Only fetch timer data if requested
  if (context.includes('timer')) {
    const { data: timerSessions } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('started_at', today.toISOString())
      .order('started_at', { ascending: false });

    if (timerSessions) {
      const studySessions = timerSessions.filter(session => session.type === 'study');
      const breakSessions = timerSessions.filter(session => session.type === 'break');

      const totalStudyTime = studySessions.reduce((acc, session) => acc + (session.duration || 0), 0);
      const totalBreakTime = breakSessions.reduce((acc, session) => acc + (session.duration || 0), 0);

      data.timerData = {
        totalStudyTime,
        totalBreakTime,
        recentSessions: timerSessions
      };
    }
  }

  // Only fetch journal entries if requested
  if (context.includes('journal')) {
    const { data: journalEntries } = await supabase
      .from('learning_journal')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    data.journalEntries = journalEntries;
  }

  // Only fetch library items if requested
  if (context.includes('library')) {
    const { data: libraryItems } = await supabase
      .from('library_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    data.libraryItems = libraryItems;
  }

  return data;
};

export const determineContext = (message: string): string[] => {
  const context: string[] = [];
  const lowerMessage = message.toLowerCase();

  // Timer-related keywords
  if (lowerMessage.includes('time') || 
      lowerMessage.includes('study') ||
      lowerMessage.includes('break') ||
      lowerMessage.includes('timer') ||
      lowerMessage.includes('למדתי') ||
      lowerMessage.includes('הפסקה') ||
      lowerMessage.includes('זמן')) {
    context.push('timer');
  }

  // Journal-related keywords
  if (lowerMessage.includes('learn') ||
      lowerMessage.includes('journal') ||
      lowerMessage.includes('note') ||
      lowerMessage.includes('wrote') ||
      lowerMessage.includes('יומן') ||
      lowerMessage.includes('למידה') ||
      lowerMessage.includes('רשמתי')) {
    context.push('journal');
  }

  // Library-related keywords
  if (lowerMessage.includes('content') ||
      lowerMessage.includes('library') ||
      lowerMessage.includes('video') ||
      lowerMessage.includes('image') ||
      lowerMessage.includes('trading') ||
      lowerMessage.includes('pattern') ||
      lowerMessage.includes('ספרייה') ||
      lowerMessage.includes('תוכן') ||
      lowerMessage.includes('סרטון')) {
    context.push('library');
  }

  return context;
};

export const buildPrompt = (message: string, userData: UserData): string => {
  let contextInfo = '';

  if (userData.timerData) {
    const studyMinutes = Math.round(userData.timerData.totalStudyTime / 60);
    const breakMinutes = Math.round(userData.timerData.totalBreakTime / 60);
    
    if (studyMinutes > 0 || breakMinutes > 0) {
      contextInfo += `\nToday's learning activity:\n`;
      if (studyMinutes > 0) {
        contextInfo += `- Study time: ${studyMinutes} minutes\n`;
      }
      if (breakMinutes > 0) {
        contextInfo += `- Break time: ${breakMinutes} minutes\n`;
      }
    } else {
      contextInfo += `\nNo learning activity recorded today.\n`;
    }
  }

  if (userData.journalEntries?.length) {
    contextInfo += `\nRecent journal entries:\n${userData.journalEntries.map(entry => 
      `- ${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}`
    ).join('\n')}\n`;
  }

  if (userData.libraryItems?.length) {
    contextInfo += `\nRelevant library items:\n${userData.libraryItems.map(item => 
      `- ${item.title}`
    ).join('\n')}\n`;
  }

  return `You are a focused learning assistant that helps users track their study progress and access learning materials. 
You should be friendly and supportive while staying relevant to the user's questions.

Available context:${contextInfo}

User question: ${message}

Guidelines:
1. If the user asks about study time or breaks, provide the information from the timer data
2. If no data is available for what the user asked, explain this politely
3. Be friendly but focused - only include information that's relevant to the question
4. Use the context information only if it directly relates to the user's question
5. Respond in the same language as the user's question (Hebrew or English)`;
};