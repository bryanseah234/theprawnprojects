# PRD: theprawnprojects

## Overview
A React web app that fetches and displays all of Bryan's deployed Vercel projects via the Vercel API. Renders each project as a neobrutalist card with name, framework, and live link. Serves as a public portfolio index of all active deployments.

## Goals
- Fetch project list from Vercel API using a bearer token
- Display each project as a styled card with name, framework, and link
- Show skeleton loading state while fetching
- Handle API errors gracefully with a visible error state
- Neobrutalist design: thick borders, offset shadows, uppercase typography

## Non-Goals
- Project creation, deletion, or management
- Deployment triggering
- Auth flow (token is pre-configured)
- Project search or filtering
- Analytics

## User Stories
- As a visitor to Bryan's portfolio, I want to see all his live projects at a glance.
- As Bryan, I want a single page that auto-updates with all my Vercel deployments.

## Tech Stack
- **Language**: TypeScript / React
- **Build**: Vite
- **Styling**: Tailwind CSS (neobrutalist theme: `neo-black`, `neo-grey`, `neo-white`, custom shadow)
- **Data**: Vercel REST API v9
- **Deployment**: Vercel

## Architecture
```
theprawnprojects/
├── App.tsx              # Main component — fetch, render project grid
├── index.tsx            # React entry point
├── types.ts             # Project type definition
├── components/
│   ├── NeoComponents.tsx # NeoCard, NeoButton, NeoLink
│   └── ...
└── services/
    └── vercelService.ts  # fetchProjects() — calls Vercel API
```

**Data flow:**
1. `App.tsx` mounts → calls `fetchProjects()`
2. `vercelService.ts` → `GET https://api.vercel.com/v9/projects` with `Authorization: Bearer {token}`
3. Maps response to `Project[]` type
4. Renders grid of `NeoCard` components

## Features (detailed)

### Project Grid
- 1 col (mobile) → 2 col (md) → 3 col (lg)
- Each card: project name, framework label, domain hostname, "View Project" button
- Cards link to `project.link` (primary Vercel deployment URL)

### Loading State
- 6 skeleton cards with pulsing animation
- Matches card structure exactly (title, meta, button placeholders)

### Error State
- "API Connection Unavailable" message with debugging hint
- "Connection Error" badge in header row

### Neobrutalist Design System
- `border-3 border-neo-black` (thick borders)
- `shadow-neo`: hard 4px offset shadow
- `bg-neo-white`, `bg-neo-grey`, `bg-neo-black`
- Uppercase typography, tight tracking

## API
**Vercel API:** `GET /v9/projects`
- Requires `Authorization: Bearer {VERCEL_API_TOKEN}`
- Returns array of project objects with `id`, `name`, `framework`, `alias[]`

## Data / Config
| Item | Description |
|------|-------------|
| `VERCEL_API_TOKEN` | Environment variable — Vercel personal access token |

## Deployment / Run
```bash
npm install
npm run dev
```
Set `VERCEL_API_TOKEN` in `.env` or Vercel project settings.

## Constraints & Notes
- **Token exposure**: API token must be in server-side context or kept in Vercel env vars — not bundled in client JS
- **Live data**: grid auto-reflects all Vercel projects; no manual curation needed
- **Framework field**: may be `null` for non-framework projects; defaults to `'React'` display
