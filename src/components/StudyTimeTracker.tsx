'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TimerState } from '@/types/timer';
import { formatTime } from '@/utils/timeUtils';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

export const StudyTimeTracker: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [time, setTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { session } = useAuth();

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
          studyTime += session.duration;
        } else {
          breakTime += session.duration;
        }
      });

      setTotalStudyTime(studyTime * 1000);
      setTotalBreakTime(breakTime * 1000);
    } catch (error) {
      console.error('Error fetching timer sessions:', error);
      toast.error("אירעה שגיאה בטעינת נתוני הטיימר");
    }
  };

  const startTimer = async (state: TimerState) => {
    if (!session?.user.id) {
      toast.error("יש להתחבר כדי להשתמש בטיימר");
      return;
    }

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

      toast.success(`התחלת ${state === TimerState.STUDYING ? 'למידה' : 'הפסקה'}`);
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error("אירעה שגיאה בהפעלת הטיימר");
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

      const duration = Math.floor(elapsedTime / 1000);
      
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

      toast.success(`סיימת ${timerState === TimerState.STUDYING ? 'למידה' : 'הפסקה'}`);
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error("אירעה שגיאה בעצירת הטיימר");
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-white shadow-sm border border-gray-100 rounded-3xl overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">טיימר</h1>
          <div className="text-[96px] font-mono font-bold tracking-[0.2em] tabular-nums" dir="ltr">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex gap-4 justify-center" dir="rtl">
          <Button 
            onClick={stopTimer} 
            disabled={timerState === TimerState.STOPPED}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-xl"
            variant="destructive"
          >
            עצור
          </Button>
          <Button
            onClick={() => startTimer(TimerState.BREAK)}
            disabled={timerState === TimerState.BREAK}
            className="bg-navy-800 hover:bg-navy-900 text-white px-8 py-2 rounded-xl"
            variant="default"
          >
            זמן הפסקה
          </Button>
          <Button
            onClick={() => startTimer(TimerState.STUDYING)}
            disabled={timerState === TimerState.STUDYING}
            className="bg-navy-800 hover:bg-navy-900 text-white px-8 py-2 rounded-xl"
            variant="default"
          >
            זמן למידה
          </Button>
        </div>

        <div className="text-right">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            היסטוריית זמנים
            <ChevronDown className={`w-4 h-4 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
