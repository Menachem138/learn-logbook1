'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerStats } from './TimerStats';
import { TimerState } from './types';
import { useTimerData } from '@/hooks/useTimerData';

export const StudyTimeTracker: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [time, setTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  const { 
    totalStudyTime, 
    totalBreakTime,
    loadLatestSessionData 
  } = useTimerData();

  const startTimeRef = useRef<number>(0);
  const currentSessionRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      loadLatestSessionData();
    }, 1000);

    return () => {
      clearInterval(interval);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = async (state: TimerState) => {
    if (!session?.user?.id) {
      toast({
        title: "התחברות נדרשת",
        description: "יש להתחבר כדי לעקוב אחר זמני הלמידה",
        variant: "destructive",
      });
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // End current session if exists
    if (timerState !== TimerState.STOPPED && currentSessionRef.current) {
      const elapsedTime = Date.now() - startTimeRef.current;
      await supabase
        .from('timer_sessions')
        .update({ 
          ended_at: new Date().toISOString(),
          duration: elapsedTime
        })
        .eq('id', currentSessionRef.current);
    }

    // Start new session
    const { data: newSession, error } = await supabase
      .from('timer_sessions')
      .insert({
        user_id: session.user.id,
        type: state === TimerState.STUDYING ? 'study' : 'break',
        duration: 0,
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
    setTimerState(state);
    startTimeRef.current = Date.now();
    setTime(0);
    intervalRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 10);
    }, 10);

    await loadLatestSessionData();
  };

  const stopTimer = async () => {
    if (!session?.user?.id) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (currentSessionRef.current) {
      const elapsedTime = Date.now() - startTimeRef.current;
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

    await loadLatestSessionData();
    setTimerState(TimerState.STOPPED);
    setTime(0);
    currentSessionRef.current = null;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl font-bold text-gray-800">מעקב זמן למידה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimerDisplay time={time} timerState={timerState} />
        <TimerControls 
          timerState={timerState}
          onStart={startTimer}
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