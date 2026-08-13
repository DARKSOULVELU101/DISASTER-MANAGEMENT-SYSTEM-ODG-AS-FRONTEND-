"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChartLineUp, ShieldCheck, Sparkle, SquaresFour, Timer } from "@phosphor-icons/react";
import { GBadge } from "@/components/brand/g-logo";
import { GenvouchLoader } from "@/components/loader";
import { GradientShimmer } from "@/components/ui/gradient-shimmer";
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

function fadeUp(
  delay = 0
): { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition } {
  return {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  };
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
      initial={{ opacity: 0, y: 32, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="card-elev overflow-hidden p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </span>
          <span className="ml-2 text-[11px] font-medium text-muted">
            India Disaster Intelligence · Live preview
          </span>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          {[
            ["Events", "453"],
            ["Damage", "₹ 4.69 L Cr"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-surface px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted">{k}</div>
              <div className="tabular mt-1 text-[1.1rem] font-bold text-ink">{v}</div>
            </div>
          ))}
        </div>
        {data && (
          <div className="rounded-xl border border-line bg-white p-3">
            <div className="mb-2 text-[11px] font-semibold text-ink">Top states by damage</div>
            <AppBarChart
              data={data.topStates.damage.slice(0, 6)}
              dataKey="damage"
              labels={(d) => String(d.state).slice(0, 10)}
              height={150}
            />
          </div>
        )}
      </div>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[20px]"
        style={{
          background: "linear-gradient(120deg, rgba(21,101,255,0.14), transparent 38%, rgba(45,156,255,0.14))",
          filter: "blur(18px)",
          zIndex: -1,
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export function LandingPage() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <div className="min-h-dvh bg-white">
      <AnimatePresence>
        {!loaderDone && <GenvouchLoader onComplete={() => setLoaderDone(true)} />}
      </AnimatePresence>

      <header className="glass-nav sticky top-0 z-30 border-b border-line">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: -8 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>
              <GBadge size={34} />
            </motion.div>
            <div>
              <div className="font-sans text-[14px] font-bold leading-none tracking-tight text-ink">GENVOUCH</div>
              <div className="mt-0.5 text-[8.5px] font-medium uppercase tracking-[0.22em] text-muted">
                Technologies Pvt
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-muted md:flex">
            <a href="#features" className="transition-colors hover:text-ink">Capabilities</a>
            <a href="#views" className="transition-colors hover:text-ink">Views</a>
            <a href="#data" className="transition-colors hover:text-ink">Data</a>
          </nav>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-800 via-brand-600 to-brand-500 px-[18px] py-[10px] text-[13px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(0,42,120,0.55)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
          >
            Launch Console
            <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="radial-blue relative overflow-hidden">
          <div className="grid-paper absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
            <div>
              <motion.p {...fadeUp(0)} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand-700 backdrop-blur">
                <Sparkle size={13} weight="duotone" className="text-brand-500" />
                Genvouch Analytics Console
              </motion.p>
              <motion.h1
                {...fadeUp(0.08)}
                className="mt-5 font-sans text-[2.6rem] font-bold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[3.4rem] lg:text-[4rem]"
              >
                India&apos;s disasters,
                <br />
                <GradientShimmer>understood at a glance.</GradientShimmer>
              </motion.h1>
              <motion.p
                {...fadeUp(0.16)}
                className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-muted"
              >
                A premium analytics console by GENVOUCH TECHNOLOGIES PVT that turns the
                open government disaster dataset into interactive intelligence — live
                filters, state ranking, risk scores, and an AI copilot that answers
                from the data.
              </motion.p>
              <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-800 via-brand-600 to-brand-500 px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_16px_36px_-12px_rgba(0,42,120,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
                >
                  Enter the Console
                  <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#views"
                  className="rounded-full border border-line bg-white px-6 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  Explore the views
                </a>
              </motion.div>
            </div>
            <HeroPreview />
          </div>
        </section>

        {/* Stats band */}
        <section id="data" className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:py-12">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-1.5 text-center lg:items-start lg:text-left"
              >
                <div className="font-sans text-[2rem] font-bold tracking-tight text-brand-800 sm:text-[2.4rem]">
                  <CountUp value={s.value} format={s.format} />
                </div>
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section id="features" className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-[640px]"
          >
            <h2 className="font-sans text-[2rem] font-bold tracking-[-0.04em] text-ink sm:text-[2.6rem]">
              Built for <GradientShimmer>decision-makers</GradientShimmer>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Every screen in the console is engineered for trust, speed, and data
              understanding — not template aesthetics.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`card-elev group p-6 transition-shadow hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.18)] ${
                  i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-800 via-brand-600 to-accent text-white shadow-[0_8px_20px_-8px_rgba(21,101,255,0.6)] transition-transform group-hover:scale-105">
                  <cap.icon size={20} weight="duotone" />
                </div>
                <h3 className="font-sans text-[16px] font-semibold tracking-tight text-ink">
                  {cap.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{cap.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Views */}
        <section id="views" className="border-y border-line bg-surface">
          <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 max-w-[640px]"
            >
              <h2 className="font-sans text-[2rem] font-bold tracking-[-0.04em] text-ink sm:text-[2.6rem]">
                Nine views, one console
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                From a 50,000-foot executive overview to the raw records behind every
                number, the console takes you from insight to evidence.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {VIEW_ITEMS.map((v, i) => (
                <motion.a
                  key={v}
                  href="/dashboard"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4 transition-all hover:border-brand-200 hover:shadow-[0_12px_28px_-16px_rgba(21,101,255,0.4)]"
                >
                  <span className="flex items-center gap-4">
                    <span className="tabular text-[11px] font-semibold text-faint group-hover:text-brand-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] font-medium text-ink">{v}</span>
                  </span>
                  <ArrowRight size={15} className="text-faint transition-all group-hover:translate-x-1 group-hover:text-brand-600" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="radial-blue relative overflow-hidden">
          <div className="mx-auto max-w-[1280px] px-5 py-20 text-center sm:px-8 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-sans text-[2.1rem] font-bold tracking-[-0.04em] text-ink sm:text-[2.9rem]">
                Put disaster intelligence
                <br />
                <GradientShimmer>to work for you.</GradientShimmer>
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                Open the console to explore every state, disaster type, and trend in the
                dataset — with Genvouch Copilot ready to answer your questions.
              </p>
              <Link
                href="/dashboard"
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-800 via-brand-600 to-brand-500 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_20px_44px_-14px_rgba(0,42,120,0.65)] transition-transform hover:scale-[1.04] active:scale-[0.97]"
              >
                Launch the Console
                <ArrowRight size={17} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-8 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <GBadge size={26} />
            <span className="font-semibold text-ink">GENVOUCH TECHNOLOGIES PVT</span>
          </div>
          <span>© {new Date().getFullYear()} GENVOUCH TECHNOLOGIES PVT. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
