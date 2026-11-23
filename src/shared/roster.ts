import { addDays, format, getISODay } from 'date-fns';

import { getWeekIndexFromAnchor, parseLocalDate } from './date';
import type { NextWorkdayRoster, RotationConfig } from './types';

const FRIDAY = 5;

const getNextWorkdayRoster = (
  todayISO: string,
  config: RotationConfig
): NextWorkdayRoster | null => {
  const today = parseLocalDate(todayISO);
  const todayIsoDay = getISODay(today);
  if (todayIsoDay > FRIDAY) return null;

  const daysAhead = todayIsoDay === FRIDAY ? 3 : 1;
  const target = addDays(today, daysAhead);
  const weekIndex = getWeekIndexFromAnchor(target, config.anchorDate);
  const week = config.schedule[weekIndex];
  const weekday = config.weekdays[getISODay(target) - 1];

  return {
    date: format(target, 'yyyy-MM-dd'),
    weekday,
    weekType: week.week,
    assignment: week.days[weekday] ?? '',
    isTomorrow: daysAhead === 1,
  };
};

export { getNextWorkdayRoster };
