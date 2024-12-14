import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimerState } from './types';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerSummary } from './TimerSummary';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function Timer() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [time, setTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const studyTimeRef = useRef<number>(0);
  const breakTimeRef = useRef<number>(0);
  const activeSessionRef = useRef<string | null>(null);

  useEffect(() => {
    fetchTodayStats();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchTodayStats = async () => {
    if (!session?.user.id) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { data: sessions, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;

      let studyTime = 0;
      let breakTime = 0;

      sessions?.forEach((session) => {
        if (session.type === 'study') {
          studyTime += session.duration * 1000; // Convert to milliseconds
        } else {
          breakTime += session.duration * 1000;
        }
      });

      setTotalStudyTime(studyTime);
      setTotalBreakTime(breakTime);
    } catch (error) {
      console.error('Error fetching timer sessions:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת נתוני הטיימר",
        variant: "destructive",
      });
    }
  };

  const startTimer = async (state: TimerState) => {
    if (!session?.user.id) return;

    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .insert([
          {
            user_id: session.user.id,
            type: state === TimerState.STUDYING ? 'study' : 'break',
            duration: 0,
            started_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      activeSessionRef.current = data.id;
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerState !== TimerState.STOPPED) {
        const elapsedTime = Date.now() - startTimeRef.current;
        if (timerState === TimerState.STUDYING) {
          studyTimeRef.current += elapsedTime;
        } else if (timerState === TimerState.BREAK) {
          breakTimeRef.current += elapsedTime;
        }
      }
      
      setTimerState(state);
      startTimeRef.current = Date.now();
      setTime(0);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);

      toast({
        title: "הטיימר הופעל",
        description: `התחלת ${state === TimerState.STUDYING ? 'למידה' : 'הפסקה'}`,
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
    if (!session?.user.id || !activeSessionRef.current) return;

    try {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const elapsedTime = Date.now() - startTimeRef.current;
      
      if (timerState === TimerState.STUDYING) {
        studyTimeRef.current += elapsedTime;
      } else if (timerState === TimerState.BREAK) {
        breakTimeRef.current += elapsedTime;
      }

      const duration = Math.floor(elapsedTime / 1000); // Convert to seconds for storage
      
      const { error } = await supabase
        .from('timer_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration: duration,
        })
        .eq('id', activeSessionRef.current);

      if (error) throw error;

      setTotalStudyTime(prev => prev + (timerState === TimerState.STUDYING ? elapsedTime : 0));
      setTotalBreakTime(prev => prev + (timerState === TimerState.BREAK ? elapsedTime : 0));
      setTimerState(TimerState.STOPPED);
      setTime(0);
      activeSessionRef.current = null;

      toast({
        title: "הטיימר נעצר",
        description: `סיימת ${timerState === TimerState.STUDYING ? 'למידה' : 'הפסקה'}`,
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

  const totalTime = totalStudyTime + totalBreakTime + (timerState !== TimerState.STOPPED ? time : 0);
  const studyPercentage = totalTime > 0 ? 
    ((totalStudyTime + (timerState === TimerState.STUDYING ? time : 0)) / totalTime) * 100 : 0;

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl font-bold text-gray-800">
          מעקב זמן למידה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimerDisplay time={time} timerState={timerState} />
        <TimerControls
          timerState={timerState}
          onStartStudy={() => startTimer(TimerState.STUDYING)}
          onStartBreak={() => startTimer(TimerState.BREAK)}
          onStop={stopTimer}
        />
        <TimerSummary
          totalStudyTime={totalStudyTime + (timerState === TimerState.STUDYING ? time : 0)}
          totalBreakTime={totalBreakTime + (timerState === TimerState.BREAK ? time : 0)}
          studyPercentage={studyPercentage}
        />
      </CardContent>
    </Card>
  );
}