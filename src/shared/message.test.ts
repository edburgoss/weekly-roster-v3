import { describe, expect, it } from 'vitest';

import { buildRosterMessage } from './message';
import type { NextWorkdayRoster } from './types';

const PAGE_URL = 'https://script.google.com/a/macros/example.com/s/abc/exec';
const ALERT_LINE = '🚨👮🏻‍♂️🚨👮🏻‍♂️🚨';
const LINK_LINE = `<${PAGE_URL}|Aquí puedes revisar el horario>`;

const roster = (overrides: Partial<NextWorkdayRoster> = {}): NextWorkdayRoster => ({
  date: '2026-11-24',
  weekday: 'Martes',
  weekType: 1,
  assignment: 'Catalina',
  isTomorrow: true,
  ...overrides,
});

describe('buildRosterMessage', () => {
  it('mentions the person working tomorrow, then the alert and the link', () => {
    expect(buildRosterMessage(roster(), PAGE_URL)).toBe(
      ['Mañana (Martes 24/11/2026) trabaja presencial: @Catalina', ALERT_LINE, LINK_LINE].join('\n')
    );
  });

  it('joins several people with " + " and uses the plural', () => {
    expect(
      buildRosterMessage(
        roster({
          date: '2026-11-23',
          weekday: 'Lunes',
          assignment: 'David Tapia + Agustin Quiroz',
        }),
        PAGE_URL
      )
    ).toBe(
      [
        'Mañana (Lunes 23/11/2026) trabajan presencial: @David Tapia + @Agustin Quiroz',
        ALERT_LINE,
        LINK_LINE,
      ].join('\n')
    );
  });

  it('names the weekday instead of "Mañana" when the day is not tomorrow', () => {
    expect(
      buildRosterMessage(
        roster({ date: '2026-11-30', weekday: 'Lunes', assignment: 'Erick', isTomorrow: false }),
        PAGE_URL
      )
    ).toContain('El lunes (30/11/2026) trabaja presencial: @Erick');
  });

  it('shows an everyone day as written, without mentions', () => {
    expect(
      buildRosterMessage(
        roster({ weekday: 'Miércoles', assignment: 'TODOS presencial (planificación)' }),
        PAGE_URL
      )
    ).toContain('Mañana (Miércoles 24/11/2026): TODOS presencial (planificación)');
  });

  it('says nobody works on site on an empty day', () => {
    expect(buildRosterMessage(roster({ weekday: 'Jueves', assignment: ' ' }), PAGE_URL)).toContain(
      'Mañana (Jueves 24/11/2026) nadie trabaja presencial'
    );
  });

  it('leaves out the link line when there is no page URL', () => {
    expect(buildRosterMessage(roster(), '')).toBe(
      ['Mañana (Martes 24/11/2026) trabaja presencial: @Catalina', ALERT_LINE].join('\n')
    );
  });
});
