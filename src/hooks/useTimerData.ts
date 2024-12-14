import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

export const useTimerData = () => {
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const { toast } = useToast();
  const { session } = useAuth();

  const loadLatestSessionData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      // Get the start of today in the user's timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: sessions, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('started_at', today.toISOString())
        .order('started_at', { ascending: true });

      if (error) throw error;

      let studyTime = 0;
      let breakTime = 0;

      sessions?.forEach(session => {
        if (!session.started_at) return;
        
        const startTime = new Date(session.started_at).getTime();
        // אם אין זמן סיום, נשתמש בזמן הנוכחי
        const endTime = session.ended_at ? new Date(session.ended_at).getTime() : Date.now();
        const duration = endTime - startTime;

        // נוסיף את משך הזמן לסך הכולל בהתאם לסוג הסשן
        if (session.type === 'study') {
          studyTime += duration;
        } else if (session.type === 'break') {
          breakTime += duration;
        }
      });

      console.log('Updated session times:', {
        studyTime: Math.floor(studyTime / 1000 / 60), // Convert to minutes for logging
        breakTime: Math.floor(breakTime / 1000 / 60)  // Convert to minutes for logging
      });

      setTotalStudyTime(studyTime);
      setTotalBreakTime(breakTime);

    } catch (error: any) {
      console.error('Error loading timer sessions:', error);
      toast({
        title: "שגיאה בטעינת נתוני הטיימר",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    loadLatestSessionData();
    // נעדכן כל 5 שניות
    const intervalId = setInterval(loadLatestSessionData, 5000);
    return () => clearInterval(intervalId);
  }, [loadLatestSessionData]);

  return {
    totalStudyTime,
    totalBreakTime,
    loadLatestSessionData
  };
};