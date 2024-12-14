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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { data: sessions, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      let studyTime = 0;
      let breakTime = 0;

      sessions?.forEach(session => {
        if (session.ended_at) {
          // For completed sessions, use the duration field
          if (session.type === 'study') {
            studyTime += session.duration || 0;
          } else if (session.type === 'break') {
            breakTime += session.duration || 0;
          }
        } else if (session.started_at) {
          // For ongoing sessions, calculate current duration
          const currentDuration = Date.now() - new Date(session.started_at).getTime();
          if (session.type === 'study') {
            studyTime += currentDuration;
          } else if (session.type === 'break') {
            breakTime += currentDuration;
          }
        }
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
    // Load data immediately when the component mounts
    loadLatestSessionData();

    // Set up interval to refresh data
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