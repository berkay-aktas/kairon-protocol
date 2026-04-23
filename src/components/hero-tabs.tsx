"use client";

import { motion } from "motion/react";
import { FallingTickets } from "./falling-tickets";
import { SealedReceiptHero } from "./sealed-receipt-hero";

export function HeroTabs() {
  return (
    <section
      id="hero"
      className="hero-glow relative min-h-screen flex flex-col justify-center overflow-hidden pt-24"
    >
      {/* atmospheric paper glow — warm cinematic depth behind hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1100px] overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[120px] h-[640px] w-[640px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "rgba(138,110,62,0.10)" }}
        />
        <div
          className="absolute left-[5%] top-[420px] h-[480px] w-[480px] rounded-full blur-[140px]"
          style={{ background: "rgba(195,156,88,0.07)" }}
        />
        <div
          className="absolute right-[5%] top-[300px] h-[520px] w-[520px] rounded-full blur-[140px]"
          style={{ background: "rgba(62,56,48,0.05)" }}
        />
      </div>

      <FallingTickets />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-14 py-12">
        {/* top meta */}
        <div
          className="reveal-on-scroll flex items-center gap-3 mb-12 font-mono text-[11px] uppercase tracking-[0.22em] text-muted"
          style={{ transitionDelay: "0ms" }}
        >
          <motion.span
            className="inline-flex w-1.5 h-1.5 rounded-full bg-seal"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <span className="text-ink-dim">kairon</span>
          <span className="text-border-strong">/</span>
          <span>v0.3</span>
          <span className="text-border-strong">/</span>
          <span>attestation protocol</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
          {/* Copy column */}
          <div>
            {/* THE HEADLINE — approved hero copy (option B) */}
            <h1
              className="reveal-on-scroll dramatic font-serif text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.02] tracking-[-0.01em] max-w-xl mb-7"
              style={{ transitionDelay: "100ms" }}
            >
              Every &ldquo;<span className="italic">done</span>&rdquo; is a claim.
              <br />
              <span className="italic text-ink-dim">Kairon makes it evidence.</span>
            </h1>

            {/* positioning line */}
            <p
              className="reveal-on-scroll text-muted text-base md:text-lg leading-[1.5] max-w-lg font-mono"
              style={{ transitionDelay: "280ms" }}
            >
              An attestation protocol for AI coding agents —{" "}
              <span className="text-ink-dim">agent-agnostic</span>,{" "}
              <span className="text-ink-dim">anchored on Monad</span>.
            </p>

            <div
              className="reveal-on-scroll mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-3"
              style={{ transitionDelay: "420ms" }}
            >
              <span className="text-seal">↓</span>
              <span>one ticket · sealed right</span>
            </div>
          </div>

          {/* Receipt column */}
          <div
            className="reveal-on-scroll flex lg:justify-end"
            style={{ transitionDelay: "200ms" }}
          >
            <SealedReceiptHero />
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div
        className="reveal-on-scroll absolute bottom-14 left-1/2 -translate-x-1/2 z-10 font-mono text-[10px] uppercase tracking-[0.35em] text-muted flex flex-col items-center gap-2"
        style={{ transitionDelay: "900ms" }}
      >
        <span>scroll · ticket</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-7 bg-border-strong"
        />
      </div>
    </section>
  );
}
