"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { SEED_TICKETS, formatHM } from "@/lib/tickets";
import { cn } from "@/lib/utils";

export function LiveTicker() {
  const tickets = SEED_TICKETS.slice(0, 4);
  const headBlock = SEED_TICKETS[0]?.blockNumber;

  return (
    <div className="border border-border-strong bg-paper-3 rounded-md overflow-hidden shadow-[0_14px_40px_-22px_rgba(26,23,19,0.18)]">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-paper-2/60">
        <div className="flex items-center gap-2.5">
          <motion.span
            className="relative inline-flex w-1.5 h-1.5 rounded-full bg-pass"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.65, 1, 0.65],
              boxShadow: [
                "0 0 0 rgba(76,106,47,0)",
                "0 0 8px rgba(76,106,47,0.9)",
                "0 0 0 rgba(76,106,47,0)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            live
          </span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          <span className="tabular-nums text-ink">{SEED_TICKETS.length}</span>{" "}
          sealed · on monad
        </div>
      </div>

      {/* list */}
      <div className="px-3 py-2 space-y-0.5">
        {tickets.map((t) => (
          <Link key={t.id} href={`/r/${t.id}`} className="block group">
            <div
              className={cn(
                "flex items-center gap-3 px-2 py-1 font-mono text-[12px] rounded-sm",
                "hover:bg-seal-bright/10 transition-colors",
              )}
            >
              <span className="text-muted tabular-nums w-7 text-[11px]">
                {t.id.padStart(3, "0")}
              </span>
              <span className="text-ink-dim flex-1 truncate group-hover:text-ink transition-colors">
                {t.title}
              </span>
              <span className="text-pass text-[12px]">✓</span>
              <span className="text-muted tabular-nums text-[11px] w-12 text-right">
                {t.sealed ? formatHM(t.sealed) : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* footer */}
      <div className="px-4 py-2 border-t border-border font-mono text-[10px] uppercase tracking-[0.22em] text-muted flex items-center justify-between">
        <span>
          monad testnet
          {headBlock ? ` · block ${headBlock.toLocaleString()}` : ""}
        </span>
        <Link
          href="/demo"
          className="text-seal hover:text-seal-bright transition-colors"
        >
          ↗ ledger
        </Link>
      </div>
    </div>
  );
}
