"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { IDEFrame } from "./ide-frame";
import type { Ticket } from "@/lib/types";
import { shortHash, formatHM } from "@/lib/tickets";

type TabKey = "live" | "inbox" | "ledger" | "report";

const tabs: { key: TabKey; label: string; num: string }[] = [
  { key: "live", num: "01", label: "live session" },
  { key: "inbox", num: "02", label: "ticket inbox" },
  { key: "ledger", num: "03", label: "monad ledger" },
  { key: "report", num: "04", label: "report" },
];

export function DemoDashboard({
  tickets,
  reportTicket,
}: {
  tickets: Ticket[];
  reportTicket: Ticket;
}) {
  const [active, setActive] = useState<TabKey>("live");
  const [selected, setSelected] = useState<Ticket>(reportTicket);

  function openReport(t: Ticket) {
    setSelected(t);
    setActive("report");
  }

  const counts = useMemo(
    () => ({
      all: tickets.length,
      sealed: tickets.filter((t) => t.status === "sealed").length,
      active: tickets.filter((t) => t.status === "verifying" || t.status === "open").length,
    }),
    [tickets]
  );

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-14 py-4 flex items-center justify-between bg-paper/75 backdrop-blur-md border-b border-border/70">
        <a
          href="/"
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] group"
        >
          <span className="text-muted group-hover:text-ink transition-colors">
            ←&nbsp;kairon
          </span>
          <span className="text-border-strong">/</span>
          <span className="text-ink">demo · dashboard</span>
        </a>
        <div className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pass animate-pulse" />
            {counts.active} active
          </span>
          <span>·</span>
          <span>
            <span className="text-seal">{counts.sealed}</span> sealed
          </span>
          <span>·</span>
          <span className="text-ink">{counts.all} total</span>
        </div>
      </header>

      {/* tab strip */}
      <div className="mt-16 md:mt-20 px-6 md:px-14 border-b border-border-strong">
        <div className="max-w-7xl mx-auto flex items-end gap-0 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              aria-pressed={active === t.key}
              className={cn(
                "relative px-5 md:px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] cursor-pointer transition-colors whitespace-nowrap",
                "focus:outline-none focus-visible:bg-paper-2/50",
                active === t.key ? "text-ink" : "text-muted hover:text-ink-dim"
              )}
            >
              <span className="flex items-center gap-3">
                <span className="tabular-nums text-[10px] text-muted">{t.num}</span>
                <span>{t.label}</span>
              </span>
              {active === t.key && (
                <motion.span
                  layoutId="demo-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-seal"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          ))}
          <span className="flex-1" />
        </div>
      </div>

      {/* tab content */}
      <div className="flex-1 px-6 md:px-14 py-10 md:py-14 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === "live" && <LiveSessionPanel />}
              {active === "inbox" && (
                <InboxPanel tickets={tickets} onOpen={openReport} />
              )}
              {active === "ledger" && <LedgerPanel tickets={tickets} />}
              {active === "report" && <ReportPanel ticket={selected} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────  LIVE SESSION  ────────────────── */

type LiveStep = { label: string; detail: string; ms: number };

const liveScript: LiveStep[] = [
  { label: "opened", detail: "ticket #044 · i18n hook extraction", ms: 900 },
  { label: "criteria proposed", detail: "3 checks from codebase scan", ms: 1400 },
  { label: "approved", detail: "by dev", ms: 800 },
  { label: "running", detail: "$ npm test -- i18n.test.ts", ms: 1300 },
  { label: "passed", detail: "✓ 18 passed (612ms)", ms: 900 },
  { label: "running", detail: "$ npm run build", ms: 1500 },
  { label: "passed", detail: "✓ built in 3.9s", ms: 900 },
  { label: "hashing", detail: "SHA-256 of outcome", ms: 800 },
  { label: "attesting", detail: "emitting to monad testnet", ms: 1100 },
  { label: "sealed", detail: "block 18,442,917 · tx 0x92c4…a18f", ms: 0 },
];

function LiveSessionPanel() {
  const [idx, setIdx] = useState(0);
  const [cycleId, setCycleId] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (idx >= liveScript.length - 1) {
      // loop after holding sealed for 5s
      const t = setTimeout(() => {
        setIdx(0);
        setCycleId((c) => c + 1);
      }, 5000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), liveScript[idx].ms);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-3">
          01 · live session
        </div>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-4">
          One ticket, <span className="italic text-ink-dim">sealing in real time.</span>
        </h2>
        <p className="font-mono text-sm text-ink-dim leading-relaxed">
          This is the protocol mid-execution. Each stage is a durable event —
          the dev sees it, the chain records it, the receipt persists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* live stream */}
        <div className="border border-border-strong bg-paper-2/40 rounded-md p-6 md:p-7 min-h-[420px]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-pass animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
              ticket #044
            </span>
            <span className="text-border-strong">·</span>
            <span className="font-mono text-[11px] text-muted truncate">
              i18n hook extraction
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              cycle {cycleId + 1}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {liveScript.slice(0, idx + 1).map((step, i) => {
              const isLast = i === idx;
              const isFinal = step.label === "sealed";
              return (
                <motion.div
                  key={`${cycleId}-${i}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-baseline gap-4 font-mono text-[13px]",
                    isFinal && "mt-2 pt-3 border-t border-border"
                  )}
                >
                  <span
                    className={cn(
                      "min-w-[120px] uppercase tracking-[0.14em] text-[11px]",
                      isFinal ? "text-seal font-semibold" : "text-muted"
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "flex-1",
                      isFinal ? "text-seal font-medium" : "text-ink-dim"
                    )}
                  >
                    {step.detail}
                  </span>
                  {isLast && !isFinal && !reduced && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-2 h-3.5 bg-fg-dim"
                      style={{ background: "var(--color-ink-dim)" }}
                    />
                  )}
                  {isFinal && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="relative inline-flex w-2.5 h-2.5 rounded-full bg-seal"
                    >
                      <span className="absolute inset-0 rounded-full bg-seal animate-ping opacity-50" />
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* side panel: progress */}
        <div className="flex flex-col gap-5">
          <div className="border border-border-strong bg-paper-2/40 rounded-md p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-4">
              progress
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink mb-2">
              {Math.min(idx + 1, liveScript.length)} / {liveScript.length}
            </div>
            <div className="h-px bg-border w-full overflow-hidden rounded-full">
              <motion.div
                animate={{
                  width: `${((idx + 1) / liveScript.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-seal"
                style={{ height: 1 }}
              />
            </div>
          </div>

          <div className="border border-border-strong bg-paper-2/40 rounded-md p-6 flex-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-4">
              receipt preview
            </div>
            <div className="font-mono text-[11px] space-y-2">
              <Row k="agent" v="claude-opus-4.6" />
              <Row k="criteria" v="3 checks · pending" />
              <Row
                k="proof"
                v={
                  idx >= liveScript.length - 2
                    ? "a3f4 9c8b 7e21 …"
                    : "— computing"
                }
              />
              <Row
                k="tx"
                v={
                  idx === liveScript.length - 1
                    ? "0x92c4 a18f …"
                    : "— awaiting"
                }
              />
              <Row
                k="block"
                v={
                  idx === liveScript.length - 1
                    ? "18,442,917"
                    : "—"
                }
                accent={idx === liveScript.length - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted uppercase tracking-[0.18em] text-[10px]">
        {k}
      </span>
      <span className={cn("tabular-nums", accent ? "text-seal" : "text-ink-dim")}>
        {v}
      </span>
    </div>
  );
}

/* ──────────────────  INBOX  ────────────────── */

function InboxPanel({
  tickets,
  onOpen,
}: {
  tickets: Ticket[];
  onOpen: (t: Ticket) => void;
}) {
  const sorted = [...tickets].sort((a, b) => b.opened.localeCompare(a.opened));

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-3">
          02 · ticket inbox
        </div>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-4">
          Every ticket, <span className="italic text-ink-dim">every receipt.</span>
        </h2>
        <p className="font-mono text-sm text-ink-dim leading-relaxed">
          Seeded from{" "}
          <span className="text-ink">data/seed-tickets.json</span>. Click any row
          to open its sealed report.
        </p>
      </div>

      <div className="border-y border-border">
        {sorted.map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => onOpen(t)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.42,
              delay: i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "group w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-[72px_1fr_140px_140px_28px] items-center gap-4 md:gap-6 px-4 md:px-5 py-5 border-b border-border last:border-b-0",
              "text-left hover:bg-paper-2/40 transition-colors",
              "focus:outline-none focus-visible:bg-paper-2/60"
            )}
          >
            {/* id */}
            <span className="font-mono tabular-nums text-muted text-[13px]">
              #{t.id}
            </span>

            {/* title + agent */}
            <span className="flex flex-col gap-1 min-w-0">
              <span className="font-serif text-xl md:text-2xl text-ink group-hover:text-seal transition-colors truncate">
                {t.title}
              </span>
              <span className="font-mono text-[11px] text-muted uppercase tracking-[0.14em]">
                {t.agent}
                {t.commit && (
                  <>
                    <span className="mx-2 text-border-strong">·</span>
                    commit {t.commit}
                  </>
                )}
              </span>
            </span>

            {/* status pill */}
            <span className="hidden md:inline-flex justify-start">
              <StatusPill status={t.status} />
            </span>

            {/* timestamp */}
            <span className="hidden md:inline font-mono text-[11px] text-muted tabular-nums">
              {t.sealed ? formatHM(t.sealed) : formatHM(t.opened)}
            </span>

            {/* arrow */}
            <span className="font-mono text-muted group-hover:text-seal group-hover:translate-x-0.5 transition-all">
              →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Ticket["status"] }) {
  const map: Record<Ticket["status"], { bg: string; fg: string; dot: string }> = {
    sealed: { bg: "bg-pass/10", fg: "text-pass", dot: "bg-pass" },
    verifying: { bg: "bg-seal/10", fg: "text-seal", dot: "bg-seal" },
    open: { bg: "bg-border/30", fg: "text-muted", dot: "bg-muted" },
    failed: { bg: "bg-fail/10", fg: "text-fail", dot: "bg-fail" },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] rounded-full border border-border",
        s.bg,
        s.fg
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          s.dot,
          status === "verifying" && "animate-pulse"
        )}
      />
      {status}
    </span>
  );
}

/* ──────────────────  LEDGER  ────────────────── */

function LedgerPanel({ tickets }: { tickets: Ticket[] }) {
  const sealed = tickets.filter((t) => t.status === "sealed");
  const pending = tickets.filter((t) => t.status !== "sealed");

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-3">
          03 · monad ledger
        </div>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-4">
          The chain is the witness.
        </h2>
        <p className="font-mono text-sm text-ink-dim leading-relaxed">
          Every seal emits a single event on Monad testnet. Row links open the
          explorer; receipts are independently verifiable.
        </p>
      </div>

      {/* header */}
      <div className="grid grid-cols-[80px_1fr_160px_160px_100px_40px] gap-5 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted border-y border-border">
        <span>ticket</span>
        <span>title</span>
        <span>proof</span>
        <span>tx hash</span>
        <span className="text-right">block</span>
        <span />
      </div>

      {/* sealed rows */}
      {sealed.length === 0 ? (
        <EmptyLedger count={pending.length} />
      ) : (
        sealed.map((t, i) => (
          <motion.a
            key={t.id}
            href={t.explorerUrl || "#"}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="group grid grid-cols-[80px_1fr_160px_160px_100px_40px] gap-5 px-5 py-4 items-center border-b border-border hover:bg-paper-2/50 transition-colors font-mono text-[12px] tabular-nums"
          >
            <span className="text-muted">#{t.id}</span>
            <span className="text-ink group-hover:text-seal transition-colors truncate">
              {t.title}
            </span>
            <span className="text-ink-dim">{shortHash(t.proofHash, 2, 4)}</span>
            <span className="text-ink-dim">{shortHash(t.txHash, 2, 4)}</span>
            <span className="text-ink text-right">
              {t.blockNumber?.toLocaleString() || "—"}
            </span>
            <span className="text-muted group-hover:text-seal group-hover:translate-x-0.5 transition-all text-right">
              ↗
            </span>
          </motion.a>
        ))
      )}

      {/* pending section */}
      {pending.length > 0 && (
        <div className="mt-16">
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-4">
            <span>pending attestation</span>
            <span className="flex-1 h-px bg-border" />
            <span className="text-seal">{pending.length}</span>
          </div>
          <div className="border-y border-border">
            {pending.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[80px_1fr_auto] gap-5 px-5 py-3 border-b border-border last:border-b-0 font-mono text-[12px]"
              >
                <span className="text-muted">#{t.id}</span>
                <span className="text-ink-dim truncate">{t.title}</span>
                <StatusPill status={t.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyLedger({ count }: { count: number }) {
  return (
    <div className="py-16 px-5 text-center">
      <div className="font-serif italic text-2xl text-ink-dim mb-3">
        No seals on chain yet.
      </div>
      <div className="font-mono text-[13px] text-muted">
        {count} ticket{count === 1 ? "" : "s"} awaiting attestation.
      </div>
    </div>
  );
}

/* ──────────────────  REPORT  ────────────────── */

function ReportPanel({ ticket }: { ticket: Ticket }) {
  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-3">
          04 · report
        </div>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-4">
          The shareable receipt.
        </h2>
        <p className="font-mono text-sm text-ink-dim leading-relaxed">
          Click any ticket from the inbox to open its full report here. Same
          frame that ships to clients — permalink at{" "}
          <span className="text-ink">/r/{ticket.id}</span>.
        </p>
      </div>

      <IDEFrame ticket={ticket} />

      <div className="mt-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex-wrap">
        <span>open permalink</span>
        <a
          href={`/r/${ticket.id}`}
          className="text-seal hover:text-ink transition-colors border-b border-seal hover:border-ink pb-0.5"
        >
          /r/{ticket.id} ↗
        </a>
        <span className="flex-1 h-px bg-border" />
        <span>or replay locally</span>
        <code className="text-ink-dim bg-paper-2/60 px-2 py-0.5 border border-border">
          kairon replay {ticket.id}
        </code>
      </div>
    </div>
  );
}
