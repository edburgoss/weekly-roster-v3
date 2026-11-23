type ScheduleItem = {
  week: number;
  days: Record<string, string>;
};

type RotationConfig = {
  timezone: string;
  anchorDate: string;
  user: string;
  weekdays: string[];
  schedule: ScheduleItem[];
};

type NextWorkdayRoster = {
  date: string;
  weekday: string;
  weekType: number;
  assignment: string;
  isTomorrow: boolean;
};

export type { RotationConfig, NextWorkdayRoster };
