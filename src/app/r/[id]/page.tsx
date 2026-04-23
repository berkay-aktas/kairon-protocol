import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTicket, formatDateShort } from "@/lib/tickets";
import { IDEFrame } from "@/components/ide-frame";
import { cn } from "@/lib/utils";

type PageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { id } = await params;
  const t = getTicket(id);
  if (!t) {
    return { title: "Kairon — ticket not found" };
  }
  const statusPhrase =
    t.status === "sealed" ? "sealed receipt" : "in-flight ticket";
  return {
    title: `Kairon · ticket-${t.id} · ${t.status}`,
    description: `${t.title} — ${statusPhrase} on Monad testnet.`,
  };
}

export default async function ReportPage({ params }: PageParams) {
  const { id } = await params;
  const ticket = getTicket(id);
  if (!ticket) notFound();

  const sealedStamp =
    ticket.sealed &&
    `${formatDateShort(ticket.sealed)} · ${ticket.sealed.slice(11, 16)} UTC`;

  return (
    <div className="min-h-screen bg-paper">
      {/* minimal header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-14 py-4 flex items-center justify-between bg-paper/75 backdrop-blur-md border-b border-border/70">
        <a
          href="/"
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] group"
        >
          <span className="relative inline-flex items-center justify-center w-5 h-5 border border-seal text-seal font-serif italic text-sm leading-none">
            k
          </span>
          <span className="text-ink group-hover:text-seal transition-colors">
            kairon
          </span>
          <span className="text-border-strong">/</span>
          <span className="text-muted">ticket</span>
          <span className="text-border-strong">/</span>
          <span className="text-ink">#{ticket.id}</span>
        </a>
        <div className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <StatusBadge status={ticket.status} />
          {sealedStamp && <span>{sealedStamp}</span>}
          <a
            href="/demo"
            className="border-b border-muted hover:text-ink hover:border-ink transition-colors pb-0.5"
          >
            open demo
          </a>
        </div>
      </header>

      <main className="pt-24 md:pt-28 pb-40 px-6 md:px-14">
        <div className="max-w-6xl mx-auto">
          {/* header block */}
          <div className="mb-12 md:mb-16 pb-10 border-b border-border-strong">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              kairon · ticket · #{ticket.id}
            </div>
            <h1 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.008em] max-w-3xl mb-7">
              {ticket.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              <StatusBadge status={ticket.status} />
              <span>agent · {ticket.agent}</span>
              {ticket.commit && <span>commit · {ticket.commit}</span>}
              {sealedStamp && <span>sealed · {sealedStamp}</span>}
              {ticket.blockNumber && (
                <span className="text-seal">
                  monad block · {ticket.blockNumber.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <IDEFrame ticket={ticket} />

          {/* footer: replay + what-is */}
          <div className="mt-16 md:mt-20 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-16">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-4">
                replay this ticket
              </div>
              <pre className="font-mono text-[13px] md:text-sm bg-paper-2/60 border border-border-strong px-4 py-3 text-ink">
                $ kairon replay {ticket.id}
              </pre>
              <p className="mt-4 font-mono text-[13px] text-ink-dim leading-[1.6]">
                Same criteria, same inputs, same result — or the receipt is
                broken. Replay is deterministic by construction.
              </p>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-4">
                what is kairon?
              </div>
              <a
                href="/"
                className="group flex items-baseline gap-4 font-serif text-2xl md:text-3xl text-ink leading-tight hover:text-seal transition-colors"
              >
                <span>
                  the attestation protocol for AI agent work
                </span>
                <span className="font-mono text-base text-muted group-hover:text-seal transition-colors">
                  →
                </span>
              </a>
              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {["agent-agnostic", "git-native", "onchain on monad", "mit"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 border border-border-strong"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* closing */}
          <div className="mt-20 text-center">
            <p className="font-serif italic text-xl md:text-2xl text-ink-dim">
              {ticket.status === "sealed"
                ? "This receipt is a cryptographic promise."
                : "This ticket is still in flight."}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              kairon · v0.3 · mit · 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; dot: string }> = {
    sealed: { bg: "bg-pass/10", fg: "text-pass", dot: "bg-pass" },
    verifying: { bg: "bg-seal/10", fg: "text-seal", dot: "bg-seal" },
    open: { bg: "bg-border/30", fg: "text-muted", dot: "bg-muted" },
    failed: { bg: "bg-fail/10", fg: "text-fail", dot: "bg-fail" },
  };
  const s = map[status] ?? map.open;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] rounded-full border border-border",
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
