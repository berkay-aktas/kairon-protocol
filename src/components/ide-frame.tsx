"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Ticket, CriteriaItem, OutcomeLine } from "@/lib/types";
import { DEFAULT_TICKET, formatDateShort, shortHash } from "@/lib/tickets";

type TabKey = "ticket" | "criteria" | "outcome" | "proof" | "onchain";

function tabFiles(ticket: Ticket): { key: TabKey; file: string; color: string }[] {
  return [
    { key: "ticket", file: `ticket-${ticket.id}.md`, color: "#4C6A2F" },
    { key: "criteria", file: "criteria.yaml", color: "#8A6E3E" },
    { key: "outcome", file: "outcome.log", color: "#6B655B" },
    { key: "proof", file: "proof.sha256", color: "#C39C58" },
    { key: "onchain", file: "onchain.tx", color: "#8B2C1C" },
  ];
}

export function IDEFrame({ ticket = DEFAULT_TICKET }: { ticket?: Ticket }) {
  const [active, setActive] = useState<TabKey>("ticket");
  const files = tabFiles(ticket);
  const sealedDate = ticket.sealed
    ? `${formatDateShort(ticket.sealed)} ${ticket.sealed.slice(11, 16)}`
    : ticket.status === "verifying"
    ? "verifying…"
    : "open";

  return (
    <>
      <div className="rounded-md border border-border-strong bg-paper-3 shadow-[0_18px_56px_-22px_rgba(26,23,19,0.22)] overflow-hidden">
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-paper-2/60">
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong/70" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            kairon · ~/tickets/{ticket.id}
          </span>
          <span className="flex-1" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {ticket.status === "sealed"
              ? `sealed · ${sealedDate}`
              : ticket.status === "verifying"
              ? "verifying…"
              : ticket.status}
          </span>
        </div>

        {/* tab strip */}
        <div className="flex items-stretch overflow-x-auto bg-paper-3/40 border-b border-border-strong">
          {files.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                aria-pressed={isActive}
                className={cn(
                  "group relative flex items-center gap-2.5 px-5 py-3 font-mono text-[12px] border-r border-border whitespace-nowrap transition-colors cursor-pointer",
                  "focus:outline-none focus-visible:bg-paper/80",
                  isActive
                    ? "bg-paper text-ink"
                    : "bg-transparent text-muted hover:text-ink-dim hover:bg-paper/40"
                )}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: t.color }}
                />
                <span className={cn(isActive && "font-medium")}>{t.file}</span>
                {isActive && (
                  <motion.span
                    layoutId="ide-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-[2px] bg-seal"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
          <div className="flex-1 border-b border-border-strong" />
        </div>

        {/* content */}
        <div className="relative bg-paper min-h-[500px] md:min-h-[540px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 md:p-10 font-mono text-[13px] md:text-sm leading-[1.7]"
            >
              {active === "ticket" && <TabTicket ticket={ticket} />}
              {active === "criteria" && <TabCriteria ticket={ticket} />}
              {active === "outcome" && <TabOutcome ticket={ticket} />}
              {active === "proof" && <TabProof ticket={ticket} />}
              {active === "onchain" && <TabOnchain ticket={ticket} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* status bar */}
        <div className="flex items-center gap-5 px-4 py-2 border-t border-border bg-paper-2/60 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                ticket.status === "sealed" && "bg-pass",
                ticket.status === "verifying" && "bg-seal animate-pulse",
                ticket.status === "open" && "bg-muted",
                ticket.status === "failed" && "bg-fail"
              )}
            />
            {ticket.status}
          </span>
          <span>agent · {ticket.agent}</span>
          {ticket.commit && <span>commit · {ticket.commit}</span>}
          <span className="flex-1" />
          {ticket.blockNumber && (
            <span className="text-seal">monad · {ticket.blockNumber.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* echo */}
      <div className="mt-5 font-mono text-[11px] tracking-wide text-muted flex items-center gap-3">
        <span>viewing</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.2 }}
            className="text-ink"
          >
            {files.find((f) => f.key === active)?.file}
          </motion.span>
        </AnimatePresence>
        <span className="flex-1 h-px bg-border" />
        <span className="text-muted">
          {files.findIndex((f) => f.key === active) + 1} / {files.length}
        </span>
      </div>
    </>
  );
}

/* ─────────────────  TAB CONTENTS  ───────────────── */

function TabTicket({ ticket }: { ticket: Ticket }) {
  return (
    <div className="space-y-1.5">
      <L>---</L>
      <Kv k="id" v={ticket.id} />
      <Kv k="title" v={ticket.title} serif />
      <Kv
        k="status"
        v={ticket.status}
        color={
          ticket.status === "sealed"
            ? "seal"
            : ticket.status === "verifying"
            ? "pass"
            : undefined
        }
      />
      <Kv k="agent" v={ticket.agent} />
      <Kv k="opened" v={ticket.opened} />
      {ticket.sealed && <Kv k="sealed" v={ticket.sealed} />}
      {ticket.commit && <Kv k="commit" v={ticket.commit} />}
      <L>---</L>
      <L className="h-3" />
      <L className="text-ink text-[15px] mt-3">## Context</L>
      {(ticket.context || "").split("\n").map((line, i) => (
        <L key={i} className="text-ink-dim">{line || " "}</L>
      ))}
      <L className="h-3" />
      <L className="text-ink text-[15px]">## Acceptance</L>
      <L className="text-ink-dim">
        See <span className="text-seal">criteria.yaml</span>.
      </L>
      <L className="h-3" />
      <L className="text-ink text-[15px]">## Outcome</L>
      <L className="text-ink-dim">
        See <span className="text-seal">outcome.log</span> ·{" "}
        <span className="text-seal">proof.sha256</span> ·{" "}
        <span className="text-seal">onchain.tx</span>
      </L>
    </div>
  );
}

function TabCriteria({ ticket }: { ticket: Ticket }) {
  return (
    <div className="space-y-1.5">
      <L>
        <K>checks</K>:
      </L>
      {ticket.criteria.map((c, i) => (
        <div key={i} className="ml-4 space-y-1">
          <L>
            - <K>shell</K>: <V>{c.shell}</V>
          </L>
          <L className="ml-6">
            <K>expect_exit</K>: <N>{c.expect_exit}</N>
          </L>
          {c.timeout != null && (
            <L className="ml-6">
              <K>timeout</K>: <N>{c.timeout}</N>
            </L>
          )}
          {c.passed != null && (
            <L className="ml-6">
              <K>passed</K>:{" "}
              <span className={c.passed ? "text-pass" : "text-fail"}>
                {String(c.passed)}
              </span>
            </L>
          )}
        </div>
      ))}
      <L className="h-3" />
      <L>
        <K>seal</K>:
      </L>
      <L className="ml-4">
        <K>on_all_pass</K>: <V color="pass">true</V>
      </L>
      <L className="ml-4">
        <K>require_approval</K>: <V color="pass">true</V>
      </L>
      <L className="ml-4">
        <K>anchor</K>: <V>monad-testnet</V>
      </L>
      <L className="h-3" />
      <L className="text-muted italic font-serif text-[15px]">
        # proposed by agent · approved by dev · frozen at open
      </L>
    </div>
  );
}

function TabOutcome({ ticket }: { ticket: Ticket }) {
  const lines: OutcomeLine[] = ticket.outcome?.lines ?? [
    { text: "(no outcome yet — ticket is still verifying)", kind: "meta" },
  ];
  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-5">
          <span className="text-muted min-w-[68px] text-[11px] pt-0.5 tabular-nums">
            {line.t || ""}
          </span>
          <span
            className={cn(
              "flex-1 whitespace-pre",
              line.kind === "head" && "text-ink",
              line.kind === "pass" && "text-pass",
              line.kind === "fail" && "text-fail",
              line.kind === "meta" && "text-muted italic",
              line.kind === "dim" && "text-muted",
              line.kind === "final" && "text-seal font-medium"
            )}
          >
            {line.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function TabProof({ ticket }: { ticket: Ticket }) {
  const hash = ticket.proofHash;
  const [paint, setPaint] = useState(false);
  useEffect(() => {
    setPaint(true);
  }, [ticket.id]);

  if (!hash) {
    return (
      <div className="flex flex-col items-center text-center py-12 gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          σ pending — ticket is still verifying
        </div>
        <div className="font-serif italic text-lg text-ink-dim">
          No proof yet. The hash is minted on seal.
        </div>
      </div>
    );
  }

  const groups: string[] = [];
  for (let i = 0; i < hash.length; i += 4) groups.push(hash.slice(i, i + 4));

  return (
    <div className="flex flex-col items-center text-center py-4 md:py-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-8">
        σ = sha-256 ( τ ⊕ κ ⊕ outcome ⊕ commit )
      </div>

      <div className="grid grid-cols-4 gap-x-8 md:gap-x-14 gap-y-5 font-mono text-[2rem] md:text-[2.6rem] tracking-[0.12em] font-medium tabular-nums">
        {groups.map((g, gi) => (
          <div key={gi} className="flex gap-0.5">
            {g.split("").map((ch, ci) => {
              const idx = gi * 4 + ci;
              return (
                <span
                  key={idx}
                  className={paint ? "ink-bleed" : ""}
                  style={{
                    display: "inline-block",
                    opacity: paint ? undefined : 0,
                    animation: paint
                      ? `ink-bleed 700ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 30}ms both`
                      : undefined,
                    color: "var(--color-ink)",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        <span>binds</span>
        <span className="text-ink">τ ticket</span>
        <span>·</span>
        <span className="text-ink">κ criteria</span>
        <span>·</span>
        <span className="text-ink">outcome</span>
        <span>·</span>
        <span className="text-ink">commit</span>
      </div>
      <div className="mt-2 font-serif italic text-muted text-[15px]">
        one hash. tamper-evident. replayable.
      </div>
    </div>
  );
}

function TabOnchain({ ticket }: { ticket: Ticket }) {
  const reduced = useReducedMotion();
  if (ticket.status !== "sealed" || !ticket.txHash) {
    return (
      <div className="flex flex-col items-center text-center py-12 gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          no attestation yet
        </div>
        <div className="font-serif italic text-lg text-ink-dim">
          Monad anchor emits on seal.
        </div>
      </div>
    );
  }

  const rows: Array<[string, React.ReactNode]> = [
    ["network", <span key="n">monad · testnet</span>],
    [
      "block",
      <span key="b" className="text-ink">
        {ticket.blockNumber?.toLocaleString()}
      </span>,
    ],
    [
      "tx hash",
      <span key="h" className="text-ink">
        {shortHash(ticket.txHash, 3, 4)}
      </span>,
    ],
    ["from", <span key="f">{ticket.from || "—"}</span>],
    [
      "to",
      <span key="t" className="text-seal">
        {ticket.to || "—"}
      </span>,
    ],
    ["method", <span key="m">{ticket.method || "—"}</span>],
    [
      "data",
      <span key="d">{shortHash(ticket.proofHash, 3, 4)}</span>,
    ],
    [
      "status",
      <span key="s" className="text-pass">
        ✓ confirmed
      </span>,
    ],
    [
      "gas used",
      <span key="g">{ticket.gasUsed?.toLocaleString() || "—"}</span>,
    ],
    ["value", <span key="v">0 MON</span>],
  ];

  return (
    <div className="relative">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-6">
        ──────── monad testnet · receipt ────────
      </div>

      <div className="divide-y divide-border">
        {rows.map(([k, v], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: reduced ? 0 : i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-[120px_1fr] gap-5 py-2.5"
          >
            <span className="text-muted uppercase tracking-[0.18em] text-[11px] pt-0.5">
              {k}
            </span>
            <span className="text-ink-dim break-all">{v}</span>
          </motion.div>
        ))}
      </div>

      {/* SEALED STAMP */}
      <div className="absolute -right-2 top-2 md:right-6 md:top-6 pointer-events-none select-none">
        <div
          className="relative font-serif italic text-[60px] md:text-[92px] leading-none text-seal"
          style={{
            animation: reduced
              ? "none"
              : "stamp-drop 620ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both",
          }}
        >
          <span className="absolute inset-0 blur-xl opacity-25">sealed</span>
          <span
            className="relative block"
            style={{
              letterSpacing: "-0.04em",
              textShadow: "0 1px 0 rgba(26,23,19,0.08)",
            }}
          >
            sealed
          </span>
          <span
            className="absolute left-0 right-0 top-[40%] h-[3px] bg-seal"
            style={{ transform: "rotate(-6deg)" }}
          />
          <span
            className="absolute left-0 right-0 top-[60%] h-[1.5px] bg-seal/60"
            style={{ transform: "rotate(-6deg)" }}
          />
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-dashed border-border flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
        <span className="text-muted">view on</span>
        <a
          href={ticket.explorerUrl || "https://testnet.monadexplorer.com"}
          target="_blank"
          rel="noreferrer"
          className="text-seal hover:text-ink transition-colors border-b border-seal hover:border-ink pb-0.5"
        >
          monad testnet explorer ↗
        </a>
      </div>
    </div>
  );
}

/* ────────────────  PRIMITIVES  ─────────────── */

function L({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("leading-[1.7]", className)}>{children}</div>;
}
function Kv({
  k,
  v,
  color,
  serif,
}: {
  k: string;
  v: string;
  color?: "seal" | "pass";
  serif?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-muted">{k}:</span>
      <span
        className={cn(
          color === "seal" && "text-seal",
          color === "pass" && "text-pass",
          serif && "font-serif italic text-[15px]",
          !color && !serif && "text-ink"
        )}
      >
        {v}
      </span>
    </div>
  );
}
function K({ children }: { children: React.ReactNode }) {
  return <span className="text-ink">{children}</span>;
}
function V({ children, color }: { children: React.ReactNode; color?: "pass" }) {
  return <span className={cn(color === "pass" ? "text-pass" : "text-seal")}>{children}</span>;
}
function N({ children }: { children: React.ReactNode }) {
  return <span className="text-fail">{children}</span>;
}
