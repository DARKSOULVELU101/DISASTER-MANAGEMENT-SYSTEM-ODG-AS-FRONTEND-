"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChatCircle, PaperPlaneTilt, Sparkle, X } from "@phosphor-icons/react";
import { GBadge } from "@/components/brand/g-logo";

interface CopilotMessage {
  role: "user" | "bot";
  text: string;
  thinking?: boolean;
}

const SUGGESTIONS = [
  "Which state has highest damage?",
  "Explain South India trends",
  "Top disaster type by deaths?",
];

export function Copilot({
  contextJson,
  activePage,
}: {
  contextJson: string;
  activePage: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: "bot",
      text: "Hi, I'm Genvouch Copilot. Ask me about events, deaths, damage, states, disaster types, or trends in this dashboard.",
    },
  ]);
  const [note, setNote] = useState("GENVOUCH AI · answers from live dashboard data");

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setBusy(true);
    setMessages((m) => [
      ...m,
      { role: "user", text: question },
      { role: "bot", text: "", thinking: true },
    ]);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: contextJson,
          activePage,
        }),
      });
      const data = await res.json();
      const answer: string = data.answer ?? "Sorry, I couldn't produce an answer.";
      const fallbackNote: string = data.note ?? "";
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.thinking) last.thinking = false;
        last.text = answer;
        return next;
      });
      setNote(
        fallbackNote
          ? `GENVOUCH AI · ${fallbackNote}`
          : "GENVOUCH AI · answered by Gemini"
      );
    } catch {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.thinking) last.thinking = false;
        last.text = "Connection failed. Please try again.";
        return next;
      });
      setNote("GENVOUCH AI · connection failed");
    } finally {
      setBusy(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input);
    setInput("");
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="plate-charcoal fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-md border border-brand-400/40 px-4 py-3 text-ivory-light shadow-[0_14px_40px_-10px_rgba(43,39,32,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open Genvouch Copilot"
      >
        {open ? <X size={18} weight="bold" /> : <ChatCircle size={18} weight="bold" />}
        <span className="text-[13px] font-semibold">Copilot</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="plate-charcoal fixed bottom-20 right-5 z-50 flex h-[540px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-md border border-charcoal-700 shadow-[0_24px_80px_-20px_rgba(18,16,12,0.7)]"
            role="dialog"
            aria-label="Genvouch Copilot chat"
          >
            <div className="flex items-center gap-3 border-b border-brand-400/20 bg-charcoal-800/70 px-4 py-3.5">
              <div className="relative">
                <GBadge size={34} />
                <motion.span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-charcoal-800 bg-brand-400 live-dot"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>
              <div className="flex-1">
                <div className="font-display text-[14px] font-semibold text-ivory-light">Genvouch Copilot</div>
                <div className="text-[11px] text-ivory-light/60">India Disaster Intelligence</div>
              </div>
              <Sparkle size={16} weight="duotone" className="text-brand-300" />
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-md px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-brand-400 text-charcoal"
                        : "rounded-bl-sm border border-brand-400/25 bg-charcoal-800 text-ivory-light"
                    }`}
                  >
                    {m.thinking ? (
                      <span className="flex items-center gap-1.5 text-ivory-light/60">
                        Analyzing dashboard data
                        <span className="flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="h-1.5 w-1.5 rounded-full bg-brand-400"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.18 }}
                            />
                          ))}
                        </span>
                      </span>
                    ) : (
                      m.text
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-brand-400/20 px-3 pb-3 pt-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    disabled={busy}
                    className="rounded-full border border-brand-400/40 bg-charcoal-800 px-2.5 py-1 text-[11.5px] font-medium text-brand-300 transition-colors hover:bg-charcoal-700 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={submit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about events, damage, trends..."
                  className="min-w-0 flex-1 rounded-md border border-brand-400/30 bg-charcoal-800 px-3.5 py-2.5 text-[13px] text-ivory-light outline-none transition-colors placeholder:text-ivory-light/40 focus:border-brand-400"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-400 text-charcoal transition-transform hover:scale-[1.04] active:scale-[0.96] disabled:opacity-40"
                  aria-label="Send"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                </button>
              </form>
              <div className="mt-2 text-center text-[10.5px] text-ivory-light/40">{note}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
