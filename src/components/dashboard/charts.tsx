"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";

export const PALETTE = [
  "#C6A24B",
  "#8A6A23",
  "#B18A33",
  "#5E4518",
  "#D9BE77",
  "#4A4537",
  "#A67C2E",
  "#E2CF96",
  "#6F6656",
  "#96702A",
];

const AXIS = "#9C917A";
const GRID = "rgba(43,39,32,0.08)";

interface TooltipRow {
  name?: string;
  value?: number | string;
  color?: string;
}

function BrandTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-ivory-light/95 px-3.5 py-2.5 shadow-[0_10px_30px_-12px_rgba(43,39,32,0.35)] backdrop-blur">
      {label !== undefined && (
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || PALETTE[i % PALETTE.length] }}
          />
          <span className="tabular">{Number(p.value ?? 0).toLocaleString("en-IN")}</span>
          {unit && <span className="text-[11px] font-normal text-muted">{unit}</span>}
        </div>
      ))}
    </div>
  );
}

interface ChartShellProps {
  height?: number;
  children: ReactNode;
  title?: string;
}

export function ChartShell({ height = 280, children, title }: ChartShellProps) {
  return (
    <div
      className="relative w-full"
      style={{ height }}
      role="img"
      aria-label={title ?? "Chart"}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

type Row = object;

function num(row: Row, key: string): number {
  return Number((row as Record<string, unknown>)[key]) || 0;
}

export function AppBarChart<T extends Row>({
  data,
  dataKey,
  labels,
  unit = "",
  height = 280,
  color = PALETTE[0],
}: {
  data: T[];
  dataKey: string;
  labels: (d: T) => string;
  unit?: string;
  height?: number;
  color?: string;
}) {
  const axisData = data.map((d) => ({ ...d, __label: labels(d) }));
  const longest = Math.max(...data.map((d) => String(labels(d)).length), 6);
  const tickCount = data.length > 14 ? Math.ceil(data.length / 12) : undefined;
  return (
    <ChartShell height={height}>
      <BarChart data={axisData} margin={{ top: 18, right: 8, left: -12, bottom: 8 }} barCategoryGap="28%">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="__label"
          tick={{ fill: AXIS, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={tickCount ?? 0}
          angle={longest > 10 ? -38 : 0}
          textAnchor={longest > 10 ? "end" : "middle"}
          height={longest > 10 ? 56 : 30}
        />
        <YAxis
          tick={{ fill: AXIS, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 1e5 ? `${(v / 1e5).toFixed(0)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : String(v))}
        />
        <Tooltip content={<BrandTooltip unit={unit} />} cursor={{ fill: "rgba(198,162,75,0.12)" }} />
        <defs>
          <linearGradient id={`bar-grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.28} />
          </linearGradient>
        </defs>
        <Bar
          dataKey={dataKey}
          fill={`url(#bar-grad-${dataKey})`}
          radius={[2, 2, 2, 2]}
          maxBarSize={44}
          animationDuration={1400}
          animationEasing="cubic-bezier(0.65,0,0.35,1)"
        />
      </BarChart>
    </ChartShell>
  );
}

export function AppLineChart<T extends Row>({
  data,
  dataKey,
  labels,
  unit = "",
  height = 280,
}: {
  data: T[];
  dataKey: string;
  labels: (d: T) => string;
  unit?: string;
  height?: number;
}) {
  const axisData = data.map((d) => ({ ...d, __label: labels(d) }));
  return (
    <ChartShell height={height}>
      <LineChart data={axisData} margin={{ top: 18, right: 16, left: -12, bottom: 8 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="__label"
          tick={{ fill: AXIS, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: AXIS, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 1e5 ? `${(v / 1e5).toFixed(0)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : String(v))}
        />
        <Tooltip content={<BrandTooltip unit={unit} />} cursor={{ stroke: "rgba(198,162,75,0.4)", strokeDasharray: "4 4" }} />
        <defs>
          <linearGradient id={`line-grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C6A24B" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#C6A24B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#B18A33"
          strokeWidth={2.6}
          dot={{ r: 3.4, fill: "#FAF6EA", strokeWidth: 2, stroke: "#B18A33" }}
          activeDot={{ r: 5.5, fill: "#5E4518", strokeWidth: 0 }}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </LineChart>
    </ChartShell>
  );
}

export function AppDoughnutChart<T extends Row>({
  data,
  dataKey,
  labelKey,
  height = 280,
}: {
  data: T[];
  dataKey: string;
  labelKey: string;
  height?: number;
}) {
  const total = data.reduce((acc, d) => acc + num(d, dataKey), 0);
  return (
    <ChartShell height={height}>
      <PieChart>
        <Tooltip content={<BrandTooltip />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={labelKey}
          innerRadius="58%"
          outerRadius="84%"
          paddingAngle={2.5}
          cornerRadius={5}
          stroke="none"
          animationDuration={1400}
          animationEasing="cubic-bezier(0.65,0,0.35,1)"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="serif-num text-[1.35rem] font-semibold text-ink">{total.toLocaleString("en-IN")}</div>
          <div className="mt-1 text-[9.5px] uppercase tracking-[0.22em] text-muted">Total</div>
        </div>
      </div>
    </ChartShell>
  );
}

export function AppScatterChart<T extends Row>({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  height = 280,
}: {
  data: T[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  height?: number;
}) {
  return (
    <ChartShell height={height}>
      <ScatterChart margin={{ top: 20, right: 16, left: -8, bottom: 12 }}>
        <CartesianGrid stroke={GRID} />
        <XAxis
          type="number"
          dataKey={xKey}
          name={xLabel}
          tick={{ fill: AXIS, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 1e4 ? `${(v / 1e4).toFixed(1)}L` : String(v))}
          label={{ value: xLabel, position: "insideBottomRight", offset: -4, fontSize: 11, fill: AXIS }}
        />
        <YAxis
          type="number"
          dataKey={yKey}
          name={yLabel}
          tick={{ fill: AXIS, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 1e4 ? `${(v / 1e4).toFixed(1)}L` : String(v))}
        />
        <Tooltip content={<BrandTooltip />} cursor={{ strokeDasharray: "4 4" }} />
        <Scatter data={data} animationDuration={900} animationEasing="ease-out">
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.82} />
          ))}
        </Scatter>
      </ScatterChart>
    </ChartShell>
  );
}
