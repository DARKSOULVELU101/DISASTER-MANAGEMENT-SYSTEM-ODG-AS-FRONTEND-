"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  flat = false,
}: {
  children: ReactNode;
  className?: string;
  flat?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`${flat ? "card-flat" : "card-elev"} p-5 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function CardTitle({
  title,
  tag,
  children,
}: {
  title: string;
  tag?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h3 className="font-sans text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
      <div className="flex items-center gap-2">
        {children}
        {tag && (
          <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

export function CountUp({
  value,
  format,
  className = "",
  duration = 1.2,
}: {
  value: number;
  format: (v: number) => string;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  return <span className={`tabular ${className}`}>{format(reduce ? value : display)}</span>;
}

export function KpiCard({
  label,
  value,
  format,
  sub,
  delay = 0,
}: {
  label: string;
  value: number;
  format: (v: number) => string;
  sub: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="card-elev group relative overflow-hidden p-5 sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(45,156,255,0.28), transparent 70%)" }}
      />
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="mt-2.5 font-sans text-[1.7rem] font-bold leading-none tracking-tight text-ink sm:text-[2rem]">
        <CountUp value={value} format={format} />
      </div>
      <div className="mt-2.5 text-[12.5px] text-muted">{sub}</div>
    </motion.div>
  );
}

export function ProgressRow({
  name,
  label,
  value,
  max,
  delay = 0,
}: {
  name: string;
  label: string;
  value: number;
  max: number;
  delay?: number;
}) {
  const pct = Math.max(2, (value / max) * 100);
  return (
    <div className="py-2.5">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13.5px] font-medium text-ink">{name}</span>
        <span className="tabular text-[12.5px] font-semibold text-brand-700">{label}</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-full bg-mist">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-800 via-brand-500 to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function DataTable({
  rows,
  cols,
}: {
  rows: Record<string, unknown>[];
  cols: string[];
}) {
  return (
    <div className="scroll-thin -mx-1 max-h-[560px] overflow-auto rounded-xl border border-line">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-surface">
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                className="border-b border-line px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/60 transition-colors last:border-0 hover:bg-brand-50/50">
              {cols.map((c) => (
                <td key={c} className="px-4 py-2.5 text-[13px] text-ink">
                  {typeof r[c] === "number"
                    ? Number(r[c]).toLocaleString("en-IN")
                    : String(r[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InsightRow({ title, text, delay = 0 }: { title: string; text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3.5 rounded-xl p-2 transition-colors hover:bg-surface"
    >
      <span className="mt-1 h-2 w-2 flex-none rounded-full bg-gradient-to-br from-brand-500 to-accent" />
      <div>
        <div className="text-[13.5px] font-semibold text-ink">{title}</div>
        <div className="mt-0.5 text-[13px] text-muted">{text}</div>
      </div>
    </motion.div>
  );
}
