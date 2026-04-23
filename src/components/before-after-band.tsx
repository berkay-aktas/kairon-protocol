"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = "before" | "after";

export function BeforeAfterBand() {
  const [active, setActive] = useState<Tab>("before");

  return (
    <section className="relative px-6 md:px-14 py-20 md:py-28 border-y border-border bg-paper/60">
      <div className="max-w-6xl mx-auto">
        <div
          className="reveal-on-scroll mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-4"
          style={{ transitionDelay: "0ms" }}
        >
          <span>same ticket · two endings</span>
          <span className="flex-1 h-px bg-border" />
          <span>{active === "before" ? "without kairon" : "with kairon"}</span>
        </div>

        <div
          role="tablist"
          className="reveal-on-scroll flex items-end gap-0 border-b border-border-strong"
          style={{ transitionDelay: "120ms" }}
        >
          {(["before", "after"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={active === t}
              onClick={() => setActive(t)}
              className={cn(
                "relative px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors cursor-pointer",
                active === t ? "text-ink" : "text-muted hover:text-ink-dim"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-1 h-1 rounded-full transition-colors",
                    t === "before"
                      ? active === t
                        ? "bg-fail"
                        : "bg-border-strong"
                      : active === t
                      ? "bg-seal"
                      : "bg-border-strong"
                  )}
                />
                {t === "before" ? "without kairon" : "with kairon"}
              </span>
              {active === t && (
                <motion.span
                  layoutId="before-after-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-px bg-ink"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          ))}
        </div>

        <div
          className="reveal-on-scroll relative bg-paper-3 border border-t-0 border-border-strong p-6 md:p-7 min-h-[260px] shadow-[0_16px_48px_-22px_rgba(26,23,19,0.2)]"
          style={{ transitionDelay: "220ms" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {active === "before" ? <BeforePane key="before" /> : <AfterPane key="after" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function BeforePane() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="font-mono text-[13px] leading-[1.7]"
    >
      <div className="text-muted mb-4">$ claude · session #ad9f</div>
      <div className="space-y-1">
        <Line speaker="dev">refactor jwt → session cookie, keep tests green</Line>
        <Line speaker="agent">migrating auth middleware…</Line>
        <Line speaker="agent">updating session store…</Line>
        <Line speaker="agent">running tests…</Line>
        <Line speaker="agent" status="ok">✓ Done! Tests passed.</Line>
        <Line speaker="dev" dim>merging.</Line>
      </div>

      <div className="my-4 border-t border-dashed border-border-strong" />

      <div className="text-muted mb-2 flex items-center gap-3">
        <span className="text-fail">──── 7 days later ────</span>
      </div>
      <div className="space-y-1">
        <Line speaker="prod" status="fail">session invalidation failing in production.</Line>
        <Line speaker="review">PR said &ldquo;tests passed.&rdquo; which? when? by whom?</Line>
        <Line speaker="review" italic>no receipts.</Line>
      </div>
    </motion.div>
  );
}

function AfterPane() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="font-mono text-[13px] leading-[1.7]"
    >
      <div className="text-muted mb-4">$ kairon · ticket #042</div>
      <div className="space-y-1">
        <Line speaker="dev">seal this: jwt → session cookie</Line>
        <Line speaker="kairon">› opened ticket-042.md</Line>
        <Line speaker="kairon">› proposing criteria from codebase</Line>
        <Line speaker="dev" dim>approved 3/3</Line>
        <Line speaker="agent">migrating auth middleware…</Line>
        <Line speaker="kairon" status="ok">✓ 47 passed · auth.test.ts</Line>
        <Line speaker="kairon" status="ok">✓ 23 passed · session.test.ts</Line>
        <Line speaker="kairon" status="ok">✓ build · 4.2s</Line>
        <Line speaker="kairon" seal>σ = a3f4 9c8b 7e21 … e9b2</Line>
        <Line speaker="kairon" seal>✓ sealed · monad block 18,442,903</Line>
      </div>

      <div className="my-4 border-t border-dashed border-border-strong" />

      <div className="text-muted mb-2 flex items-center gap-3">
        <span className="text-pass">──── 7 days later ────</span>
      </div>
      <div className="space-y-1">
        <Line speaker="review">$ kairon replay 042</Line>
        <Line speaker="kairon" status="ok">✓ 47 · 23 · build · hash match</Line>
        <Line speaker="review" italic>receipts, on paper and onchain.</Line>
      </div>
    </motion.div>
  );
}

function Line({
  speaker,
  children,
  status,
  dim,
  italic,
  seal,
}: {
  speaker: string;
  children: React.ReactNode;
  status?: "ok" | "fail";
  dim?: boolean;
  italic?: boolean;
  seal?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span
        className={cn(
          "text-muted min-w-[64px] uppercase tracking-[0.12em] text-[10.5px] pt-0.5",
          speaker === "prod" && "text-fail",
          seal && "text-seal"
        )}
      >
        {speaker}
      </span>
      <span
        className={cn(
          "flex-1",
          dim && "text-muted",
          italic && "italic text-ink-dim font-serif text-[15px]",
          status === "ok" && "text-pass",
          status === "fail" && "text-fail",
          seal && "text-seal"
        )}
      >
        {children}
      </span>
    </div>
  );
}
