"use client";

import { cn } from "@/lib/utils";
import { LiveTicker } from "@/components/live-ticker";

type Harm = {
  n: string;
  label: string;
  body: React.ReactNode;
  who: string;
};

const harms: Harm[] = [
  {
    n: "01",
    who: "the dev",
    label: "silent failure",
    body: (
      <>
        Agent says <Ink>done</Ink>. Code ships. Bug surfaces a week later.
        No one can point to when verification ran — or whether it ran at all.
      </>
    ),
  },
  {
    n: "02",
    who: "the reviewer",
    label: "review erosion",
    body: (
      <>
        PR description says <Ink>&ldquo;tests passed.&rdquo;</Ink> Which tests?
        When? With what expectations? Reviewers re-run or take it on faith.
        Review slows, trust decays.
      </>
    ),
  },
  {
    n: "03",
    who: "the system",
    label: "multi-agent drift",
    body: (
      <>
        Agent A says auth is <Ink>done</Ink>. Agent B builds on A. A was wrong.
        The drift compounds silently through the stack.
      </>
    ),
  },
  {
    n: "04",
    who: "the freelancer",
    label: "freelance collapse",
    body: (
      <>
        Delivered with Claude. Client asks for proof. There is none — only
        chat history that expired. Pricing falls because claims are cheap.
      </>
    ),
  },
  {
    n: "05",
    who: "the manager",
    label: "ROI fog",
    body: (
      <>
        Team spends <Ink>$8K/mo</Ink> on AI. Manager asks what actually shipped.
        There is no report — only invoices and vibes.
      </>
    ),
  },
];

type Existing = {
  name: string;
  gap: string;
  note: string;
};

const existing: Existing[] = [
  {
    name: "CI/CD",
    gap: "Runs tests. No ticket-level binding of intent, criteria, outcome.",
    note: "pass ≠ shipped",
  },
  {
    name: "Claude Managed Agents",
    gap: "Self-evaluation. Vendor-locked to Anthropic. Research preview only.",
    note: "self-eval",
  },
  {
    name: "GitHub Issues / PRs",
    gap: "Linear narrative. No binding between what was asked and what was verified.",
    note: "prose only",
  },
  {
    name: "Dex & task trackers",
    gap: "Structures tickets. Outcome is just text typed by the dev.",
    note: "no verify",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative px-6 md:px-14 py-28 md:py-40 bg-paper-2/40 border-y border-border"
    >
      <div className="max-w-6xl mx-auto">
        {/* section header */}
        <div className="reveal-on-scroll mb-14 flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="tabular-nums text-fail">01</span>
          <span className="flex-1 h-px bg-border-strong" />
          <span>what&rsquo;s broken</span>
        </div>

        {/* headline */}
        <h2
          className="reveal-on-scroll dramatic font-serif text-[clamp(2rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.008em] max-w-3xl mb-7"
          style={{ transitionDelay: "120ms" }}
        >
          Every agent says{" "}
          <span className="italic text-fail">&ldquo;done.&rdquo;</span>
          <br />
          <span className="italic text-ink-dim">
            Nobody brings back receipts.
          </span>
        </h2>

        <p
          className="reveal-on-scroll font-mono text-sm md:text-[15px] leading-[1.65] text-ink-dim max-w-2xl mb-20"
          style={{ transitionDelay: "280ms" }}
        >
          By 2026, a typical dev day runs through three or four agents —
          Claude in the morning, Cursor at lunch, Codex in the evening.
          Every one returns <span className="text-ink">done</span>. None returns a receipt.
        </p>

        {/* the five harms */}
        <div className="mb-24">
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-4">
            <span>five ways this breaks</span>
            <span className="flex-1 h-px bg-border" />
            <span className="text-muted">for…</span>
          </div>
          <div className="reveal-on-scroll stagger divide-y divide-border border-y border-border">
            {harms.map((h) => (
              <div
                key={h.n}
                className={cn(
                  "reveal-child group grid grid-cols-1 md:grid-cols-[220px_1fr_140px] gap-x-6 gap-y-2",
                  "items-baseline py-6 hover:bg-paper/60 transition-colors"
                )}
              >
                <span className="font-mono text-[13px] text-ink uppercase tracking-[0.14em]">
                  {h.label}
                </span>
                <span className="font-mono text-[13.5px] text-ink-dim leading-[1.6] max-w-2xl">
                  {h.body}
                </span>
                <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-muted justify-self-end pt-1">
                  {h.who}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* existing approaches */}
        <div>
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-4">
            <span>existing approaches fall short</span>
            <span className="flex-1 h-px bg-border" />
          </div>
          <div className="stagger grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {existing.map((e) => (
              <div
                key={e.name}
                className="reveal-child bg-paper p-6 md:p-7 flex flex-col gap-3"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-2xl md:text-[1.65rem] text-ink leading-tight">
                    {e.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted shrink-0">
                    {e.note}
                  </span>
                </div>
                <div className="font-mono text-[13px] text-ink-dim leading-[1.55] flex gap-3">
                  <span className="text-fail shrink-0 pt-0.5">×</span>
                  <span>{e.gap}</span>
                </div>
              </div>
            ))}
          </div>

          {/* meanwhile · live ticker */}
          <div
            className="reveal-on-scroll mt-16 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-10 items-start"
            style={{ transitionDelay: "120ms" }}
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-4 flex items-center gap-3">
                <span>meanwhile</span>
                <span className="flex-1 h-px bg-border" />
              </div>
              <p className="font-serif italic text-xl md:text-2xl leading-[1.4] text-ink-dim max-w-md">
                Tickets are being sealed right now, on Monad testnet. Every one with a receipt.
              </p>
            </div>
            <LiveTicker />
          </div>

          {/* closing — short, mic-drop */}
          <div
            className="reveal-on-scroll mt-16 max-w-3xl"
            style={{ transitionDelay: "200ms" }}
          >
            <p className="font-serif italic text-2xl md:text-3xl leading-[1.3] text-ink-dim">
              The empty space has a shape.{" "}
              <span className="text-ink not-italic font-normal">Kairon fills it.</span>
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted flex items-center gap-3">
              <span className="flex-1 h-px bg-border" />
              <span className="text-seal">↓ one ticket · five receipts</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- inline emphasis helper --- */
function Ink({ children }: { children: React.ReactNode }) {
  return <span className="text-ink">{children}</span>;
}
