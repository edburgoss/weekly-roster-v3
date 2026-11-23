import { buildRosterMessage, getNextWorkdayRoster, rotationConfig } from '../shared';

const CHAT_WEBHOOK_PROPERTY = 'CHAT_WEBHOOK_URL';
const PAGE_URL_PROPERTY = 'ROSTER_PAGE_URL';
const DAILY_HANDLER = 'sendDailyRoster';
const SEND_HOUR = 18;

const getTodayISO = (): string =>
  Utilities.formatDate(new Date(), rotationConfig.timezone, 'yyyy-MM-dd');

const getRequiredProperty = (name: string): string => {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error(`Script Property ${name} is not set`);
  return value;
};

const getPageUrl = (): string =>
  PropertiesService.getScriptProperties().getProperty(PAGE_URL_PROPERTY) ??
  ScriptApp.getService().getUrl() ??
  '';

const postToChat = (webhookUrl: string, text: string): void => {
  const response = UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    payload: JSON.stringify({ text }),
    muteHttpExceptions: true,
  });
  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    throw new Error(`Google Chat responded ${status}: ${response.getContentText()}`);
  }
};

export function sendDailyRoster(): void {
  const roster = getNextWorkdayRoster(getTodayISO(), rotationConfig);
  if (!roster) return;
  postToChat(getRequiredProperty(CHAT_WEBHOOK_PROPERTY), buildRosterMessage(roster, getPageUrl()));
}

export function installDailyTrigger(): void {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === DAILY_HANDLER)
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger(DAILY_HANDLER)
    .timeBased()
    .everyDays(1)
    .atHour(SEND_HOUR)
    .nearMinute(0)
    .inTimezone(rotationConfig.timezone)
    .create();
}
