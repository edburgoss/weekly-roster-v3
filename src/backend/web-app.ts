export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Weekly Roster')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
