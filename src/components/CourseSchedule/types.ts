export type ScheduleItem = {
  time: string;
  activity: string;
};

export type DaySchedule = {
  day: string;
  schedule: ScheduleItem[];
};

export type WeeklyTopic = {
  week: number;
  title: string;
  topics: string[];
};

export type BackupBlock = {
  title: string;
  sessions: string[];
};

export type ImportantRule = {
  title: string;
  rules: string[];
};