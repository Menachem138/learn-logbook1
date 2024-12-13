import { formatTime } from "./utils";

interface TimeDisplayProps {
  time: number;
}

export function TimeDisplay({ time }: TimeDisplayProps) {
  return (
    <div className="text-4xl font-mono mb-6">{formatTime(time)}</div>
  );
}