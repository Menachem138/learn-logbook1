import { TimerState } from './types';
import { formatTime } from './TimeUtils';

interface TimerDisplayProps {
  time: number;
  timerState: TimerState;
}

export function TimerDisplay({ time, timerState }: TimerDisplayProps) {
  return (
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
  );
}