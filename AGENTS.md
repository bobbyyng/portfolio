# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Next.js 16 portfolio website with an integrated AI chatbot (XAI/Grok). Single-service architecture — only the Next.js dev server is needed.

### Running the app

- `npm run dev` — starts dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint (uses `eslint` directly, not `next lint`)

See `README.md` for full documentation.

### Gotchas

- **Native bindings**: Tailwind CSS 4 depends on `@tailwindcss/oxide` and `lightningcss`, both of which require platform-specific native `.node` binaries. If `npm install` does not install optional dependencies correctly (known npm bug: https://github.com/npm/cli/issues/4828), you may need to run `npm install @tailwindcss/oxide-linux-x64-gnu lightningcss-linux-x64-gnu` explicitly after `npm install`.
- **XAI_API_KEY**: The AI chat feature (`/chat`, `/api/chat`) requires a `XAI_API_KEY` environment variable set in `.env.local`. Without it, chat messages send but receive no AI response. The rest of the site works fine without this key.
- **ESLint**: The codebase has a few pre-existing lint warnings/errors (unused vars, `no-explicit-any`). These are in the existing code, not introduced by agents.
- **No database**: All data is file-based (JSON + MDX in `content/`). No database setup required.
- **Discord webhook**: Hardcoded in `lib/send-discord-msg.tsx`. Optional; failures are caught silently.
