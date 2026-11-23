import type { NextWorkdayRoster } from './types';

const EMPTY_ASSIGNMENT = 'sin asignación';

const formatDayMonth = (isoDate: string): string => {
  const [, month, day] = isoDate.split('-');
  return `${day}/${month}`;
};

const buildRosterMessage = (roster: NextWorkdayRoster, pageUrl: string): string => {
  const weekday = roster.weekday.toLocaleLowerCase('es');
  const when = roster.isTomorrow ? `Mañana ${weekday}` : `El ${weekday}`;
  const assignment = roster.assignment.trim() || EMPTY_ASSIGNMENT;
  const headline = `📅 ${when} ${formatDayMonth(roster.date)} en oficina: *${assignment}*`;
  const weekLine = `Semana tipo ${roster.weekType}`;
  const footer = pageUrl ? `${weekLine} · Ver rotación: ${pageUrl}` : weekLine;
  return `${headline}\n${footer}`;
};

export { buildRosterMessage };
