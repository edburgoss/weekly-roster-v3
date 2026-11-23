@AGENTS.md

## Claude Code

- New work starts with `/gas:sprint`; sprint notes go in `sprint/`.
- `/gas:build` to build and verify `dist/`, `/gas:ship` to push a branch to `@HEAD` and open the
  PR, `/gas:release` after the PR merges. This is a single-script repo (`.clasp.json` only).
- `/devx:git` for branch, commit and PR names.
- There is no `google.script.run` bridge yet (`src/shared/contract.ts`, `gasRun`, mocks). Add it
  with `/gas:rpc` when the page first needs data from the server.
