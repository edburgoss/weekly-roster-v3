import { describe, expect, it } from 'vitest';

import { getNextWorkdayRoster } from './roster';
import type { RotationConfig } from './types';

const daysForWeek = (week: number) => ({
  Lunes: `Lunes ${week}`,
  Martes: `Martes ${week}`,
  Miércoles: `Miércoles ${week}`,
  Jueves: '',
  Viernes: `Viernes ${week}`,
});

const config: RotationConfig = {
  timezone: 'America/Santiago',
  user: 'Erick',
  anchorDate: '2025-09-29',
  weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  schedule: [1, 2, 3, 4].map((week) => ({ week, days: daysForWeek(week) })),
};

describe('getNextWorkdayRoster', () => {
  it('announces tomorrow from Monday', () => {
    expect(getNextWorkdayRoster('2026-11-23', config)).toEqual({
      date: '2026-11-24',
      weekday: 'Martes',
      weekType: 1,
      assignment: 'Martes 1',
      isTomorrow: true,
    });
  });

  it('announces Friday from Thursday', () => {
    expect(getNextWorkdayRoster('2026-11-26', config)).toEqual({
      date: '2026-11-27',
      weekday: 'Viernes',
      weekType: 1,
      assignment: 'Viernes 1',
      isTomorrow: true,
    });
  });

  it('announces next Monday from Friday, in the next week type', () => {
    expect(getNextWorkdayRoster('2026-11-27', config)).toEqual({
      date: '2026-11-30',
      weekday: 'Lunes',
      weekType: 2,
      assignment: 'Lunes 2',
      isTomorrow: false,
    });
  });

  it('wraps from week type 4 back to week type 1', () => {
    expect(getNextWorkdayRoster('2026-12-18', config)).toMatchObject({
      date: '2026-12-21',
      weekType: 1,
      assignment: 'Lunes 1',
    });
  });

  it('returns an empty assignment for a day with nobody assigned', () => {
    expect(getNextWorkdayRoster('2026-11-25', config)).toMatchObject({
      date: '2026-11-26',
      weekday: 'Jueves',
      assignment: '',
    });
  });

  it('announces nothing on Saturday or Sunday', () => {
    expect(getNextWorkdayRoster('2026-11-28', config)).toBeNull();
    expect(getNextWorkdayRoster('2026-11-29', config)).toBeNull();
  });
});
