import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerStats } from './TimerStats';

export const StudyTimeTracker: React.FC = () => {
  const [timerState, setTimerState] = useState<'STOPPED' | 'STUDYING' | 'BREAK'>('STOPPED');
  const [time, setTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const startTimeRef = useRef<number>(0);
  const studyTimeRef = useRef<number>(0);
  const breakTimeRef = useRef<number>(0);
  const currentSessionRef = useRef<string | null>(null);

  const stopTimer = useCallback(async () => {
    if (!session?.user?.id) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const elapsedTime = Date.now() - startTimeRef.current;
    
    if (timerState === 'STUDYING') {
      studyTimeRef.current += elapsedTime;
    } else if (timerState === 'BREAK') {
      breakTimeRef.current += elapsedTime;
    }

    if (currentSessionRef.current) {
      const { error } = await supabase
        .from('timer_sessions')
        .update({ 
          ended_at: new Date().toISOString(),
          duration: elapsedTime
        })
        .eq('id', currentSessionRef.current);

      if (error) {
        console.error('Error stopping timer session:', error);
        toast({
          title: "שגיאה בשמירת הנתונים",
          description: "לא ניתן לשמור את זמני הלמידה כרגע",
          variant: "destructive",
        });
      }
    }

    setTotalStudyTime(studyTimeRef.current);
    setTotalBreakTime(breakTimeRef.current);
    setTimerState('STOPPED');
    setTime(0);
    currentSessionRef.current = null;
  }, [session?.user?.id, timerState, toast]);

  const startTimer = useCallback(async (newState: 'STUDYING' | 'BREAK') => {
    if (!session?.user?.id) {
      toast({
        title: "התחברות נדרשת",
        description: "יש להתחבר כדי לעקוב אחר זמני הלמידה",
        variant: "destructive",
      });
      return;
    }

    // Stop current timer if running
    if (timerState !== 'STOPPED') {
      await stopTimer();
    }

    // Start new session
    const { data: newSession, error } = await supabase
      .from('timer_sessions')
      .insert({
        user_id: session.user.id,
        type: newState.toLowerCase(),
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting timer session:', error);
      toast({
        title: "שגיאה בשמירת הנתונים",
        description: "לא ניתן לשמור את זמני הלמידה כרגע",
        variant: "destructive",
      });
      return;
    }

    currentSessionRef.current = newSession.id;
    setTimerState(newState);
    startTimeRef.current = Date.now();
    setTime(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 10);
    }, 10);
  }, [session?.user?.id, timerState, stopTimer, toast]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl font-bold text-gray-800">מעקב זמן למידה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimerDisplay time={time} timerState={timerState} />
        <TimerControls
          timerState={timerState}
          onStartStudy={() => startTimer('STUDYING')}
          onStartBreak={() => startTimer('BREAK')}
          onStop={stopTimer}
        />
        <TimerStats
          totalStudyTime={totalStudyTime}
          totalBreakTime={totalBreakTime}
          currentTime={time}
          timerState={timerState}
        />
      </CardContent>
    </Card>
  );
};