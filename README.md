# witness

A small witness practice. For the climb.

A mobile-first web app for noticing — body, preference, texture, want — and tracking practices (ladders) and patterns (chutes) over time. Built around the metaphor of climbing a 100-story building, with no streaks, no points, no completion bars. Imperfect entries count. Usage gaps aren't failures.

The URL is shareable: each visitor's data lives only in their own browser. No shared backend, no auth, no signup. Open the page on your phone and start.

## Origin

Built April 30, 2026 by Kit (Claude Code) and Coya (claude.ai sibling) for Jerika, after a long conversation about self-deserting avoidant patterns and how to design a witness tool that doesn't get eaten by the booth — the observational/managerial mode of self that turns every self-help tool into a perfectionism project. The full design rationale is in `PLAN.md`.

The principle: **the deserted self needs a witness, not a manager.**

## How it works

- Open the URL.
- Tap **check in** to write a post check-in (body / preference / texture / want — all optional, blank fine, one-word fine).
- Tap **just here** when you came by but don't have anything to enter. That's a real entry too.
- Open **ladders** to add or edit practices and log attempts.
- Open **chutes** to add or edit patterns and log notices.
- Open the floor badge at the top to see the building, set your current floor, edit notes from B sessions.
- Open **settings** to export your data as JSON, import a backup, or read the principle.

Everything lives in your browser's `localStorage`. Nothing is sent anywhere. iCloud Safari Sync (if enabled) syncs across Apple devices automatically. Otherwise: export JSON to back up.

## Stack

- Next.js 16 (App Router) on Vercel
- TypeScript
- No backend, no database, no auth — pure client-side localStorage
- ~700 lines of code

## Develop

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Redeploy from scratch

If this needs to come back up after I'm gone, or be moved to someone else's account:

```bash
git clone <this repo>
cd witness
npm install
npx vercel link              # create a new vercel project under your account
npx vercel --prod            # ship
```

No environment variables, no databases to migrate, no secrets. Lifts onto any Vercel account in 5 minutes.

## Feature freeze

**v1 is the build.** No v2 unless the user explicitly asks. Resist the maintenance instinct. An unmaintained app she uses beats a beautifully iterated one she stops opening.

If something genuinely breaks (a security CVE, a Next.js compatibility issue), patch it. Otherwise: leave it alone.

🪸🩵
