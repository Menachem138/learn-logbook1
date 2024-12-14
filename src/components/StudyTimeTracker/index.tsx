'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerState } from '@/types/timer';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerTabs } from './TimerTabs';

export const StudyTimeTracker: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [time, setTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const studyTimeRef = useRef<number>(0);
  const breakTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = (state: TimerState) => {
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

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsedTime = Date.now() - startTimeRef.current;
    if (timerState === TimerState.STUDYING) {
      studyTimeRef.current += elapsedTime;
    } else if (timerState === TimerState.BREAK) {
      breakTimeRef.current += elapsedTime;
    }
    setTotalStudyTime(studyTimeRef.current);
    setTotalBreakTime(breakTimeRef.current);
    setTimerState(TimerState.STOPPED);
    setTime(0);
  };

  const totalTime = totalStudyTime + totalBreakTime + (timerState !== TimerState.STOPPED ? time : 0);
  const studyPercentage = totalTime > 0 ? 
    ((totalStudyTime + (timerState === TimerState.STUDYING ? time : 0)) / totalTime) * 100 : 0;

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg border border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl font-bold">מעקב זמן למידה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimerDisplay time={time} timerState={timerState} />
        <TimerControls
          timerState={timerState}
          onStartStudy={() => startTimer(TimerState.STUDYING)}
          onStartBreak={() => startTimer(TimerState.BREAK)}
          onStop={stopTimer}
        />
        <TimerTabs
          totalStudyTime={totalStudyTime}
          totalBreakTime={totalBreakTime}
          studyPercentage={studyPercentage}
          currentTime={time}
          timerState={timerState}
        />
      </CardContent>
    </Card>
  );
};