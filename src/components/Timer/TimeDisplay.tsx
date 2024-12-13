interface TimeDisplayProps {
  time: number;
}

export function TimeDisplay({ time }: TimeDisplayProps) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="text-6xl font-mono">
      {hours > 0 && `${formatNumber(hours)}:`}
      {formatNumber(minutes)}:{formatNumber(seconds)}
    </div>
  );
}