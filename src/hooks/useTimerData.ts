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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: sessions, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('started_at', today.toISOString());

      if (error) throw error;

      let studyTime = 0;
      let breakTime = 0;

      sessions?.forEach(session => {
        const startTime = new Date(session.started_at).getTime();
        const endTime = session.ended_at ? new Date(session.ended_at).getTime() : Date.now();
        const duration = endTime - startTime;

        if (session.type === 'study') {
          studyTime += duration;
        } else if (session.type === 'break') {
          breakTime += duration;
        }
      });

      console.log('Calculated times:', { 
        studyTime: Math.floor(studyTime / 1000),
        breakTime: Math.floor(breakTime / 1000)
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
    const intervalId = setInterval(loadLatestSessionData, 1000);
    return () => clearInterval(intervalId);
  }, [loadLatestSessionData]);

  return {
    totalStudyTime,
    totalBreakTime,
    loadLatestSessionData
  };
};