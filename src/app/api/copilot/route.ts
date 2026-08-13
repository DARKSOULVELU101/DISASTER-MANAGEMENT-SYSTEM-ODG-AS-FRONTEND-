import { NextResponse } from "next/server";

const MODEL = "gemini-2.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  let body: { question?: string; context?: string; history?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { question, context = "", history = "" } = body;
  if (!question?.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json(
      {
        answer: localFallback(question, context),
        note: "Genvouch Copilot is running in offline mode (no API key configured).",
      },
      { status: 200 }
    );
  }

  const systemText = [
    "You are Genvouch Copilot, a precise AI assistant inside the GENVOUCH India Disaster Intelligence console.",
    "Answer questions about events, deaths, affected people, homes destroyed, and damage in crore INR.",
    "Prefer concise, actionable answers in Indian English with ₹ values and crore/lakh units.",
    "State clearly when a number comes from the dashboard data. Never invent statistics outside the provided context.",
  ].join(" ");

  const prompt = [
    `Dashboard data context (JSON):\n${context.slice(0, 12000)}`,
    history ? `\nRecent chat:\n${history.slice(-2500)}` : "",
    `\nUser question: ${question}`,
    "\nAnswer as Genvouch Copilot using the dashboard data.",
  ].join("");

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 800 },
      }),
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message || `HTTP ${res.status}`);
    }
    const text = json?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || "")
      .join("\n")
      .trim();
    if (!text) throw new Error("No response text returned");

    return NextResponse.json({ answer: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        answer:
          localFallback(question, context) +
          `\n\nNote: Gemini API request failed (${message}). Showing a local dashboard answer.`,
        note: "Gemini unavailable; local fallback used.",
      },
      { status: 200 }
    );
  }
}

function localFallback(question: string, context: string): string {
  const q = question.toLowerCase();
  let totals: Record<string, number> = {};
  try {
    const parsed = JSON.parse(context);
    totals = parsed.totals ?? {};
  } catch {
    // ignore malformed context
  }
  const num = (v: number | undefined) => (v ?? 0).toLocaleString("en-IN");
  const short = (v: number | undefined) => {
    const n = v ?? 0;
    if (n >= 1e7) return (n / 1e7).toFixed(1) + " Cr";
    if (n >= 1e5) return (n / 1e5).toFixed(1) + " L";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + " K";
    return num(n);
  };

  if (q.includes("damage")) {
    return `Based on the loaded dashboard data, total filtered damage is ₹ ${num(totals.damage)} Cr. Ask me for the top state by damage for a state-level view.`;
  }
  if (q.includes("death")) {
    return `Total filtered deaths are ${num(totals.deaths)}. I can break this down by disaster type if you like.`;
  }
  if (q.includes("south")) {
    return `South India is part of the current filter context. Ask me for the South India Focus view for a dedicated breakdown across its states and disaster types.`;
  }
  if (q.includes("year") || q.includes("trend")) {
    return `Trend summary: the current filter shows ${num(totals.events)} events and ₹ ${num(totals.damage)} Cr damage in total. Open the Yearly Trend view to see the 2014–2023 movement.`;
  }
  return `Dashboard summary for the current filters: ${num(totals.events)} events, ${num(totals.deaths)} deaths, ${short(totals.affected)} people affected, ${num(totals.homes)} homes destroyed, and ₹ ${num(totals.damage)} Cr damage. Ask about top states, disaster types, South India, yearly trends, or raw records.`;
}
