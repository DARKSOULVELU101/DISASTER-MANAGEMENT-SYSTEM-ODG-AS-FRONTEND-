"use client";

import { motion } from "motion/react";

const GRADIENT_ID = "genvouch-g-gradient";

export const G_PATHS = {
  bowl: "M 77.6 73.1 A 36 36 0 1 0 77.6 26.9",
  bar: "M 77.6 26.9 L 55 26.9",
};

interface GMarkProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  animated?: boolean;
  glow?: boolean;
}

export function GMark({
  size = 40,
  className,
  strokeWidth = 9,
  animated = false,
  glow = false,
}: GMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="GENVOUCH"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C6A24B" />
          <stop offset="55%" stopColor="#D9BE77" />
          <stop offset="100%" stopColor="#8A6A23" />
        </linearGradient>
        {glow && (
          <filter id="genvouch-g-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      <g
        fill="none"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? "url(#genvouch-g-glow)" : undefined}
      >
        {animated ? (
          <>
            <motion.path
              d={G_PATHS.bowl}
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.path
              d={G_PATHS.bar}
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 1.05 }}
            />
          </>
        ) : (
          <>
            <path d={G_PATHS.bowl} />
            <path d={G_PATHS.bar} />
          </>
        )}
      </g>
    </svg>
  );
}

export function GBadge({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="GENVOUCH"
    >
      <defs>
        <linearGradient id="genvouch-g-badge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16304f" />
          <stop offset="100%" stopColor="#0a1a2f" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="9" fill={`url(#genvouch-g-badge)`} />
      <g
        fill="none"
        stroke="#D9BE77"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 37.2 35.1 A 17.3 17.3 0 1 0 37.2 12.9" />
        <path d="M 37.2 12.9 L 26.4 12.9" />
      </g>
    </svg>
  );
}

export function GWordmark({
  size = 24,
  className,
  light = false,
}: {
  size?: number;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <GBadge size={size} />
      <span
        className={`font-display font-semibold tracking-tight ${
          light ? "text-ivory-light" : "text-ink"
        }`}
        style={{ fontSize: size * 0.6, lineHeight: 1 }}
      >
        GENVOUCH
      </span>
    </div>
  );
}
