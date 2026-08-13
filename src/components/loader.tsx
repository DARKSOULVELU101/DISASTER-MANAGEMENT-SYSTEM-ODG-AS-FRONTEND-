"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GMark } from "@/components/brand/g-logo";

type LoaderStep = "g" | "word" | "tech" | "powered" | "shimmer" | "done";

const GENVOUCH = "GENVOUCH";
const TECHNOLOGIES = "TECHNOLOGIES";

const STEP_TIMES: Record<Exclude<LoaderStep, "done">, number> = {
  g: 0,
  word: 950,
  tech: 1600,
  powered: 2150,
  shimmer: 2600,
};

const START_EXIT = 3150;

function NetworkNodes({ className = "" }: { className?: string }) {
  const nodes = useMemo(
    () => [
      { x: 14, y: 30 },
      { x: 86, y: 22 },
      { x: 22, y: 74 },
      { x: 78, y: 68 },
      { x: 50, y: 8 },
      { x: 8, y: 50 },
      { x: 92, y: 50 },
      { x: 50, y: 92 },
    ],
    []
  );
  const links: [number, number][] = [
    [0, 1], [1, 4], [4, 2], [2, 3], [3, 1], [0, 5], [5, 4], [4, 6], [6, 3], [2, 7], [7, 0],
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      {links.map(([a, b], i) => (
        <motion.line
          key={`l-${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgba(198,162,75,0.18)"
          strokeWidth="0.35"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3 + i * 0.06, ease: "easeOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r="1.3"
          fill="rgba(217,190,119,0.7)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 1.6, 1], opacity: [0, 0.9, 0.35, 0.9] }}
          transition={{ duration: 3.8, delay: 0.4 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

function ParticleGlow() {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        angle: (i / 10) * Math.PI * 2 + i * 0.35,
        dist: 66 + (i % 4) * 13,
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-brand-400/70"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: [0, 1, 0],
            scale: [1, 1.8, 0.6],
          }}
          transition={{ duration: 1.8, delay: 0.4 + p.id * 0.07, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <motion.span
        className="absolute h-24 w-24 rounded-full bg-brand-400/20"
        style={{ filter: "blur(24px)" }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.25, 0.9], opacity: [0, 0.8, 0.55] }}
        transition={{ duration: 2.4, delay: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}

export function GenvouchLoader({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<LoaderStep>("g");

  useEffect(() => {
    if (reduceMotion) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const timers = (Object.keys(STEP_TIMES) as (keyof typeof STEP_TIMES)[]).map((s) =>
      setTimeout(() => setStep(s), STEP_TIMES[s])
    );
    const exit = setTimeout(() => setStep("done"), START_EXIT);
    const done = setTimeout(onComplete, START_EXIT + 700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exit);
      clearTimeout(done);
    };
  }, [reduceMotion, onComplete]);

  if (reduceMotion) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-4">
          <GMark size={72} glow />
          <div className="font-display text-2xl font-semibold tracking-tight text-ink">
            GENVOUCH
          </div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-brand-600">
            Technologies Pvt
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-hidden bg-ivory"
      exit={{
        y: "-100%",
        transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] },
      }}
      aria-hidden="true"
    >
      <div className="grid-paper absolute inset-0 opacity-50" />
      <div className="radial-warm absolute inset-0" />
      <NetworkNodes className="opacity-50" />

      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center px-6 text-center">
          <AnimatePresence mode="wait">
            {step === "g" && (
              <motion.div
                key="g"
                exit={{ opacity: 0, scale: 0.86, filter: "blur(4px)" }}
                transition={{ duration: 0.35 }}
                className="relative"
              >
                <ParticleGlow />
                <GMark size={104} animated glow />
              </motion.div>
            )}

            {(step === "word" ||
              step === "tech" ||
              step === "powered" ||
              step === "shimmer") && (
              <motion.div
                key="lockup"
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center"
              >
                <div className="relative">
                  {step === "shimmer" && (
                    <span
                      className="shimmer-sweep pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <GMark size={44} />
                    </motion.div>
                    <h1
                      className="font-display font-semibold tracking-tight text-ink"
                      style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
                    >
                      {GENVOUCH.split("").map((ch, i) => (
                        <motion.span
                          key={i}
                          className="inline-block"
                          initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            duration: 0.55,
                            delay: i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <span className="shimmer-text">{ch}</span>
                        </motion.span>
                      ))}
                    </h1>
                  </div>
                </div>

                <div
                  className="mt-3 font-sans font-medium text-brand-600"
                  style={{ fontSize: "clamp(0.72rem, 1.9vw, 0.95rem)", letterSpacing: "0.42em", marginLeft: "0.42em" }}
                >
                  {TECHNOLOGIES.split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.38, delay: i * 0.035, ease: "easeOut" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </div>

                <AnimatePresence>
                  {(step === "powered" || step === "shimmer") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="mt-6 flex items-center gap-2"
                    >
                      <span className="h-px w-6 bg-brand-300" />
                      <span className="text-[10px] uppercase tracking-[0.34em] text-muted">
                        Powered by Genvouch Technologies Pvt
                      </span>
                      <span className="h-px w-6 bg-brand-300" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-7 h-[3px] w-40 overflow-hidden rounded-full bg-brand-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-800 via-brand-400 to-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: step === "shimmer" ? "100%" : "62%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-brand-800 via-brand-400 to-accent"
        initial={{ opacity: 0 }}
        animate={step === "done" ? { opacity: 1 } : { opacity: 0.4 }}
        transition={{ duration: 0.45 }}
      />
    </motion.div>
  );
}
