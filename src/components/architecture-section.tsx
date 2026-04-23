"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Layer = {
  role: string;
  name: string;
  ref: string;
  body: string;
};

const layers: Layer[] = [
  {
    role: "primary surface",
    name: "Claude Code skill",
    ref: "SKILL.md",
    body: "What the dev sees. Invoked by saying “seal this.” No install, no new UI, no context switch — the skill activates inside the agent you already use.",
  },
  {
    role: "reference implementation",
    name: "Kairon CLI",
    ref: "packages/cli",
    body: "TypeScript, agent-agnostic. open · verify · seal · report. Portable to Cursor, Codex, Gemini — any agent can adopt the same protocol.",
  },
  {
    role: "storage",
    name: "markdown + git",
    ref: "kairon/tickets/",
    body: "Each ticket is a plaintext file with frontmatter. Human-readable, diff-friendly, replayable months later. Your repository is the ledger.",
  },
  {
    role: "trust anchor",
    name: "Monad event emit",
    ref: "kairon.sol",
    body: "One event per seal. Tamper-evident, third-party verifiable, sub-second confirmation. Consumer-scale throughput — built for millions of attestations a day.",
  },
];

const verbs = ["invokes", "writes", "attests"];

type LifeState = {
  n: string;
  label: string;
  meta: string;
  sealed?: boolean;
};

const states: LifeState[] = [
  { n: "01", label: "opened", meta: "intent + context" },
  { n: "02", label: "criteria", meta: "proposed · approved" },
  { n: "03", label: "working", meta: "agent codes" },
  { n: "04", label: "verified", meta: "criteria pass" },
  { n: "05", label: "sealed", meta: "σ + commit + monad", sealed: true },
];

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative px-6 md:px-14 py-28 md:py-40"
    >
      <div className="max-w-6xl mx-auto">
        {/* section header */}
        <div className="reveal-on-scroll mb-14 flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="tabular-nums text-seal">03</span>
          <span className="flex-1 h-px bg-border-strong" />
          <span>architecture</span>
        </div>

        {/* headline */}
        <h2
          className="reveal-on-scroll dramatic font-serif text-[clamp(2rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.008em] max-w-3xl mb-7"
          style={{ transitionDelay: "120ms" }}
        >
          Not a new tool.
          <br />
          <span className="italic text-ink-dim">A new skill.</span>
        </h2>

        <p
          className="reveal-on-scroll font-mono text-sm md:text-[15px] leading-[1.65] text-ink-dim max-w-2xl mb-20"
          style={{ transitionDelay: "280ms" }}
        >
          Install once. Call it by saying{" "}
          <span className="text-ink">seal this</span>. The skill runs a
          TypeScript CLI, writes markdown tickets to git, and anchors
          tamper-evident hashes to Monad.{" "}
          <span className="text-ink">Four layers &mdash; one protocol.</span>
        </p>

        {/* four-layer stack */}
        <div className="max-w-3xl mx-auto mb-28">
          <div className="stagger flex flex-col items-stretch">
            {layers.map((l, i) => (
              <Fragment key={l.role}>
                <LayerCard layer={l} />
                {i < layers.length - 1 && <Connector verb={verbs[i]} />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* lifecycle */}
        <div
          className="reveal-on-scroll"
          style={{ transitionDelay: "240ms" }}
        >
          <div className="mb-10 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-4">
            <span>ticket lifecycle</span>
            <span className="flex-1 h-px bg-border" />
            <span>5 states &middot; 1 receipt</span>
          </div>
          <Lifecycle />
        </div>

        {/* closing */}
        <div className="reveal-on-scroll mt-24 max-w-3xl">
          <p className="font-serif italic text-2xl md:text-3xl leading-[1.3] text-ink-dim">
            Surfaces change.{" "}
            <span className="text-ink not-italic font-normal">
              Protocol doesn&rsquo;t.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function LayerCard({ layer }: { layer: Layer }) {
  return (
    <div
      className="reveal-child border border-border-strong bg-paper/80 backdrop-blur-sm p-6 md:p-7 hover:bg-paper transition-colors"
    >
      <div className="flex items-baseline justify-between mb-4 gap-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {layer.role}
        </span>
        <span className="font-mono text-[11.5px] text-ink-dim tracking-tight">
          {layer.ref}
        </span>
      </div>
      <div className="font-serif text-2xl md:text-[1.8rem] text-ink leading-tight mb-3">
        {layer.name}
      </div>
      <div className="font-mono text-[13px] text-ink-dim leading-[1.6] max-w-2xl">
        {layer.body}
      </div>
    </div>
  );
}

function Connector({ verb }: { verb: string }) {
  return (
    <div className="flex flex-col items-center py-1.5">
      <div className="w-px h-5 bg-border-strong" />
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted py-1.5">
        {verb} &darr;
      </div>
      <div className="w-px h-5 bg-border-strong" />
    </div>
  );
}

function Lifecycle() {
  return (
    <div className="relative">
      {/* desktop: horizontal ribbon */}
      <div className="hidden md:flex items-center gap-0 max-w-5xl mx-auto">
        {states.map((s, i) => (
          <Fragment key={s.n}>
            <LifecycleNode state={s} />
            {i < states.length - 1 && (
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.25 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "left center" }}
                className={cn(
                  "flex-1 h-px mx-2",
                  states[i + 1].sealed ? "bg-seal/70" : "bg-border-strong"
                )}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* mobile: vertical stack */}
      <div className="md:hidden flex flex-col items-start pl-2">
        {states.map((s, i) => (
          <Fragment key={s.n}>
            <LifecycleNode state={s} mobile />
            {i < states.length - 1 && (
              <div
                className={cn(
                  "w-px h-6 ml-[5px] my-1",
                  states[i + 1].sealed ? "bg-seal/70" : "bg-border-strong"
                )}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function LifecycleNode({
  state,
  mobile,
}: {
  state: LifeState;
  mobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center",
        mobile ? "flex-row gap-4" : "flex-col gap-3 min-w-[96px]"
      )}
    >
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative block rounded-full border shrink-0",
          state.sealed
            ? "w-3.5 h-3.5 bg-seal border-seal"
            : "w-3 h-3 bg-paper border-border-strong"
        )}
      >
        {state.sealed && (
          <span className="absolute inset-0 rounded-full bg-seal animate-ping opacity-40" />
        )}
      </motion.span>
      <div
        className={cn(
          "flex flex-col gap-1",
          mobile ? "items-start" : "items-center text-center"
        )}
      >
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.18em]",
            state.sealed ? "text-seal font-semibold" : "text-ink"
          )}
        >
          {state.label}
        </span>
        <span className="font-mono text-[10px] text-muted whitespace-nowrap">
          {state.meta}
        </span>
      </div>
    </div>
  );
}
