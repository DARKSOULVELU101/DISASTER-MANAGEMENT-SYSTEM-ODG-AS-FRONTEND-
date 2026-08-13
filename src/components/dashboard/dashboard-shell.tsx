"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, List, X } from "@phosphor-icons/react";
import { GBadge, GMark } from "@/components/brand/g-logo";
import { GenvouchLoader } from "@/components/loader";
import { Copilot } from "@/components/copilot";
import type { DashboardData, Filters } from "@/lib/disaster-data";
import { DEFAULT_FILTERS, getFiltered } from "@/lib/disaster-data";
import {
  DamageView,
  ImpactView,
  OverviewView,
  RecordsView,
  RiskView,
  SouthView,
  StateView,
  TypesView,
  YearlyView,
} from "@/components/dashboard/views";

type ViewKey =
  | "overview"
  | "state"
  | "types"
  | "yearly"
  | "south"
  | "impact"
  | "damage"
  | "risk"
  | "records";

const VIEWS: { key: ViewKey; label: string; blurb: string }[] = [
  { key: "overview", label: "Executive Overview", blurb: "Command center across all metrics." },
  { key: "state", label: "State Performance", blurb: "Ranking across damage and events." },
  { key: "types", label: "Disaster Type Analysis", blurb: "Composition by disaster category." },
  { key: "yearly", label: "Yearly Trend", blurb: "2014–2023 movement." },
  { key: "south", label: "South India Focus", blurb: "Dedicated southern states lens." },
  { key: "impact", label: "Human Impact", blurb: "Affected people and mortality." },
  { key: "damage", label: "Damage & Homes", blurb: "Economic and housing damage." },
  { key: "risk", label: "Risk Score Matrix", blurb: "Composite 0–100 state risk." },
  { key: "records", label: "Raw Data Explorer", blurb: "Underlying OGD records." },
];

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="card-elev h-[120px] animate-pulse p-5">
          <div className="h-3 w-20 rounded bg-mist" />
          <div className="mt-3 h-7 w-28 rounded bg-mist" />
          <div className="mt-2 h-3 w-32 rounded bg-mist" />
        </div>
      ))}
    </div>
  );
}

export function DashboardShell() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [active, setActive] = useState<ViewKey>("overview");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    fetch("/data/dashboard-data.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load data");
        return r.json();
      })
      .then((d: DashboardData) => setData(d))
      .catch(() => setLoadError(true));
  }, []);

  const records = useMemo(
    () => (data ? getFiltered(data.records, filters) : []),
    [data, filters]
  );

  const activeView = VIEWS.find((v) => v.key === active)!;

  const contextJson = useMemo(() => {
    if (!data) return "{}";
    const yearGroups = records.reduce<Record<string, { year: number; events: number; damage: number }>>(
      (acc, r) => {
        acc[r.year] ??= { year: r.year, events: 0, damage: 0 };
        acc[r.year].events += r.events;
        acc[r.year].damage += r.damage;
        return acc;
      },
      {}
    );
    return JSON.stringify({
      activePage: activeView.label,
      activeFilters: filters,
      totals: {
        records: records.length,
        events: records.reduce((a, r) => a + r.events, 0),
        deaths: records.reduce((a, r) => a + r.deaths, 0),
        injured: records.reduce((a, r) => a + r.injured, 0),
        affected: records.reduce((a, r) => a + r.affected, 0),
        homes: records.reduce((a, r) => a + r.homes, 0),
        damage: records.reduce((a, r) => a + r.damage, 0),
      },
      indiaTotals: data.totals.india,
      southIndiaTotals: data.totals.southIndia,
      datasetFields: ["state", "region", "type", "year", "events", "deaths", "injured", "affected", "homes", "damage", "south"],
      yearlyTrend: Object.values(yearGroups).sort((a, b) => a.year - b.year),
    });
  }, [data, records, filters, activeView.label]);

  const pickFilter = useCallback(
    (key: keyof Filters, value: string) => setFilters((f) => ({ ...f, [key]: value })),
    []
  );

  function renderView() {
    if (!data) return <LoadingSkeleton />;
    switch (active) {
      case "overview":
        return <OverviewView data={data} />;
      case "state":
        return <StateView records={records} />;
      case "types":
        return <TypesView records={records} />;
      case "yearly":
        return <YearlyView records={records} />;
      case "south":
        return <SouthView records={records} />;
      case "impact":
        return <ImpactView records={records} />;
      case "damage":
        return <DamageView records={records} />;
      case "risk":
        return <RiskView records={records} />;
      case "records":
        return <RecordsView records={records} />;
    }
  }

  const selectClass =
    "h-10 min-w-[132px] cursor-pointer appearance-none rounded-xl border border-line bg-white pl-3.5 pr-8 text-[13px] font-medium text-ink outline-none transition-colors hover:border-brand-300 focus:border-brand-400";

  const filtersBar = (
    <div className="flex flex-wrap items-center gap-2.5">
      {(
        [
          ["State", "state", data?.states ?? []],
          ["Disaster", "type", data?.types ?? []],
          ["Year", "year", data?.years.map((y) => String(y.year)) ?? []],
        ] as const
      ).map(([label, key, items]) => (
        <label key={key} className="relative">
          <span className="sr-only">{label}</span>
          <select
            className={selectClass}
            value={filters[key]}
            onChange={(e) => pickFilter(key, e.target.value)}
          >
            <option value="All">All {label}s</option>
            {items.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted">
            ▼
          </span>
        </label>
      ))}
    </div>
  );

  const navList = (
    <nav className="flex flex-col gap-1">
      {VIEWS.map((v, i) => {
        const isActive = v.key === active;
        return (
          <button
            key={v.key}
            onClick={() => {
              setActive(v.key);
              setNavOpen(false);
            }}
            className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
              isActive ? "text-brand-800" : "text-muted hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-xl border border-brand-100 bg-brand-50/80"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={`tabular relative z-10 text-[10.5px] font-semibold ${
                isActive ? "text-brand-500" : "text-faint"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative z-10 text-[13.5px] font-medium">{v.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3">
      <motion.div whileHover={{ rotate: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>
        <GBadge size={36} />
      </motion.div>
      <div>
        <div className="font-sans text-[15px] font-bold leading-none tracking-tight text-ink">
          GENVOUCH
        </div>
        <div className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.22em] text-muted">
          Technologies Pvt
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <AnimatePresence>
        {!loaderDone && (
          <GenvouchLoader onComplete={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-line bg-white/80 backdrop-blur lg:flex">
        <Link href="/" className="px-6 pb-2 pt-6">
          {brand}
        </Link>
        <div className="mx-6 my-5 h-px bg-line" />
        <div className="flex-1 overflow-y-auto px-3">{navList}</div>
        <div className="mx-6 mb-6 rounded-2xl border border-line bg-surface p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
            Dataset
          </div>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            India Disaster Management OGD · {data?.totals.india.records ?? "—"} records
            · 2014–2023
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700 hover:text-brand-500"
          >
            <ArrowLeft size={13} weight="bold" /> Back to home
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-line bg-white lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-5">
                {brand}
                <button
                  onClick={() => setNavOpen(false)}
                  className="rounded-lg p-2 text-muted hover:bg-surface"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mx-5 my-4 h-px bg-line" />
              <div className="flex-1 overflow-y-auto px-3">{navList}</div>
              <div className="mx-5 mb-6 rounded-2xl border border-line bg-surface p-4">
                <p className="text-[12px] leading-relaxed text-muted">
                  India Disaster Management OGD · 2014–2023
                </p>
                <Link href="/" className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
                  <ArrowLeft size={13} weight="bold" /> Back to home
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-h-dvh flex-col lg:pl-[252px]">
        <header className="glass-nav sticky top-0 z-20 border-b border-line">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              onClick={() => setNavOpen(true)}
              className="rounded-lg border border-line bg-white p-2 text-ink lg:hidden"
              aria-label="Open navigation"
            >
              <List size={18} />
            </button>
            <div className="mr-auto min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                Genvouch Analytics
              </p>
              <h1 className="truncate font-sans text-[17px] font-bold leading-tight tracking-tight text-ink sm:text-[19px]">
                {activeView.label}
              </h1>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">Live OGD Data</span>
            </div>
            <div className="w-full md:w-auto">{filtersBar}</div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {loadError ? (
            <div className="card-elev mx-auto max-w-md p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
                <GMark size={30} />
              </div>
              <h2 className="mt-4 font-sans text-lg font-bold text-ink">Could not load the dataset</h2>
              <p className="mt-2 text-[13px] text-muted">
                The OGD snapshot failed to load. Please refresh the page to try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-gradient-to-r from-brand-800 to-brand-600 px-5 py-2.5 text-[13px] font-semibold text-white"
              >
                Reload
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <footer className="border-t border-line bg-white/70">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-4 py-5 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              © {new Date().getFullYear()} GENVOUCH TECHNOLOGIES PVT · India Disaster Intelligence
            </span>
            <span className="flex items-center gap-2">
              <span>Source · Open Government Data</span>
              <span className="text-line">|</span>
              <Link href="/" className="font-medium text-brand-700 hover:text-brand-500">
                Privacy
              </Link>
              <span className="text-line">|</span>
              <Link href="/" className="font-medium text-brand-700 hover:text-brand-500">
                Terms
              </Link>
            </span>
          </div>
        </footer>
      </div>

      {data && <Copilot contextJson={contextJson} activePage={activeView.label} />}
    </div>
  );
}
