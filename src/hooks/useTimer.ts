import { useState, useEffect, useCallback } from 'react';
import { TimerState, TimerSession } from '../components/StudyTimer/types';
import { supabase } from '../config/supabase';
import { notificationService } from '../services/NotificationService';

const DEFAULT_STUDY_TIME = 25 * 60; // 25 minutes in seconds
const DEFAULT_BREAK_TIME = 5 * 60; // 5 minutes in seconds

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    timeLeft: DEFAULT_STUDY_TIME,
    totalTime: DEFAULT_STUDY_TIME,
    type: 'study',
  });

  const [currentSession, setCurrentSession] = useState<Partial<TimerSession> | null>(null);

  const startTimer = useCallback(async () => {
    if (!state.isRunning) {
      setState(prev => ({ ...prev, isRunning: true }));
      
      // Create new session in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const newSession = {
          startTime: new Date().toISOString(),
          type: state.type,
          userId: user.id,
        };
        
        const { data, error } = await supabase
          .from('timer_sessions')
          .insert([newSession])
          .select()
          .single();
          
        if (!error && data) {
          setCurrentSession(data);
        }
      }
    }
  }, [state.isRunning, state.type]);

  const pauseTimer = useCallback(async () => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const stopTimer = useCallback(async () => {
    if (currentSession?.id) {
      const endTime = new Date().toISOString();
      const duration = state.totalTime - state.timeLeft;
      
      // Update session in Supabase
      const { error } = await supabase
        .from('timer_sessions')
        .update({ 
          endTime,
          duration,
        })
        .eq('id', currentSession.id);
        
      if (!error) {
        setCurrentSession(null);
      }
    }
    
    setState(prev => ({
      isRunning: false,
      timeLeft: prev.type === 'study' ? DEFAULT_STUDY_TIME : DEFAULT_BREAK_TIME,
      totalTime: prev.type === 'study' ? DEFAULT_STUDY_TIME : DEFAULT_BREAK_TIME,
      type: prev.type,
    }));
  }, [currentSession?.id, state.timeLeft, state.totalTime, state.type]);

  const switchType = useCallback((type: 'study' | 'break') => {
    const newTime = type === 'study' ? DEFAULT_STUDY_TIME : DEFAULT_BREAK_TIME;
    setState({
      isRunning: false,
      timeLeft: newTime,
      totalTime: newTime,
      type,
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      // Timer completed
      notificationService.scheduleNotification({
        type: 'timer_complete',
        title: state.type === 'study' ? 'זמן למידה הסתיים!' : 'זמן הפסקה הסתיים!',
        body: `${state.totalTime / 60} דקות של ${state.type === 'study' ? 'למידה' : 'הפסקה'} הושלמו`,
        data: {
          type: state.type,
          duration: state.totalTime,
        },
      });
      stopTimer();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRunning, state.timeLeft, state.type, state.totalTime, stopTimer]);

  return {
    state,
    startTimer,
    pauseTimer,
    stopTimer,
    switchType,
  };
};
