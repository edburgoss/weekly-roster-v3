import type { NextWorkdayRoster } from './types';

const ALERT_LINE = '🚨👮🏻‍♂️🚨👮🏻‍♂️🚨';
const EVERYONE_PATTERN = /^TODOS/i;
const MEMBER_SEPARATOR = '+';

const formatFullDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const describeWhen = (roster: NextWorkdayRoster): string => {
  const date = formatFullDate(roster.date);
  return roster.isTomorrow
    ? `Mañana (${roster.weekday} ${date})`
    : `El ${roster.weekday.toLocaleLowerCase('es')} (${date})`;
};

const splitMembers = (assignment: string): string[] =>
  assignment
    .split(MEMBER_SEPARATOR)
    .map((member) => member.trim())
    .filter(Boolean);

const describeAssignment = (when: string, assignment: string): string => {
  const trimmed = assignment.trim();
  if (!trimmed) return `${when} nadie trabaja presencial`;
  if (EVERYONE_PATTERN.test(trimmed)) return `${when}: ${trimmed}`;

  const members = splitMembers(trimmed);
  const verb = members.length === 1 ? 'trabaja' : 'trabajan';
  const mentions = members.map((member) => `@${member}`).join(` ${MEMBER_SEPARATOR} `);
  return `${when} ${verb} presencial: ${mentions}`;
};

const buildRosterMessage = (roster: NextWorkdayRoster, pageUrl: string): string => {
  const lines = [describeAssignment(describeWhen(roster), roster.assignment), ALERT_LINE];
  if (pageUrl) lines.push(`Aquí puedes revisar el horario: ${pageUrl}`);
  return lines.join('\n');
};

export { buildRosterMessage };
