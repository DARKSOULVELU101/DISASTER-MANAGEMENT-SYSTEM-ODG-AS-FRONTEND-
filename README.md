# GENVOUCH · India Disaster Intelligence

A premium, Power BI-class analytics platform for **India Disaster Management** open
government data (OGD), built by **GENVOUCH TECHNOLOGIES PVT** with Next.js, React,
Tailwind CSS v4, Motion and Recharts.

## Features

- **Landing experience** — branded animated loader, hero with live chart preview,
  capabilities, and view showcase.
- **9 analytics views** — Executive Overview, State Performance, Disaster Type
  Analysis, Yearly Trend, South India Focus, Human Impact, Damage & Homes,
  Risk Score Matrix, and Raw Data Explorer.
- **Global filters** — state, disaster type, and year across every chart, KPI,
  and table.
- **Genvouch Copilot** — an in-app AI assistant (Gemini API) grounded on the
  loaded dataset, with a local fallback when the key is unavailable.
- **Fully responsive** — desktop sidebar, mobile drawer navigation, and adaptive
  chart layouts.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Tailwind CSS v4** design system (GENVOUCH brand tokens)
- **Motion** for animation, **Recharts** for charts, **Phosphor Icons**
- TypeScript, ESLint (Next config)

## Getting Started

```bash
npm install
cp .env.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The console lives at
`/dashboard`.

## Production

```bash
npm run build
npm start
```

## Data

Dataset snapshots live in `public/data/` (`dashboard-data.json`,
`disasters.json`) sourced from India's open government data portal covering
2014–2023. The AI Copilot endpoint is `POST /api/copilot` (server-side only —
keys never ship to the client).

## Deploy

Push to GitHub and import into Vercel — no config required:

```bash
vercel --prod
```

Built with care by GENVOUCH TECHNOLOGIES PVT.
