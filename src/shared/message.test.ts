import { describe, expect, it } from 'vitest';

import { buildRosterMessage } from './message';
import type { NextWorkdayRoster } from './types';

const PAGE_URL = 'https://script.google.com/a/macros/capitalexpress.cl/s/abc/exec';

const roster = (overrides: Partial<NextWorkdayRoster> = {}): NextWorkdayRoster => ({
  date: '2026-11-24',
  weekday: 'Martes',
  weekType: 2,
  assignment: 'Catalina',
  isTomorrow: true,
  ...overrides,
});

describe('buildRosterMessage', () => {
  it('announces tomorrow with the week type and page link', () => {
    expect(buildRosterMessage(roster(), PAGE_URL)).toBe(
      `📅 Mañana martes 24/11 en oficina: *Catalina*\nSemana tipo 2 · Ver rotación: ${PAGE_URL}`
    );
  });

  it('names the weekday instead of "Mañana" when the day is not tomorrow', () => {
    expect(
      buildRosterMessage(
        roster({ date: '2026-11-30', weekday: 'Lunes', assignment: 'Erick', isTomorrow: false }),
        PAGE_URL
      )
    ).toBe(`📅 El lunes 30/11 en oficina: *Erick*\nSemana tipo 2 · Ver rotación: ${PAGE_URL}`);
  });

  it('says nobody is assigned on an empty day', () => {
    expect(
      buildRosterMessage(
        roster({ date: '2026-11-26', weekday: 'Jueves', assignment: ' ' }),
        PAGE_URL
      )
    ).toBe(
      `📅 Mañana jueves 26/11 en oficina: *sin asignación*\nSemana tipo 2 · Ver rotación: ${PAGE_URL}`
    );
  });

  it('keeps accents when lowercasing the weekday', () => {
    expect(buildRosterMessage(roster({ weekday: 'Miércoles' }), PAGE_URL)).toContain(
      'Mañana miércoles 24/11'
    );
  });

  it('leaves out the link when there is no page URL', () => {
    expect(buildRosterMessage(roster(), '')).toBe(
      '📅 Mañana martes 24/11 en oficina: *Catalina*\nSemana tipo 2'
    );
  });
});
