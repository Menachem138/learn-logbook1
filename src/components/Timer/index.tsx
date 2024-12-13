import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TimeDisplay } from "./TimeDisplay";
import { Controls } from "./Controls";
import { DailySummary } from "./DailySummary";
import { formatDate, formatTime } from "./utils";

interface TimerSession {
  id: string;
  type: string;
  duration: number;
  started_at: string;
  ended_at: string | null;
}

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [timerType, setTimerType] = useState<"study" | "break">("study");
  const [timerLog, setTimerLog] = useState<TimerSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { session } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [todayBreakTime, setTodayBreakTime] = useState(0);

  useEffect(() => {
    loadTimerHistory();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const loadTimerHistory = async () => {
    if (!session?.user?.id) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('timer_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('started_at', today.toISOString())
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error loading timer history:', error);
      return;
    }

    setTimerLog(data || []);

    // Calculate today's totals
    let studyTime = 0;
    let breakTime = 0;

    data?.forEach(session => {
      if (session.type === 'study') {
        studyTime += session.duration || 0;
      } else if (session.type === 'break') {
        breakTime += session.duration || 0;
      }
    });

    setTodayStudyTime(studyTime);
    setTodayBreakTime(breakTime);
  };

  const startTimer = async (type: "study" | "break") => {
    if (!session?.user?.id) {
      toast.error("יש להתחבר כדי להשתמש בטיימר");
      return;
    }

    if (isRunning) {
      await stopTimer();
    }

    const { data, error } = await supabase
      .from('timer_sessions')
      .insert({
        user_id: session.user.id,
        type,
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
    setTimerType(type);
    setIsRunning(true);
    setIsPaused(false);
    setTime(0);
    toast.success(
      type === "study" ? "התחלת זמן למידה!" : "התחלת זמן הפסקה!"
    );
  };

  const stopTimer = async () => {
    if (!session?.user?.id || !currentSessionId) return;

    const { error } = await supabase
      .from('timer_sessions')
      .update({
        duration: time,
        ended_at: new Date().toISOString(),
      })
      .eq('id', currentSessionId);

    if (error) {
      console.error('Error stopping timer session:', error);
      toast.error("שגיאה בעצירת הטיימר");
      return;
    }

    // Update today's totals
    if (timerType === 'study') {
      setTodayStudyTime(prev => prev + time);
    } else {
      setTodayBreakTime(prev => prev + time);
    }

    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setCurrentSessionId(null);
    loadTimerHistory();
    toast.info("הטיימר נעצר!");
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "הטיימר ממשיך!" : "הטיימר מושהה!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 space-y-4 md:col-span-2">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">טיימר</h2>
          <TimeDisplay time={time} />
          <Controls
            isRunning={isRunning}
            isPaused={isPaused}
            onStartStudy={() => startTimer("study")}
            onStartBreak={() => startTimer("break")}
            onPause={pauseTimer}
            onStop={stopTimer}
            timerType={timerType}
          />
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between mb-2"
          >
            <span>היסטוריית זמנים</span>
            {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showHistory && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {timerLog.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-2 bg-muted rounded"
                >
                  <span>
                    {session.type === "study" ? "למידה" : "הפסקה"} -{" "}
                    {formatTime(session.duration)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(session.started_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <DailySummary
          studyTime={todayStudyTime}
          breakTime={todayBreakTime}
        />
      </Card>
    </div>
  );
}
