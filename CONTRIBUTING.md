# Contributing

Thanks for your interest in improving `kontur-diadoc-mcp`!

## Development setup

```bash
git clone https://github.com/theYahia/kontur-diadoc-mcp.git
cd kontur-diadoc-mcp
npm install
```

Useful scripts:

| Command | What it does |
|---------|--------------|
| `npm run dev` | Run the server from source via `tsx` (stdio transport). |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm test` | Run the Vitest suite. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | Biome lint + format check. |
| `npm run format` | Biome auto-fix (format + safe fixes). |

Before opening a PR, please make sure all of these pass:

```bash
npm run typecheck && npm run build && npm test && npm run lint
```

## Project layout

```
src/
  index.ts            # MCP server: registers the 8 tools, wraps errors as isError
  client.ts           # Diadoc HTTP client: auth, retries, 401 re-auth, DiadocError
  config.ts           # Credential / base-URL resolution from env
  tools/documents.ts  # Zod schemas + handlers for every tool
  __tests__/          # Vitest unit tests (tools + client)
```

## Guidelines

- **Verify against the docs.** Diadoc endpoint paths and parameter names are easy to get
  subtly wrong — check [developer.kontur.ru/doc/diadoc-api](https://developer.kontur.ru/doc/diadoc-api)
  and add/adjust a test when you change request shaping.
- **Never sign on the server.** Cryptographic signatures (CAdES) are supplied by the caller.
  Keep `signature_base64` pass-through; don't add signing logic.
- **Log only to stderr.** `stdout` is the MCP transport — anything written there breaks it.
- **Keep secrets out of git.** `.env` is ignored; never commit real credentials or tokens.
- Match the existing code style; `npm run format` handles formatting.

## Reporting issues

Please include: the tool you called, the (redacted) parameters, the error message, and
whether you were hitting production or a sandbox host.
