import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatTime } from '@/utils/timeUtils';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerHistory } from './TimerHistory';

type TimerState = 'STOPPED' | 'STUDYING' | 'BREAK';

export const StudyTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>('STOPPED');
  const [time, setTime] = useState<number>(0);
  const [sessions, setSessions] = useState<any[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { session } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadSessions = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error loading sessions:', error);
      toast.error('שגיאה בטעינת ההיסטוריה');
      return;
    }

    setSessions(data || []);
  };

  const startTimer = async (type: 'study' | 'break') => {
    if (!session?.user?.id) {
      toast.error('יש להתחבר כדי להשתמש בטיימר');
      return;
    }

    if (currentSessionId) {
      await stopTimer();
    }

    const { data, error } = await supabase
      .from('timer_sessions')
      .insert({
        user_id: session.user.id,
        type,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting timer:', error);
      toast.error('שגיאה בהפעלת הטיימר');
      return;
    }

    setCurrentSessionId(data.id);
    setTimerState(type === 'study' ? 'STUDYING' : 'BREAK');
    setTime(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 1000);
    }, 1000);
  };

  const stopTimer = async () => {
    if (!session?.user?.id || !currentSessionId) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const { error } = await supabase
      .from('timer_sessions')
      .update({
        duration: time,
        ended_at: new Date().toISOString(),
      })
      .eq('id', currentSessionId);

    if (error) {
      console.error('Error stopping timer:', error);
      toast.error('שגיאה בעצירת הטיימר');
      return;
    }

    setTimerState('STOPPED');
    setTime(0);
    setCurrentSessionId(null);
    loadSessions();
  };

  const calculateSummary = () => {
    let studyTime = 0;
    let breakTime = 0;

    sessions.forEach(session => {
      if (session.duration) {
        if (session.type === 'study') {
          studyTime += session.duration;
        } else if (session.type === 'break') {
          breakTime += session.duration;
        }
      }
    });

    setTotalStudyTime(studyTime);
    setTotalBreakTime(breakTime);
    toast.success('הסיכום חושב בהצלחה');
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-white shadow-sm border border-gray-100 rounded-3xl overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <h2 className="text-center text-3xl font-bold mb-8">מעקב זמן למידה</h2>
        
        <TimerDisplay
          time={time}
          timerState={timerState}
          formatTime={formatTime}
        />

        <TimerControls
          timerState={timerState}
          onStartStudy={() => startTimer('study')}
          onStartBreak={() => startTimer('break')}
          onStop={stopTimer}
        />

        <TimerHistory
          sessions={sessions}
          onCalculateSummary={calculateSummary}
          totalStudyTime={totalStudyTime}
          totalBreakTime={totalBreakTime}
        />
      </CardContent>
    </Card>
  );
};