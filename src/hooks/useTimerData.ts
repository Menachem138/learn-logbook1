import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

export const useTimerData = () => {
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    loadLatestSessionData();
  }, [session?.user?.id]);

  const loadLatestSessionData = async () => {
    if (!session?.user?.id) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      let studyTime = 0;
      let breakTime = 0;

      data?.forEach(session => {
        if (session.duration && session.ended_at) {
          if (session.type === 'study') {
            studyTime += session.duration;
          } else if (session.type === 'break') {
            breakTime += session.duration;
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
  };

  return {
    totalStudyTime,
    totalBreakTime,
    setTotalStudyTime,
    setTotalBreakTime,
    loadLatestSessionData
  };
};