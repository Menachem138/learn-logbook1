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
      // Get today's date at midnight
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
        // Calculate duration based on whether the session has ended or is ongoing
        let sessionDuration = 0;
        
        if (session.ended_at) {
          // For completed sessions
          sessionDuration = new Date(session.ended_at).getTime() - new Date(session.started_at).getTime();
        } else {
          // For ongoing sessions
          sessionDuration = Date.now() - new Date(session.started_at).getTime();
        }

        // Add to appropriate total
        if (session.type === 'study') {
          studyTime += sessionDuration;
        } else if (session.type === 'break') {
          breakTime += sessionDuration;
        }
      });

      console.log('Updated totals:', { studyTime, breakTime });
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
    // Load data immediately when the component mounts
    loadLatestSessionData();

    // Set up interval to refresh data every second
    const intervalId = setInterval(loadLatestSessionData, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [loadLatestSessionData]);

  return {
    totalStudyTime,
    totalBreakTime,
    loadLatestSessionData
  };
};