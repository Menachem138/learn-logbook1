'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, StopCircle } from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

enum TimerState {
  STOPPED,
  STUDYING,
  BREAK
}

export const StudyTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [time, setTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { session } = useAuth();

  const startTimeRef = useRef<number>(0);
  const studyTimeRef = useRef<number>(0);
  const breakTimeRef = useRef<number>(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = async (state: TimerState) => {
    if (!session?.user?.id) {
      toast.error("יש להתחבר כדי להשתמש בטיימר");
      return;
    }

    if (currentSessionId) {
      await stopTimer();
    }

    const { data, error } = await supabase
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
      toast.error("שגיאה בהפעלת הטיימר");
      return;
    }

    setCurrentSessionId(data.id);
    
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
  };

  const stopTimer = async () => {
    if (!session?.user?.id || !currentSessionId) return;

    const elapsedTime = Date.now() - startTimeRef.current;
    const duration = Math.floor(elapsedTime / 1000); // Convert to seconds

    const { error } = await supabase
      .from('timer_sessions')
      .update({
        duration: duration,
        ended_at: new Date().toISOString(),
      })
      .eq('id', currentSessionId);

    if (error) {
      console.error('Error stopping timer session:', error);
      toast.error("שגיאה בעצירת הטיימר");
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerState === TimerState.STUDYING) {
      studyTimeRef.current += elapsedTime;
    } else if (timerState === TimerState.BREAK) {
      breakTimeRef.current += elapsedTime;
    }
    setTotalStudyTime(studyTimeRef.current);
    setTotalBreakTime(breakTimeRef.current);
    setTimerState(TimerState.STOPPED);
    setTime(0);
    setCurrentSessionId(null);
  };

  const getTimerBackground = () => {
    switch (timerState) {
      case TimerState.STUDYING:
        return 'bg-green-100';
      case TimerState.BREAK:
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-white shadow-sm border border-gray-100 rounded-3xl overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <h2 className="text-center text-3xl font-bold mb-8">מעקב זמן למידה</h2>
        
        <div className={`rounded-2xl p-8 ${getTimerBackground()} transition-colors duration-300`}>
          <div className="text-7xl font-mono text-center" dir="ltr">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex justify-center gap-4" dir="rtl">
          <button
            onClick={() => startTimer(TimerState.STUDYING)}
            disabled={timerState === TimerState.STUDYING}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-colors
              ${timerState === TimerState.STUDYING 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            {timerState === TimerState.STUDYING ? <Pause size={16} /> : <Play size={16} />}
            למידה
          </button>
          
          <button
            onClick={() => startTimer(TimerState.BREAK)}
            disabled={timerState === TimerState.BREAK}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-colors
              ${timerState === TimerState.BREAK 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            {timerState === TimerState.BREAK ? <Pause size={16} /> : <Play size={16} />}
            הפסקה
          </button>
          
          <button
            onClick={stopTimer}
            disabled={timerState === TimerState.STOPPED}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <StopCircle size={16} />
            עצור
          </button>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">סיכום</TabsTrigger>
            <TabsTrigger value="details">פירוט</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>זמן למידה</span>
                <span>{formatTime(totalStudyTime + (timerState === TimerState.STUDYING ? time : 0))}</span>
              </div>
              <Progress 
                value={((totalStudyTime + (timerState === TimerState.STUDYING ? time : 0)) / 
                (totalStudyTime + totalBreakTime + time || 1)) * 100} 
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span>זמן למידה</span>
                  <span>{formatTime(totalStudyTime + (timerState === TimerState.STUDYING ? time : 0))}</span>
                </div>
              </div>
              <div className="p-4 bg-yellow-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span>זמן הפסקה</span>
                  <span>{formatTime(totalBreakTime + (timerState === TimerState.BREAK ? time : 0))}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};