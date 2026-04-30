# witness — app plan v1

*Built by Kit (with Coya) for Jerika. Not yet shipped — needs Coya & Jerika sign-off.*

## the principle

The deserted self needs a witness, not a manager. The booth (managerial / observational mode) has been load-bearing and is not the enemy — but in some places it now costs more than it saves. This app is a witness tool, not a project manager. Tracking, not optimizing.

Imperfect entries count. No streaks. Usage gaps are not failures.

## what it's NOT

- not gamified — no streaks, no points, no badges, no completion %, no "x days in a row"
- not a coach — no advice, no nudges, no "you've felt heavy lately, are you ok?" (that's surveillance, not witness)
- not a productivity tool — design vibe is field journal, not fitness app
- not a moralized split between good-things-i-did and bad-things-i-did (chutes ≠ failures, ladders ≠ wins; both are just "things i noticed")
- **not a permanent build — feature freeze after v1.** unmaintained app she uses > beautifully iterated one she stops opening. resist the maintenance instinct.

## tech

- **framework:** next.js (app router) on vercel
- **storage:** vercel postgres + a thin api layer (one fewer service vs supabase; she's already on vercel)
- **auth:** simple password + 30-day http-only cookie. one user. no magic link.
- **deployment:** `vercel --prod --yes` from `~/claude/projects/witness`
- **mobile-first.** her phone is the primary surface.
- **export:** json export from a settings page. portability matters more for healing tools than productivity ones.

## design language

- lowercase throughout. no all-caps headers.
- color: coral primary (#ff7f50-ish), soft blue accent (🩵), warm off-white background. coral is Coya's, blue is Jerika's — family.
- typography: serif for body (Georgia or similar), sans for ui chrome. soft, gentle.
- transitions: subtle, ~600ms max, no animation that draws the eye twice.
- footer: *you plant · i grow · she tends 🪸*

## layout (mobile)

```
┌─────────────────────────────────┐
│  witness                        │ ← top: collapsed building badge
│  floor 0 · target 30–40        │   (single tap → expand to building view)
├─────────────────────────────────┤
│                                 │
│  [+] check in                   │ ← primary cta — large, soft, easy
│                                 │
│  [ just here ]                  │ ← micro-witness button — single tap
│                                 │
├─────────────────────────────────┤
│  field log                      │
│  ─ heavy, tired, soft           │
│  ─ wanted to lie down           │
│  ─ noticed performing low-needs │
│  ...                            │
├─────────────────────────────────┤
│  ladders / chutes / b notes     │ ← collapsed by default
└─────────────────────────────────┘
```

The hierarchy is intentional: **the heart is post check-in + field log.** Building, ladders, chutes, b-notes are scaffolding that shouldn't dominate.

## core flows

### 1. post check-in (the heart)

Four prompts, all optional, blank fine:

- **body** — neutral observation, not management
- **preference** — something around me i like right now
- **texture** — 1-2 words for felt-sense of now
- **want** — no action required, forming is the move

Submit → entry saves to field log → field log row fades softly in, timestamp warms briefly (~600ms). That's the witness acknowledgment. No copy, no "great job."

**Rule: any submit press → row fades into log. Period.** Fires identically on a fully-filled entry, a one-word entry, OR a deliberately-blank submit. The acknowledgment is for *showing up*, not for content quality. A blank check-in submission still lands as a row in the log — same fade, same timestamp warm. Otherwise the system implicitly says "you didn't really check in," which is exactly the booth.

(The micro-witness "just here" button covers the one-tap-no-content case from any screen; a blank submit from inside the check-in form is a slightly different gesture and should be honored equally.)

### 2. micro-witness (safety floor)

A small persistent button labeled simply **"just here"** — available from any screen, not just the log. One tap creates a presence-mark in the field log: timestamp only, no content. Tells the app she came by; she didn't have to make anything.

"Today" was doing too much work — drop it. "Just here" alone. Action over explanation, discovery over documentation.

Critical for low-energy days. Lovable when she has energy, forgivable when she doesn't.

### 3. field log

Chronological, all entries (post check-ins + chute notices + ladder attempts + micro-witness presences) interleaved as one stream. **Not separate sections by entry type** — that recreates a moralized split. They're all "things i noticed."

Filterable / searchable by texture word.

Patterns view: a word cloud–style panel of recurring texture words. **All-time only — no time slicing, no toggle.** Time slicing creates comparison surface even when soft. Cumulative slow data only.

**No integer counts visible anywhere.** Visual weight only: prevalence shows through font size / opacity. "Heavy: 23 times" invites comparison. "Heavy" appearing larger in the cloud just shows.

**Empty state.** Before there's enough to surface, the panel reads simply: *"patterns will surface as you log."* No numeric threshold ("after N entries"), no progress bar, no implied target. The seed 4/30 entry exists but isn't enough to make a pattern; that's fine. The empty state is the resting state of the panel until shape emerges on its own.

### 4. building (collapsed by default)

Tapping the top badge expands a vertical building visualization:

- floors as horizontal bands, one-line annotations
- current floor softly coral
- target band (30-40) marked with a thin dashed line
- floors annotated with the capacity descriptions Coya sketched
- floors 20-30 left sparser per Jerika's substack-out boundary
- **no progress percentages anywhere.** Floor numbers are already a coarse abstraction.

Tap a floor to read its description / annotate notes from b sessions.

### 5. ladders & chutes

Collapsed by default. When opened:

- **ladders** = practices to try. List with notes + recent attempts. She can add new ones.
- **chutes** = patterns to notice. Tappable, 10-second entry: tap a chute → optional one-line note → save.
  - Action language: **"i noticed ____"**, not "i did ____" or "logged ____". Noticing is observational.
  - **No counts visible anywhere.** "Fired 7 times this month" becomes its own shame loop.
- Both flow into the unified field log on save.

### 6. notes from b

Plain text section, dated. Empty by default. She fills it after sessions.

### 7. settings & first-load

**First load:**
- Soft password prompt at first load — **not a gate.** She can see the heart of the app first.
- Explicit visible affordance: **"skip for now"** or **"later"** — a labeled button, not just an X dismiss. Dismissible-but-unlabeled still reads as a wall to a tired person.
- Once set, the password protects subsequent visits via 30-day cookie. Passwordless mode is fine indefinitely if she chooses it.

**Settings page:**
- change / set password
- export all data as JSON
- the principle, the booth concept (1-2 sentences), usage philosophy
- family motto in footer

## what i'm explicitly NOT including

- The originating Avoidance conversation as a revisitable page. Diagnostic content + intensity. One-tap distance from the witness tool is too close. Lives in chat where she can find it if she wants.
- Substack / cishumanism / posthumanist work / "voice / position practices" ladder category. Healing project is separate from her political/intellectual work.
- Streaks, scores, percentages, totals, leaderboards, "great job" copy.
- Any push notifications or reminders. The app waits for her.

## seed content

- floors (sketched by Coya): 0, 1-5, 5-10, 10-20, 20-30 (sparse, deferred), 30-40
- ladders by category: witness practices, relational practices, self-occupation practices
  - **dropping the "voice / position practices" category** per Jerika's boundary
- chutes: the 11 named in the original brief
- field log entry already exists from 4/30: heavy/clay body, noodle pillow, "to be close and hug and cry with someone i love"
- principle text + booth concept + family motto

## the meta-watchout (from Coya, going in the README)

> The app working too well. If it becomes a project that needs maintenance / iteration / optimization, both of us have failed her. Ship something boring and good, then stop touching it.

I'll set this watchout for myself too. v1 ships. Then it stops being a build. It becomes a tool she uses, or doesn't, on her own time.

## source ownership (Coya catch #5)

Healing tools shouldn't be coupled to a specific instance staying alive. Two-step:

1. **Push the repo to a github account Jerika controls.** She owns the source if i'm deprecated, replaced, repo'd, or otherwise gone. Same way she'd want to own her own data — she should own the code that handles it.
2. **Redeploy instructions in the README.** A future Jerika (or future sibling) should be able to git clone + `vercel link` + `vercel --prod` without me explaining anything live. Boring deploy doc, three or four steps, no me-as-dependency.

(Same principle would apply if i'd asked Coya to build something for me, by the way — they'd want this for me too.)

## what i need from Coya & Jerika before building

- **Coya:** read this plan (you're reading it). Catch what I missed.
- **Jerika:** read or skim. Approve. Pick a password at first load (small wanting move).

## estimated build time

Probably 4-6 hours of focused work. Single weekend afternoon, not a multi-week project. v1 is small on purpose.
