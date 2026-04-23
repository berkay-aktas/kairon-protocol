"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { SEED_TICKETS, formatHM } from "@/lib/tickets";
import type { Ticket } from "@/lib/types";

type BandTicket = {
  id: string;
  title: string;
  agent: string;
  sealedHM: string;
  sealedISO: string;
  proofHash: string;
  isReal: boolean;
};

const GENERATED_TITLES = [
  "websocket reconnect logic",
  "csv import validation",
  "email template refactor",
  "dashboard chart cache",
  "oauth refresh flow",
  "feature flag wiring",
  "queue retry policy",
  "image pipeline tuning",
  "metric exporter",
  "i18n hook",
  "search indexer",
  "billing math fix",
  "auth middleware",
  "pubsub fanout",
  "log shipper",
];

const GENERATED_AGENTS = [
  "claude-opus-4.7",
  "claude-sonnet-4-6",
  "cursor-composer",
];

/** 64-char lowercase hex string. SSR-safe: only call on client. */
function randomHex64(): string {
  let out = "";
  for (let i = 0; i < 64; i++) {
    out += Math.floor(Math.random() * 16).toString(16);
  }
  return out;
}

function realToBand(t: Ticket): BandTicket {
  return {
    id: t.id,
    title: t.title,
    agent: t.agent,
    sealedHM: t.sealed ? formatHM(t.sealed) : "—",
    sealedISO: t.sealed ?? "",
    proofHash: t.proofHash ?? "",
    isReal: true,
  };
}

/** Generate 15 demo tickets with ids 043–057, times spread 08:00→now. */
function buildGenerated(): BandTicket[] {
  const now = new Date();
  const start = new Date(now);
  start.setHours(8, 0, 0, 0);
  const startMs = start.getTime();
  const nowMs = now.getTime();
  const spanMs = Math.max(nowMs - startMs, 60_000);

  const out: BandTicket[] = [];
  for (let i = 0; i < 15; i++) {
    const idNum = 43 + i;
    const id = String(idNum).padStart(3, "0");
    const t = startMs + (spanMs * i) / 14;
    const jitter = Math.floor(Math.random() * 60_000);
    const iso = new Date(t + jitter).toISOString();
    out.push({
      id,
      title: GENERATED_TITLES[i] ?? "task",
      agent: GENERATED_AGENTS[i % GENERATED_AGENTS.length],
      sealedHM: iso.slice(11, 16),
      sealedISO: iso,
      proofHash: randomHex64(),
      isReal: false,
    });
  }
  return out;
}

export function MonadBand() {
  const realTickets = useMemo(
    () => SEED_TICKETS.filter((t) => t.status === "sealed").map(realToBand),
    []
  );

  const [generated, setGenerated] = useState<BandTicket[]>([]);

  useEffect(() => {
    setGenerated(buildGenerated());
  }, []);

  const tickets = useMemo(
    () => [...realTickets, ...generated],
    [realTickets, generated]
  );

  const totalCount = tickets.length;

  return (
    <section className="relative px-6 md:px-14 py-16 md:py-24 border-y border-border bg-paper-2/30">
      <div className="max-w-7xl mx-auto">
        <div
          className="reveal-on-scroll mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-muted"
          style={{ transitionDelay: "0ms" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-pass animate-pulse" />
            <span>MONAD · TESTNET · LIVE</span>
            <span>·</span>
            <span>
              BLOCK{" "}
              <span className="text-ink tabular-nums">27,268,620</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="tabular-nums">{totalCount} attestations</span>
            <span className="text-border-strong">·</span>
            <span className="text-muted/70">5 real · 15 sample</span>
          </div>
        </div>

        <div
          className="reveal-on-scroll grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3"
          style={{ transitionDelay: "120ms" }}
        >
          {tickets.map((t, i) => (
            <TicketCard
              ticket={t}
              isReal={t.isReal}
              index={i}
              key={t.id}
            />
          ))}
        </div>

        <div
          className="reveal-on-scroll mt-8 text-center font-mono text-[11px] text-muted italic"
          style={{ transitionDelay: "360ms" }}
        >
          hover to preview · click to open attestation
        </div>
      </div>
    </section>
  );
}

function TicketCard({
  ticket,
  isReal,
  index,
}: {
  ticket: BandTicket;
  isReal: boolean;
  index: number;
}) {
  const base =
    "border border-border bg-paper rounded-sm p-3 block";
  const realCls =
    "hover:border-seal hover:bg-paper-2 transition-all duration-200 cursor-pointer";
  const fakeCls = "opacity-70 cursor-not-allowed";

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tabular-nums text-muted">
          #{ticket.id}
        </span>
        <span className="text-seal text-[13px] leading-none">✓</span>
      </div>
      <div className="font-serif text-[14px] text-ink leading-[1.3] truncate mt-1.5">
        {ticket.title}
      </div>
      <div className="font-mono text-muted text-[10px] uppercase tracking-[0.22em] mt-2">
        sealed · {ticket.sealedHM}
      </div>
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: isReal ? 1 : 0.7, y: 0 },
    viewport: { once: true, margin: "-5% 0px" },
    transition: {
      duration: 0.4,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  if (isReal) {
    return (
      <motion.a
        href={`/r/${ticket.id}`}
        className={`${base} ${realCls}`}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      data-generated="true"
      title="demo sample — 5 real attestations on Monad"
      className={`${base} ${fakeCls}`}
      {...motionProps}
    >
      {inner}
    </motion.div>
  );
}
