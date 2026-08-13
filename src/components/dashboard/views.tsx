"use client";

import { motion } from "motion/react";
import type { DashboardData, DisasterRecord } from "@/lib/disaster-data";
import {
  byYear,
  compact,
  computeRisk,
  crore,
  fmt,
  group,
  sum,
} from "@/lib/disaster-data";
import {
  AppBarChart,
  AppDoughnutChart,
  AppLineChart,
  AppScatterChart,
} from "@/components/dashboard/charts";
import {
  Card,
  CardTitle,
  DataTable,
  InsightRow,
  KpiCard,
  ProgressRow,
} from "@/components/dashboard/ui";
import { GradientShimmer } from "@/components/ui/gradient-shimmer";

function ViewKpis({ records }: { records: DisasterRecord[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Events" value={sum(records, "events")} format={(v) => fmt(Math.round(v))} sub="Total disaster events" delay={0} />
      <KpiCard label="Deaths" value={sum(records, "deaths")} format={(v) => fmt(Math.round(v))} sub="Reported mortality" delay={0.06} />
      <KpiCard label="Affected" value={sum(records, "affected")} format={(v) => compact(Math.round(v))} sub="People affected" delay={0.12} />
      <KpiCard label="Damage" value={sum(records, "damage")} format={(v) => crore(Math.round(v))} sub="Damage in crore INR" delay={0.18} />
    </div>
  );
}

function ViewHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h2 className="font-display text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.75rem]">
        <GradientShimmer>{title}</GradientShimmer>
      </h2>
      <p className="max-w-[65ch] text-[13.5px] text-muted">{subtitle}</p>
    </div>
  );
}

export function OverviewView({ data }: { data: DashboardData }) {
  const records = data.records;
  const topStates = data.topStates.damage.slice(0, 8);
  const years = data.years;
  return (
    <div>
      <ViewHeading
        title="Executive Overview"
        subtitle="India Disaster Intelligence Dashboard — an OGD dataset transformed into a premium analytics experience."
      />
      <ViewKpis records={records} />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                Genvouch Intelligence Console
              </p>
              <h3 className="mt-3 font-display text-[1.5rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.8rem]">
                India Disaster{" "}
                <span className="shimmer-text">Intelligence</span> Dashboard
              </h3>
              <p className="mt-3 max-w-[56ch] text-[14px] leading-relaxed text-muted">
                A production-grade frontend that turns the open government disaster
                dataset into a Power BI-class analytics platform — with filters,
                KPI cards, trend charts, state ranking, South India focus, and raw
                data exploration.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                `${data.totals.india.states} States`,
                `${data.totals.india.records} Records`,
                "2014–2023 Trend",
                "Open Govt Data",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-sm border border-brand-400/40 bg-ivory-light px-3 py-1 text-[11.5px] font-medium text-brand-800"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle title="Key Insights" tag="Auto" />
          <div className="space-y-2.5">
            {data.insights.map((i, idx) => (
              <InsightRow key={i.title} title={i.title} text={i.text} delay={0.05 * idx} />
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle title="Top States by Damage" />
          <AppBarChart
            data={topStates}
            dataKey="damage"
            labels={(d) => String(d.state)}
            unit="Cr"
          />
        </Card>
        <Card>
          <CardTitle title="Yearly Damage Trend" />
          <AppLineChart
            data={years}
            dataKey="damage"
            labels={(d) => String(d.year)}
            unit="Cr"
          />
        </Card>
      </div>
    </div>
  );
}

export function StateView({ records }: { records: DisasterRecord[] }) {
  const g = group(records, "state").sort((a, b) => b.damage - a.damage);
  const byEvents = [...g].sort((a, b) => b.events - a.events);
  const tableRows = g.map((r) => ({
    name: r.name,
    events: r.events,
    deaths: r.deaths,
    affected: r.affected,
    homes: r.homes,
    damage: r.damage,
  }));
  return (
    <div>
      <ViewHeading
        title="State Performance"
        subtitle="Compare how states rank across damage, events, and human impact within the current filter."
      />
      <ViewKpis records={records} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle title="State Damage Ranking" tag="Top 12" />
          <AppBarChart
            data={g.slice(0, 12)}
            dataKey="damage"
            labels={(d) => String(d.name)}
            unit="Cr"
            height={320}
          />
        </Card>
        <Card>
          <CardTitle title="State Event Ranking" tag="Top 12" />
          <AppBarChart
            data={byEvents.slice(0, 12)}
            dataKey="events"
            labels={(d) => String(d.name)}
            height={320}
            color="#16304F"
          />
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardTitle title="State Summary Table" tag={`${g.length} states`} />
          <DataTable
            rows={tableRows}
            cols={["name", "events", "deaths", "affected", "homes", "damage"]}
          />
        </Card>
      </div>
    </div>
  );
}

export function TypesView({ records }: { records: DisasterRecord[] }) {
  const g = group(records, "type").sort((a, b) => b.events - a.events);
  const maxDamage = Math.max(...g.map((y) => y.damage), 1);
  return (
    <div>
      <ViewHeading
        title="Disaster Type Analysis"
        subtitle="Understand the composition of events, economic damage, and mortality across disaster categories."
      />
      <ViewKpis records={records} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardTitle title="Events by Type" />
          <AppDoughnutChart
            data={g}
            dataKey="events"
            labelKey="name"
            height={280}
          />
        </Card>
        <Card>
          <CardTitle title="Damage by Type" />
          <AppBarChart
            data={g}
            dataKey="damage"
            labels={(d) => String(d.name)}
            unit="Cr"
            height={280}
          />
        </Card>
        <Card>
          <CardTitle title="Deaths by Type" />
          <AppBarChart
            data={g}
            dataKey="deaths"
            labels={(d) => String(d.name)}
            height={280}
            color="#1E3E63"
          />
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardTitle title="Type Insights" />
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {g.map((x, i) => (
              <ProgressRow
                key={x.name}
                name={x.name}
                label={crore(x.damage)}
                value={x.damage}
                max={maxDamage}
                delay={0.05 * i}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function YearlyView({ records }: { records: DisasterRecord[] }) {
  const y = byYear(records);
  return (
    <div>
      <ViewHeading
        title="Yearly Trend"
        subtitle="Follow events, people affected, mortality, and economic damage year over year from 2014 to 2023."
      />
      <ViewKpis records={records} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle title="Total Events by Year" />
          <AppLineChart data={y} dataKey="events" labels={(d) => String(d.year)} />
        </Card>
        <Card>
          <CardTitle title="People Affected Trend" />
          <AppLineChart data={y} dataKey="affected" labels={(d) => String(d.year)} />
        </Card>
        <Card>
          <CardTitle title="Deaths Trend" />
          <AppLineChart data={y} dataKey="deaths" labels={(d) => String(d.year)} />
        </Card>
        <Card>
          <CardTitle title="Damage Trend" />
          <AppLineChart data={y} dataKey="damage" labels={(d) => String(d.year)} unit="Cr" />
        </Card>
      </div>
    </div>
  );
}

export function SouthView({ records }: { records: DisasterRecord[] }) {
  const southRecords = records.filter((r) => r.south === "Yes");
  const st = group(southRecords, "state");
  const ty = group(southRecords, "type");
  return (
    <div>
      <ViewHeading
        title="South India Focus"
        subtitle="A dedicated lens on the five southern states — Kerala, Tamil Nadu, Andhra Pradesh, Karnataka, and Telangana."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Events" value={sum(southRecords, "events")} format={(v) => fmt(Math.round(v))} sub="South India events" delay={0} />
        <KpiCard label="Deaths" value={sum(southRecords, "deaths")} format={(v) => fmt(Math.round(v))} sub="Reported mortality" delay={0.06} />
        <KpiCard label="Affected" value={sum(southRecords, "affected")} format={(v) => compact(Math.round(v))} sub="People affected" delay={0.12} />
        <KpiCard label="Damage" value={sum(southRecords, "damage")} format={(v) => crore(Math.round(v))} sub="Damage in crore INR" delay={0.18} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle title="South India States by Damage" />
          <AppBarChart
            data={st}
            dataKey="damage"
            labels={(d) => String(d.name)}
            unit="Cr"
            height={300}
          />
        </Card>
        <Card>
          <CardTitle title="South Disaster Type Split" />
          <AppDoughnutChart data={ty} dataKey="events" labelKey="name" height={300} />
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardTitle title="South India Performance Cards" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {st.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-md border border-line bg-ivory-light p-4 transition-colors hover:border-brand-400/50 hover:bg-ivory-light"
              >
                <div className="text-[14px] font-semibold text-ink">{s.name}</div>
                <div className="mt-1 text-[12px] text-muted">
                  {fmt(s.events)} events • {crore(s.damage)}
                </div>
                  <div className="serif-num text-[1.4rem] font-semibold leading-none text-brand-700">
                    {compact(s.affected)}
                  </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                  people affected
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ImpactView({ records }: { records: DisasterRecord[] }) {
  const st = group(records, "state").sort((a, b) => b.affected - a.affected);
  const ty = group(records, "type").sort((a, b) => b.deaths - a.deaths);
  const maxAffected = st[0]?.affected ?? 1;
  return (
    <div>
      <ViewHeading
        title="Human Impact"
        subtitle="Where people are affected most and which disaster types claim the highest mortality."
      />
      <ViewKpis records={records} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle title="People Affected by State" tag="Top 12" />
          <AppBarChart
            data={st.slice(0, 12)}
            dataKey="affected"
            labels={(d) => String(d.name)}
            height={320}
            color="#16304F"
          />
        </Card>
        <Card>
          <CardTitle title="Deaths by Disaster Type" />
          <AppBarChart
            data={ty}
            dataKey="deaths"
            labels={(d) => String(d.name)}
            height={320}
            color="#1E3E63"
          />
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardTitle title="Highest Affected States" tag="Top 10" />
          {st.slice(0, 10).map((x, i) => (
            <ProgressRow
              key={x.name}
              name={x.name}
              label={compact(x.affected)}
              value={x.affected}
              max={maxAffected}
              delay={0.05 * i}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

export function DamageView({ records }: { records: DisasterRecord[] }) {
  const st = group(records, "state").sort((a, b) => b.damage - a.damage);
  const maxDamage = st[0]?.damage ?? 1;
  const scatterData = st.slice(0, 18).map((s) => ({
    name: s.name,
    homes: s.homes,
    damage: s.damage,
  }));
  return (
    <div>
      <ViewHeading
        title="Damage & Homes"
        subtitle="Economic damage against housing destruction — and how the two correlate across states."
      />
      <ViewKpis records={records} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle title="Homes Destroyed by State" tag="Top 12" />
          <AppBarChart
            data={st.slice(0, 12)}
            dataKey="homes"
            labels={(d) => String(d.name)}
            height={300}
            color="#1E3E63"
          />
        </Card>
        <Card>
          <CardTitle title="Damage vs Homes" />
          <AppScatterChart
            data={scatterData}
            xKey="homes"
            yKey="damage"
            xLabel="Homes Destroyed"
            yLabel="Damage"
            height={300}
          />
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardTitle title="Damage Ranking" tag="Top 12" />
          {st.slice(0, 12).map((x, i) => (
            <ProgressRow
              key={x.name}
              name={x.name}
              label={crore(x.damage)}
              value={x.damage}
              max={maxDamage}
              delay={0.05 * i}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

export function RiskView({ records }: { records: DisasterRecord[] }) {
  const g = computeRisk(group(records, "state"));
  return (
    <div>
      <ViewHeading
        title="Risk Score Matrix"
        subtitle="A normalized 0–100 blend of events, deaths, affected people, and economic damage per state."
      />
      <ViewKpis records={records} />
      <div className="mt-4">
        <Card>
          <CardTitle title="Composite Risk Score Matrix" tag="0–100" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-md border border-line bg-ivory-light p-4 transition-colors hover:border-brand-400/50 hover:bg-ivory-light"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[14px] font-semibold text-ink">{s.name}</div>
                  <div className="serif-num text-[1.4rem] font-semibold text-brand-700">
                    {s.riskScore}
                  </div>
                </div>
                <div className="mt-1 text-[12px] text-muted">
                  {fmt(s.events)} events • {crore(s.damage)}
                </div>
                <div className="mt-3">
                  <ProgressRow
                    name=""
                    label={`${s.riskScore}%`}
                    value={s.riskScore}
                    max={100}
                    delay={0.15 + i * 0.04}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-5 text-[12.5px] text-muted">
            Risk score is a normalized blend of events, deaths, affected people, and damage — re-computed live for the current filters.
          </p>
        </Card>
      </div>
    </div>
  );
}

export function RecordsView({ records }: { records: DisasterRecord[] }) {
  const cols = ["id", "state", "region", "type", "year", "events", "deaths", "injured", "affected", "homes", "damage", "south"];
  return (
    <div>
      <ViewHeading
        title="Raw Data Explorer"
        subtitle="Inspect the underlying records behind every chart — filtered by the same state, disaster, and year controls."
      />
      <ViewKpis records={records} />
      <div className="mt-4">
        <Card>
          <CardTitle title="Filtered Raw Records" tag={`${records.length} rows`} />
          <DataTable
            rows={records.slice(0, 250) as unknown as Record<string, unknown>[]}
            cols={cols}
          />
        </Card>
      </div>
    </div>
  );
}
