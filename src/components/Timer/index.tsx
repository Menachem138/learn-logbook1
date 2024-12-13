import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatTime, formatDate } from './utils';
import { DailySummary } from './DailySummary';
import { Controls } from './Controls';
import { TimeDisplay } from './TimeDisplay';

interface TimerSession {
  id: string;
  type: string;
  started_at: string;
  ended_at: string | null;
  duration: number;
}

export default function Timer() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<'study' | 'break'>('study');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [todayBreakTime, setTodayBreakTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    if (!session?.user.id) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Fetch completed sessions for today
      const { data: completedSessions, error: completedError } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today.toISOString())
        .not('ended_at', 'is', null);

      if (completedError) throw completedError;

      // Fetch active session if any
      const { data: activeSessions, error: activeError } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .is('ended_at', null);

      if (activeError) throw activeError;

      let totalStudyTime = 0;
      let totalBreakTime = 0;

      // Calculate total time from completed sessions
      completedSessions?.forEach((session: TimerSession) => {
        if (session.type === 'study') {
          totalStudyTime += session.duration;
        } else {
          totalBreakTime += session.duration;
        }
      });

      // Add time from active session if exists
      if (activeSessions && activeSessions.length > 0) {
        const activeSession = activeSessions[0];
        const startTime = new Date(activeSession.started_at);
        const currentTime = new Date();
        const duration = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);

        if (activeSession.type === 'study') {
          totalStudyTime += duration;
        } else {
          totalBreakTime += duration;
        }

        setActiveSession(activeSession.id);
        setTimerType(activeSession.type as 'study' | 'break');
        setTime(duration);
        setIsRunning(true);
      }

      setTodayStudyTime(totalStudyTime);
      setTodayBreakTime(totalBreakTime);
    } catch (error) {
      console.error('Error fetching timer sessions:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת נתוני הטיימר",
        variant: "destructive",
      });
    }
  };

  const startTimer = async () => {
    if (!session?.user.id) return;

    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .insert([
          {
            user_id: session.user.id,
            type: timerType,
            duration: 0,
            started_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data.id);
      setIsRunning(true);
      setTime(0);

      toast({
        title: "הטיימר הופעל",
        description: `התחלת ${timerType === 'study' ? 'למידה' : 'הפסקה'}`,
      });
    } catch (error) {
      console.error('Error starting timer:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהפעלת הטיימר",
        variant: "destructive",
      });
    }
  };

  const stopTimer = async () => {
    if (!session?.user.id || !activeSession) return;

    try {
      const { error } = await supabase
        .from('timer_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration: time,
        })
        .eq('id', activeSession);

      if (error) throw error;

      setIsRunning(false);
      setActiveSession(null);
      
      // Update today's totals
      if (timerType === 'study') {
        setTodayStudyTime(prev => prev + time);
      } else {
        setTodayBreakTime(prev => prev + time);
      }

      toast({
        title: "הטיימר נעצר",
        description: `סיימת ${timerType === 'study' ? 'למידה' : 'הפסקה'}`,
      });
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעצירת הטיימר",
        variant: "destructive",
      });
    }
  };

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const switchTimerType = () => {
    if (!isRunning) {
      setTimerType(prev => prev === 'study' ? 'break' : 'study');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 border rounded-lg shadow-sm">
        <TimeDisplay time={time} />
        <Controls
          isRunning={isRunning}
          timerType={timerType}
          onToggle={toggleTimer}
          onSwitch={switchTimerType}
        />
      </div>
      <DailySummary
        studyTime={todayStudyTime}
        breakTime={todayBreakTime}
      />
    </div>
  );
}
