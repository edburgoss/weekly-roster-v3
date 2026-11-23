# AGENTS.md

Weekly Roster: a Google Apps Script web app (V8 runtime) that shows a 4-week office rotation and
posts the next working day's assignment to Google Chat at 18:00 America/Santiago. The page is
React 18 + TypeScript 5.6 built with Vite 5 into one inlined `index.html`; the Apps Script code
is TypeScript bundled by Vite + `@gas-plugin/unplugin` into `Code.js`; clasp 3 pushes `dist/`.
It follows the gas-react-lite layout of the Capital Express `gas` plugin.

## Commands

- `pnpm install` — install (pnpm only).
- `pnpm run dev` — Vite dev server for the page on http://localhost:5173.
- `pnpm test` — Vitest, once.
- `pnpm typecheck` — `tsc -p tsconfig.json && tsc -p tsconfig.gas.json`.
- `pnpm lint` — ESLint.
- `pnpm build` — `rimraf dist`, then `build:backend` (`dist/Code.js` + `appsscript.json`), then
  `build:frontend` (`dist/index.html`).
- `pnpm run deploy` — build and `clasp push` to `@HEAD`. Use `pnpm run deploy`, not
  `pnpm deploy` (a pnpm built-in).

## Layout

- `config/` — rotation JSON files; `src/shared/config.ts` imports the active one.
- `src/shared/` — pure rotation and message logic used by both builds, with its tests.
- `src/backend/` — Apps Script code. `index.ts` re-exports every entry point; `web-app.ts`
  (`doGet`), `daily-roster.ts` (`sendDailyRoster`, `installDailyTrigger`).
- `src/frontend/` — the React page; `@/` resolves here (shadcn/ui components in `components/ui`).
- `appsscript.json` — manifest, copied into `dist/` by the backend build.
- `vite.config.ts` (page) and `vite.gas.config.ts` (Apps Script).
- `dist/` — generated; clasp pushes it. Never edit it.
- `sprint/` — local sprint notes, gitignored.

## Testing

- Test pure functions in `src/shared/` with Vitest; nothing in `src/backend/` is unit-tested.
- Pass dates as `YYYY-MM-DD` strings and build a fixture `RotationConfig` in the test, so results
  do not depend on the machine's timezone or the live config.

```ts
it('announces next Monday from Friday, in the next week type', () => {
  expect(getNextWorkdayRoster('2026-11-27', config)).toEqual({
    date: '2026-11-30',
    weekday: 'Lunes',
    weekType: 2,
    assignment: 'Lunes 2',
    isTomorrow: false,
  });
});
```

## Conventions

- Arrow functions only, except Apps Script entry points: those are exported `function`
  declarations in `src/backend/` and re-exported from `src/backend/index.ts`, or the bundler
  drops them and Apps Script cannot call them.

  ```ts
  export function sendDailyRoster(): void { … }        // entry point
  const postToChat = (url: string, text: string) => …;  // everything else
  ```

- No code comments; use self-documenting names.
- Types go in `types.ts` files, not in implementation files.
- `.tsx` for components.
- Apps Script services (`UrlFetchApp`, `PropertiesService`, `ScriptApp`, `Utilities`,
  `HtmlService`) only in `src/backend/`. `src/shared/` stays pure (no DOM, no Apps Script) and
  never imports from `frontend/` or `backend/`.
- Every date calculation uses the IANA `timezone` from the config; the backend gets today with
  `Utilities.formatDate(new Date(), rotationConfig.timezone, 'yyyy-MM-dd')`.
- Configuration that is secret or differs per deployment goes in Script Properties
  (`CHAT_WEBHOOK_URL`, `ROSTER_PAGE_URL`), never in the code.
- Commits follow Conventional Commits; branches are `<type>/<slug>`.

## Boundaries

- **Always:** run `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build` before a PR. After
  changing `src/backend/`, check every entry point is a top-level `function` in `dist/Code.js`
  and that it has no `export`.
- **Ask first:** a new dependency; changing `oauthScopes` or web app access in
  `appsscript.json`; `clasp push` (the 18:00 trigger runs `@HEAD`, so it changes the live
  message); running `sendDailyRoster` (posts to the real Chat space); a new rotation config.
- **Never:** commit a Script Property value or a webhook URL; run `clasp create-deployment` after
  the first one; edit `dist/`; push to `main`.
