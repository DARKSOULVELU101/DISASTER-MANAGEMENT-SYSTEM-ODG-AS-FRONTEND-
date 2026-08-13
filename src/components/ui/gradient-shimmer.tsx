"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GradientShimmerProps {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  animate?: boolean;
  delay?: number;
  className?: string;
}

/**
 * Animated gradient text used for hero titles, major KPIs and key headings.
 */
export function GradientShimmer({
  children,
  as: Tag = "span",
  animate = true,
  delay = 0,
  className = "",
}: GradientShimmerProps) {
  const classes = `shimmer-text ${className}`.trim();
  const content = <span className={classes}>{children}</span>;

  if (!animate) return <Tag className={className}>{content}</Tag>;

  return (
    <Tag className={`inline-block ${className}`.trim()}>
      <motion.span
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {content}
      </motion.span>
    </Tag>
  );
}

interface ShimmerSweepProps {
  className?: string;
  children: ReactNode;
}

/**
 * A sweeping light band across a surface (buttons, hero accents, cards).
 */
export function ShimmerSweep({ className = "", children }: ShimmerSweepProps) {
  return (
    <span className={`relative overflow-hidden ${className}`}>
      {children}
      <span className="shimmer-sweep pointer-events-none absolute inset-0" aria-hidden="true" />
    </span>
  );
}
