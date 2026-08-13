"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChartLineUp, ShieldCheck, Sparkle, SquaresFour, Timer } from "@phosphor-icons/react";
import { GBadge } from "@/components/brand/g-logo";
import { GenvouchLoader } from "@/components/loader";
import { CountUp } from "@/components/dashboard/ui";
import type { DashboardData } from "@/lib/disaster-data";
import { compact, crore, fmt } from "@/lib/disaster-data";
import { AppBarChart } from "@/components/dashboard/charts";

const STATS = [
  { label: "States Covered", value: 24, format: (v: number) => fmt(Math.round(v)) },
  { label: "Disaster Events", value: 453, format: (v: number) => fmt(Math.round(v)) },
  { label: "Economic Damage", value: 469340, format: (v: number) => crore(Math.round(v)) },
  { label: "People Affected", value: 228083000, format: (v: number) => compact(Math.round(v)) },
];

const CAPABILITIES = [
  {
    icon: SquaresFour,
    title: "Nine analytics views",
    text: "Executive overview, state performance, disaster type analysis, yearly trends, South India focus, human impact, damage & homes, risk scoring, and a raw data explorer.",
  },
  {
    icon: Sparkle,
    title: "Genvouch Copilot",
    text: "An AI assistant embedded in the console that answers questions about events, deaths, damage, and trends directly from the live filtered dataset.",
  },
  {
    icon: ChartLineUp,
    title: "Filter-driven charts",
    text: "Every chart, table, and KPI reacts to state, disaster-type, and year filters — a true Power BI-class slice-and-dice experience.",
  },
  {
    icon: ShieldCheck,
    title: "Composite risk scoring",
    text: "A normalized 0–100 risk score blends events, deaths, affected people, and damage so decision-makers can triage states at a glance.",
  },
  {
    icon: Timer,
    title: "Open government data",
    text: "Built on the India Open Government Data platform snapshot covering 2014–2023, with a frozen offline snapshot and live update path.",
  },
];

const VIEW_ITEMS = [
  "Executive Overview",
  "State Performance",
  "Disaster Type Analysis",
  "Yearly Trend",
  "South India Focus",
  "Human Impact",
  "Damage & Homes",
  "Risk Score Matrix",
  "Raw Data Explorer",
];

function fadeUpCine(
  delay = 0
): { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition } {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.15, delay, ease: [0.65, 0, 0.35, 1] },
  };
}

function Folio() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-4 text-[10px] font-medium uppercase tracking-[0.26em] text-ivory-light/70 sm:px-8">
      <span className="tabular">No. 01 — OGD Ledger</span>
      <span className="hidden sm:inline">GENVOUCH TECHNOLOGIES PVT</span>
    </div>
  );
}

function HeroPreview() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    fetch("/data/dashboard-data.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => undefined);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, rotateX: 4 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.2, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
      className="relative mx-auto w-full max-w-[520px]"
    >
      <div className="relative">
        <Folio />
        <div className="film-slot-portrait relative h-[440px] overflow-hidden rounded-[4px] border border-line sm:h-[520px]">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="film-light" />
          </motion.div>
          <div className="film-vignette" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
            <div className="h-px w-16 bg-brand-300" />
            <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-ivory-light/85">
              The national disaster ledger, 2014–2023
            </p>
            <p className="mt-1.5 max-w-[40ch] text-[13px] leading-relaxed text-ivory-light/70">
              A still from the record — every bar, band, and line in this console
              reads directly from open government data.
            </p>
          </div>
        </div>

        <motion.div
          className="card-elev absolute -bottom-10 -left-4 w-[290px] p-4 shadow-[0_24px_60px_-24px_rgba(43,39,32,0.5)] sm:-left-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.85, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-brand-700">
              Top States · Damage
            </span>
            <span className="tabular text-[10px] font-medium text-faint">Cr INR</span>
          </div>
          <div className="h-px w-full bg-line" />
          {data ? (
            <div className="pt-2">
              <AppBarChart
                data={data.topStates.damage.slice(0, 5)}
                dataKey="damage"
                labels={(d) => String(d.state).slice(0, 9)}
                height={120}
              />
            </div>
          ) : (
            <div className="space-y-2 pt-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-4 rounded bg-mist/70" />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <div className="min-h-dvh bg-ivory text-ink">
      <AnimatePresence>
        {!loaderDone && <GenvouchLoader onComplete={() => setLoaderDone(true)} />}
      </AnimatePresence>

      <header className="glass-nav sticky top-0 z-30 border-b border-line">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: -8 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>
              <GBadge size={34} />
            </motion.div>
            <div>
              <div className="font-display text-[16px] font-semibold leading-none tracking-tight text-ink">
                GENVOUCH
              </div>
              <div className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.26em] text-brand-700">
                Technologies Pvt
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-medium tracking-wide text-muted md:flex">
            <a href="#features" className="transition-colors hover:text-ink">Capabilities</a>
            <a href="#views" className="transition-colors hover:text-ink">Views</a>
            <a href="#data" className="transition-colors hover:text-ink">Data</a>
          </nav>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 border border-charcoal bg-charcoal px-5 py-2.5 text-[13px] font-semibold text-ivory-light transition-colors hover:border-brand-400 hover:bg-charcoal-700"
          >
            Launch Console
            <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="radial-warm relative overflow-hidden">
          <div className="grid-paper absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:pb-32">
            <div>
              <motion.p {...fadeUpCine(0)} className="inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.26em] text-brand-700">
                <span className="h-1.5 w-1.5 bg-brand-400" />
                Genvouch Analytics Console
              </motion.p>
              <motion.h1
                {...fadeUpCine(0.12)}
                className="mt-6 font-display text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.02em] text-ink sm:text-[3.9rem] lg:text-[4.6rem]"
              >
                India&apos;s disasters,
                <br />
                <span className="text-gradient-gold">understood at a glance.</span>
              </motion.h1>
              <motion.div {...fadeUpCine(0.2)} className="mt-7 flex items-center gap-4">
                <span className="h-px w-12 bg-brand-400" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
                  Vol. I — The National Ledger
                </span>
              </motion.div>
              <motion.p
                {...fadeUpCine(0.28)}
                className="mt-6 max-w-[54ch] text-[16px] leading-relaxed text-muted"
              >
                A premium analytics console by GENVOUCH TECHNOLOGIES PVT that turns the
                open government disaster dataset into interactive intelligence — live
                filters, state ranking, risk scores, and an AI copilot that answers
                from the data.
              </motion.p>
              <motion.div {...fadeUpCine(0.38)} className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2.5 bg-charcoal px-7 py-3.5 text-[14px] font-semibold text-ivory-light transition-colors hover:bg-charcoal-700"
                >
                  Enter the Console
                  <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#views"
                  className="border border-line bg-ivory-light px-7 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:border-brand-400 hover:text-brand-700"
                >
                  Explore the views
                </a>
              </motion.div>
            </div>
            <HeroPreview />
          </div>
        </section>

        {/* Stats band — charcoal plate */}
        <section id="data" className="plate-charcoal border-y border-charcoal-700">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:px-8 lg:grid-cols-4 lg:py-16">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.1, delay: i * 0.12, ease: [0.65, 0, 0.35, 1] }}
                className="relative border-l border-brand-400/25 pl-5"
              >
                <span className="tabular serif-num text-[2.4rem] font-semibold leading-none text-brand-300 sm:text-[2.9rem]">
                  <CountUp value={s.value} format={s.format} duration={1.6} />
                </span>
                <div className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory-light/60">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section id="features" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="mb-14 max-w-[680px]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-700">
              The Console
            </p>
            <h2 className="mt-4 font-display text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.015em] text-ink sm:text-[3rem]">
              Built for <span className="text-gradient-gold">decision-makers</span>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
              Every screen in the console is engineered for trust, speed, and data
              understanding — not template aesthetics.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.05, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
                className={`group relative bg-ivory p-7 transition-colors hover:bg-ivory-light ${
                  i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="tabular text-[11px] font-semibold text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center border border-brand-400/50 text-brand-700 transition-colors group-hover:bg-charcoal group-hover:text-brand-300">
                    <cap.icon size={18} weight="duotone" />
                  </span>
                </div>
                <div className="mt-8 h-px w-10 bg-brand-400" />
                <h3 className="mt-5 font-display text-[20px] font-semibold leading-tight tracking-tight text-ink">
                  {cap.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{cap.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Editorial film band */}
        <section className="film-slot-band relative overflow-hidden py-24 sm:py-32">
          <div className="film-light" />
          <div className="film-vignette" />
          <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
            <motion.blockquote
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              className="max-w-[760px]"
            >
              <span className="h-px w-16 bg-brand-300" />
              <p className="mt-6 font-display text-[2rem] font-medium leading-[1.15] tracking-tight text-ivory-light sm:text-[2.7rem]">
                The deadliest years are not always the most eventful. The ledger,
                read properly, tells you where to look before the season arrives.
              </p>
              <footer className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-ivory-light/60">
                <span className="h-px w-8 bg-brand-300" />
                Genvouch Editorial — India Disaster Intelligence
              </footer>
            </motion.blockquote>
          </div>
        </section>

        {/* Views */}
        <section id="views" className="border-b border-line bg-paper">
          <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              className="mb-12 max-w-[680px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-700">
                The Index
              </p>
              <h2 className="mt-4 font-display text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.015em] text-ink sm:text-[3rem]">
                Nine views, one console
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                From a 50,000-foot executive overview to the raw records behind every
                number, the console takes you from insight to evidence.
              </p>
            </motion.div>
            <div className="border-t border-line">
              {VIEW_ITEMS.map((v, i) => (
                <motion.a
                  key={v}
                  href="/dashboard"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, delay: i * 0.06, ease: [0.65, 0, 0.35, 1] }}
                  className="group flex items-center justify-between border-b border-line px-2 py-5 transition-colors hover:bg-ivory-light"
                >
                  <span className="flex items-center gap-6">
                    <span className="tabular serif-num text-[15px] font-semibold text-brand-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.15rem] font-medium tracking-tight text-ink transition-colors group-hover:text-brand-700 sm:text-[1.35rem]">
                      {v}
                    </span>
                  </span>
                  <ArrowRight size={17} className="text-faint transition-all group-hover:translate-x-1 group-hover:text-brand-600" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — charcoal plate */}
        <section className="plate-charcoal border-b border-charcoal-700">
          <div className="mx-auto max-w-[1280px] px-5 py-20 text-center sm:px-8 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-300">
                Open the Ledger
              </span>
              <h2 className="mx-auto mt-5 max-w-[640px] font-display text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-ivory-light sm:text-[3rem]">
                Put disaster intelligence to work for you.
              </h2>
              <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-relaxed text-ivory-light/65">
                Open the console to explore every state, disaster type, and trend in the
                dataset — with Genvouch Copilot ready to answer your questions.
              </p>
              <Link
                href="/dashboard"
                className="group mt-10 inline-flex items-center gap-2.5 border border-brand-400 bg-brand-400 px-8 py-4 text-[15px] font-semibold text-charcoal transition-colors hover:bg-brand-300"
              >
                Launch the Console
                <ArrowRight size={17} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-charcoal-700 bg-charcoal">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-8 text-[12.5px] text-ivory-light/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <GBadge size={26} />
            <span className="font-display font-semibold text-ivory-light">GENVOUCH TECHNOLOGIES PVT</span>
          </div>
          <span>© {new Date().getFullYear()} GENVOUCH TECHNOLOGIES PVT. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
