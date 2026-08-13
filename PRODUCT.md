# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Emergency and disaster-management analysts, state authorities, policy researchers, journalists, and students who need India's open disaster data made legible and actionable. They evaluate trends across states, disaster types, and years, and want answers without wrangling spreadsheets.

## Product Purpose

GENVOUCH India Disaster Intelligence turns the open government disaster dataset into an interactive intelligence console: live filters by state, disaster type, and year; state ranking and risk scores; trend, type, and South India views; a searchable records table; and an AI copilot that answers questions grounded in the data. Success is a visitor finding a state, a hazard, or a period of interest and leaving with a concrete, evidence-backed picture within minutes.

## Positioning

The meaningfully different mechanism is the pairing of a polished, presentation-grade analytics console over open government data with a generative AI copilot that reads the same dataset the charts render — the charts and the copilot answer from one source of truth, in a single interface.

## Operating Context

The console runs entirely in the browser over static data files (`public/data/dashboard-data.json`, `public/data/disasters.json`). Visitors move between five views — Executive Overview, South India, Disaster Types, Timeline, Records — through a left navigation rail, filter with state/disaster/year dropdowns, and ask the copilot questions in a chat drawer. The site is server-rendered by Next.js and deployed to Vercel; the copilot calls a server-side route (`/api/copilot`) backed by the Gemini API.

## Capabilities and Constraints

- Five views: Overview, South India, Disaster Types, Timeline, Records.
- Filters: state, disaster type, year (State/Disaster/Year dropdowns, "All" default).
- Charts: ranked bar, year line/area, disaster doughnut, scatter, type comparison.
- KPI totals for India and South India; top-state damage/deaths/affected/risk tables.
- Records table with search and sorting.
- AI copilot chat drawer answering from the loaded dataset; real Gemini behind `/api/copilot` with a fallback for unavailable keys.
- Data is static; no external data calls in the client. Next.js 16 + React 19 + Tailwind CSS v4 + Recharts. Deploys to Vercel. Gemini key is server-side only.

## Brand Commitments

- Company: GENVOUCH / GENVOUCH TECHNOLOGIES PVT. The GENVOUCH name and "India Disaster Intelligence" product title are binding.
- The user pinned a binding visual constraint for this redesign: Warm Ivory + Champagne Gold + Charcoal, Editorial Typography, Cinematic Photography, Slow Motion; Charcoal as the chrome (nav/sidebar/headers) over a warm-ivory canvas. Full scope: landing page, dashboard, and copilot.
- Photography for the cinematic layer will be provided by the user; the build wires in photo slots and must stay complete-looking before the files arrive.

## Evidence on Hand

- `public/data/dashboard-data.json` and `public/data/disasters.json` — the real open-disaster dataset the console renders (no fabricated figures).
- `README.md` — product description and quick-start.
- Legacy static implementation preserved at `C:\Users\naren\AppData\Local\Temp\opencode\legacy-src\` (reference for the subject matter only; the redesign replaces its look).
- No photographic assets, testimonials, customer logos, or press are present; those must not be fabricated.

## Product Principles

1. One source of truth: charts, tables, and the copilot all answer from the same loaded dataset.
2. Analytics first, decoration second: expression must never obscure the task, state, or familiar affordance on the console.
3. Premium, presentation-grade finish befitting a published intelligence product for professional audiences.
4. Accessibility and performance are preserved across every redesign (keyboard, screen-reader labels, responsive, static-friendly).
5. No fabricated figures, customers, or claims; anything illustrative that could be mistaken for real evidence is labeled.
