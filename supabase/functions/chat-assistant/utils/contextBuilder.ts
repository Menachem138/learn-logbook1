import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface UserData {
  timerData?: {
    totalStudyTime: number;
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
  
  // Only fetch timer data if requested
  if (context.includes('timer')) {
    const { data: timerSessions } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (timerSessions) {
      const totalStudyTime = timerSessions
        .filter(session => session.type === 'study')
        .reduce((acc, session) => acc + (session.duration || 0), 0);

      data.timerData = {
        totalStudyTime,
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

  // Only fetch course progress if requested
  if (context.includes('course')) {
    const { data: courseProgress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    data.courseProgress = courseProgress;
  }

  return data;
};

export const determineContext = (message: string): string[] => {
  const context: string[] = [];

  // Timer-related keywords
  if (message.toLowerCase().includes('time') || 
      message.toLowerCase().includes('study') ||
      message.toLowerCase().includes('break') ||
      message.toLowerCase().includes('timer')) {
    context.push('timer');
  }

  // Journal-related keywords
  if (message.toLowerCase().includes('learn') ||
      message.toLowerCase().includes('journal') ||
      message.toLowerCase().includes('note') ||
      message.toLowerCase().includes('wrote')) {
    context.push('journal');
  }

  // Library-related keywords
  if (message.toLowerCase().includes('content') ||
      message.toLowerCase().includes('library') ||
      message.toLowerCase().includes('video') ||
      message.toLowerCase().includes('image') ||
      message.toLowerCase().includes('trading') ||
      message.toLowerCase().includes('pattern')) {
    context.push('library');
  }

  // Course-related keywords
  if (message.toLowerCase().includes('course') ||
      message.toLowerCase().includes('progress') ||
      message.toLowerCase().includes('lesson')) {
    context.push('course');
  }

  return context;
};

export const buildPrompt = (message: string, userData: UserData): string => {
  let contextInfo = '';

  if (userData.timerData) {
    contextInfo += `\nUser's study time today: ${Math.round(userData.timerData.totalStudyTime / 60)} minutes\n`;
  }

  if (userData.journalEntries?.length) {
    contextInfo += `\nRecent journal entries: ${userData.journalEntries.map(entry => entry.content).join('\n')}\n`;
  }

  if (userData.libraryItems?.length) {
    contextInfo += `\nRelevant library items: ${userData.libraryItems.map(item => item.title).join(', ')}\n`;
  }

  if (userData.courseProgress?.length) {
    contextInfo += `\nCourse progress available: ${userData.courseProgress.length} lessons completed\n`;
  }

  return `You are a focused learning assistant. Answer questions directly and concisely, using only the relevant information provided.
User context:${contextInfo}

User question: ${message}

Remember:
1. Only use the context information if it's directly relevant to the question
2. Keep responses focused and avoid unnecessary explanations
3. Use clear formatting without excessive symbols
4. Only provide additional details if explicitly requested`;
};