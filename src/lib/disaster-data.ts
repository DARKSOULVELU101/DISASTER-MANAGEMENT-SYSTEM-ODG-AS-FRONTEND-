export interface DisasterRecord {
  id: number;
  state: string;
  region: string;
  type: string;
  year: number;
  events: number;
  deaths: number;
  injured: number;
  affected: number;
  homes: number;
  damage: number;
  south: string;
}

export interface StateRow {
  state: string;
  region: string;
  southIndia: string;
  events: number;
  deaths: number;
  injured: number;
  affected: number;
  homes: number;
  damage: number;
  riskScore: number;
}

export interface YearRow {
  year: number;
  events: number;
  deaths: number;
  injured: number;
  affected: number;
  damage: number;
  southEvents: number;
}

export interface Totals {
  events: number;
  deaths: number;
  injured: number;
  affected: number;
  homes: number;
  damage: number;
  states: number;
  records: number;
}

export interface Insight {
  title: string;
  text: string;
}

export interface DashboardData {
  meta: { project: string; generatedAt: string; sourceFile: string };
  totals: { india: Totals; southIndia: Totals };
  records: DisasterRecord[];
  states: string[];
  types: string[];
  years: YearRow[];
  southRecords: DisasterRecord[];
  southByType: unknown[];
  southByStateType: unknown[];
  topStates: {
    damage: StateRow[];
    deaths: StateRow[];
    affected: StateRow[];
    risk: StateRow[];
  };
  insights: Insight[];
}

export interface Filters {
  state: string;
  type: string;
  year: string;
}

export const DEFAULT_FILTERS: Filters = { state: "All", type: "All", year: "All" };

export function fmt(n: number | string | null | undefined): string {
  return Number(n || 0).toLocaleString("en-IN");
}

export function crore(n: number | string | null | undefined): string {
  return "₹ " + fmt(n) + " Cr";
}

export function compact(n: number | string | null | undefined): string {
  const v = Number(n || 0);
  if (v >= 1e7) return (v / 1e7).toFixed(1) + " Cr";
  if (v >= 1e5) return (v / 1e5).toFixed(1) + " L";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + " K";
  return fmt(v);
}

export function sum(arr: DisasterRecord[], key: keyof DisasterRecord): number {
  return arr.reduce((acc, b) => acc + (Number(b[key]) || 0), 0);
}

export function sumVals(arr: { value: number }[]): number {
  return arr.reduce((acc, b) => acc + (Number(b.value) || 0), 0);
}

export interface GroupRow {
  name: string;
  events: number;
  deaths: number;
  injured: number;
  affected: number;
  homes: number;
  damage: number;
}

export function group(
  arr: DisasterRecord[],
  key: "state" | "type" | "region",
  nums: (keyof GroupRow)[] = ["events", "deaths", "affected", "damage", "homes"]
): GroupRow[] {
  const map = new Map<string, GroupRow>();
  arr.forEach((r) => {
    const k = r[key];
    let row = map.get(k);
    if (!row) {
      row = { name: k, events: 0, deaths: 0, injured: 0, affected: 0, homes: 0, damage: 0 };
      map.set(k, row);
    }
    const rrow = row as unknown as Record<string, number>;
    nums.forEach((n) => {
      const value = Number((r as unknown as Record<string, unknown>)[n]) || 0;
      rrow[n] = (rrow[n] || 0) + value;
    });
  });
  return Array.from(map.values());
}

export function byYear(arr: DisasterRecord[]): YearRow[] {
  const map = new Map<number, YearRow>();
  arr.forEach((r) => {
    let row = map.get(r.year);
    if (!row) {
      row = { year: r.year, events: 0, deaths: 0, injured: 0, affected: 0, damage: 0, southEvents: 0 };
      map.set(r.year, row);
    }
    row.events += Number(r.events) || 0;
    row.deaths += Number(r.deaths) || 0;
    row.injured += Number(r.injured) || 0;
    row.affected += Number(r.affected) || 0;
    row.damage += Number(r.damage) || 0;
    if (r.south === "Yes") row.southEvents += Number(r.events) || 0;
  });
  return Array.from(map.values()).sort((a, b) => a.year - b.year);
}

export function getFiltered(
  records: DisasterRecord[],
  filters: Filters
): DisasterRecord[] {
  return records.filter(
    (r) =>
      (filters.state === "All" || r.state === filters.state) &&
      (filters.type === "All" || r.type === filters.type) &&
      (filters.year === "All" || String(r.year) === filters.year)
  );
}

export interface RiskRow extends GroupRow {
  riskScore: number;
}

export function computeRisk(g: GroupRow[]): RiskRow[] {
  const max = {
    events: Math.max(...g.map((x) => x.events), 1),
    deaths: Math.max(...g.map((x) => x.deaths), 1),
    affected: Math.max(...g.map((x) => x.affected), 1),
    damage: Math.max(...g.map((x) => x.damage), 1),
  };
  const rows: RiskRow[] = g.map((s) => ({
    ...s,
    riskScore: Math.round(
      100 *
        (0.25 * (s.events / max.events) +
          0.25 * (s.deaths / max.deaths) +
          0.25 * (s.affected / max.affected) +
          0.25 * (s.damage / max.damage))
    ),
  }));
  return rows.sort((a, b) => b.riskScore - a.riskScore);
}
