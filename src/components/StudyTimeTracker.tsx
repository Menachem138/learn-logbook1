'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Coffee, Pause, Play, StopCircle } from 'lucide-react';
import { formatTime, formatTotalTime } from '@/utils/timeUtils';
import { TimerState } from '@/types/timer';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const StudyTimeTracker: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [time, setTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
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

  const totalTime = totalStudyTime + totalBreakTime + (timerState !== TimerState.STOPPED ? time : 0);
  const studyPercentage = totalTime > 0 ? 
    ((totalStudyTime + (timerState === TimerState.STUDYING ? time : 0)) / totalTime) * 100 : 0;

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl font-bold text-gray-800">מעקב זמן למידה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className={`w-full py-8 px-4 rounded-2xl ${
            timerState === TimerState.STUDYING 
              ? 'bg-green-100' 
              : timerState === TimerState.BREAK 
                ? 'bg-yellow-100' 
                : 'bg-gray-100'
          } transition-colors duration-300 ease-in-out shadow-inner`}>
            <div className="relative z-10 text-7xl font-bold text-center tabular-nums" dir="ltr">
              {formatTime(time)}
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-2">
          <Button 
            onClick={() => startTimer(TimerState.STUDYING)} 
            disabled={timerState === TimerState.STUDYING}
            variant={timerState === TimerState.STUDYING ? "default" : "outline"}
            className="transition-all duration-300 ease-in-out hover:shadow-md"
          >
            {timerState === TimerState.STUDYING ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            למידה
          </Button>
          <Button 
            onClick={() => startTimer(TimerState.BREAK)} 
            disabled={timerState === TimerState.BREAK}
            variant={timerState === TimerState.BREAK ? "default" : "outline"}
            className="transition-all duration-300 ease-in-out hover:shadow-md"
          >
            {timerState === TimerState.BREAK ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            הפסקה
          </Button>
          <Button 
            onClick={stopTimer} 
            disabled={timerState === TimerState.STOPPED} 
            variant="destructive"
            className="transition-all duration-300 ease-in-out hover:shadow-md"
          >
            <StopCircle className="mr-2 h-4 w-4" />
            עצור
          </Button>
        </div>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="summary" className="text-sm">סיכום</TabsTrigger>
            <TabsTrigger value="details" className="text-sm">פירוט</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>זמן למידה</span>
                <span className="font-semibold">{formatTotalTime(totalStudyTime + (timerState === TimerState.STUDYING ? time : 0))}</span>
              </div>
              <Progress value={studyPercentage} className="w-full h-2" />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md">
                <span className="flex items-center text-green-800">
                  <BookOpen className="mr-2 h-5 w-5" /> זמן למידה
                </span>
                <span className="font-semibold text-green-800">
                  {formatTotalTime(totalStudyTime + (timerState === TimerState.STUDYING ? time : 0))}
                </span>
              </div>
              <div className="flex justify-between items-center bg-yellow-100 p-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md">
                <span className="flex items-center text-yellow-800">
                  <Coffee className="mr-2 h-5 w-5" /> זמן הפסקה
                </span>
                <span className="font-semibold text-yellow-800">
                  {formatTotalTime(totalBreakTime + (timerState === TimerState.BREAK ? time : 0))}
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};