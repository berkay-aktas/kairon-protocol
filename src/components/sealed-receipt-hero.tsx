"use client";

import { motion, useReducedMotion } from "motion/react";
import { LANDING_TICKET_042, shortHash } from "@/lib/tickets";

const HALO_GRADIENT =
  "conic-gradient(from 0deg, rgba(195,156,88,0) 0deg, rgba(195,156,88,0.55) 45deg, rgba(138,110,62,0.25) 100deg, rgba(195,156,88,0) 170deg, rgba(195,156,88,0) 200deg, rgba(195,156,88,0.42) 270deg, rgba(138,110,62,0.18) 320deg, rgba(195,156,88,0) 360deg)";

export function SealedReceiptHero() {
  const reduced = useReducedMotion();

  const hashChunks = shortHash(LANDING_TICKET_042.proofHash, 8, 4)
    .replace(/…/g, "")
    .trim()
    .split(" ")
    .filter(Boolean);

  return (
    <div className="reveal-on-scroll dramatic relative inline-block">
      {/* halo layer */}
      <div className="absolute inset-[-50px] rounded-[1.5rem] overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute left-1/2 top-1/2 w-[160%] h-[160%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: HALO_GRADIENT }}
          animate={reduced ? { rotate: 0 } : { rotate: 360 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 18, ease: "linear", repeat: Infinity }
          }
        />
      </div>

      {/* receipt card */}
      <div className="relative z-10 w-[440px] lg:w-[480px] bg-paper border border-border-strong shadow-[0_28px_80px_-24px_rgba(26,23,19,0.25)] rounded-sm p-7 lg:p-8">
        {/* top row */}
        <div className="flex items-center gap-3 font-mono uppercase tracking-[0.22em] text-[10.5px] text-muted">
          <span className="relative inline-flex items-center justify-center w-5 h-5 border border-seal text-seal font-serif italic text-sm leading-none">
            k
          </span>
          <span className="text-ink">kairon</span>
          <span className="text-border-strong">/</span>
          <span>ticket</span>
          <span className="text-border-strong">/</span>
          <span className="text-ink">#042</span>
          <span className="flex-1" />
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-seal" />
            <span className="text-seal">sealed</span>
          </span>
        </div>

        {/* divider */}
        <div className="mt-5 h-px bg-border" />

        {/* title */}
        <h2 className="mt-5 font-serif text-[1.65rem] md:text-[1.9rem] leading-[1.1] tracking-[-0.01em] text-ink">
          {LANDING_TICKET_042.title}
        </h2>

        {/* hash section */}
        <div className="mt-7">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-muted">
            sha-256 ( ticket + criteria + outcome + commit )
          </div>
          <div className="mt-3 font-mono text-[1.05rem] tracking-[0.25em] text-ink">
            {hashChunks.map((chunk, i) => (
              <motion.span
                key={`${chunk}-${i}`}
                initial={
                  reduced
                    ? { opacity: 1, filter: "blur(0px)", y: 0, color: "var(--color-ink)" }
                    : {
                        opacity: 0,
                        filter: "blur(4px)",
                        y: 3,
                        color: "var(--color-seal-bright)",
                      }
                }
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  color: "var(--color-ink)",
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 0.5,
                        delay: 0.3 + i * 0.09,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                className="inline-block"
              >
                {chunk}
                {i < hashChunks.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </div>
        </div>

        {/* criteria strip */}
        <div className="mt-5 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-pass">
          <span>✓ 47</span>
          <span className="text-border-strong">·</span>
          <span>✓ 23</span>
          <span className="text-border-strong">·</span>
          <span>✓ build</span>
        </div>

        {/* divider */}
        <div className="mt-6 h-px bg-border" />

        {/* footer row */}
        <div className="mt-5 flex items-end justify-between gap-5">
          <div className="flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            <span>agent · claude-opus-4.6</span>
            <span>monad block · 18,442,903</span>
            <span>sealed · 2026-04-22 · 14:21 utc</span>
          </div>
          <motion.div
            initial={
              reduced
                ? { opacity: 1, y: 0, scale: 1, rotate: -4, filter: "blur(0px)" }
                : {
                    opacity: 0,
                    y: -14,
                    scale: 1.3,
                    rotate: -10,
                    filter: "blur(4px)",
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: -4,
              filter: "blur(0px)",
            }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.7, delay: 1.15, ease: [0.22, 1, 0.36, 1] }
            }
            className="font-serif italic text-[3rem] md:text-[3.4rem] leading-none text-seal tracking-[-0.02em]"
          >
            sealed
          </motion.div>
        </div>
      </div>
    </div>
  );
}
