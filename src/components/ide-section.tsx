import { IDEFrame } from "./ide-frame";
import type { Ticket } from "@/lib/types";

export function IDESection({ ticket }: { ticket?: Ticket }) {
  return (
    <section
      id="ticket"
      className="relative px-6 md:px-14 py-28 md:py-40"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="tabular-nums text-seal">02</span>
          <span className="flex-1 h-px bg-border-strong" />
          <span>one ticket · five receipts</span>
        </div>

        <div className="mb-10 max-w-2xl">
          <h2 className="font-serif text-5xl md:text-6xl leading-[1.02] mb-5">
            A sealed ticket is not a claim.
            <br />
            <span className="italic text-ink-dim">It is a set of files.</span>
          </h2>
          <p className="text-ink-dim leading-relaxed max-w-xl">
            Every Kairon ticket produces five artifacts — markdown intent, YAML criteria,
            runner log, cryptographic proof, onchain attestation. All git-tracked.
            All independently verifiable. Click through.
          </p>
        </div>

        <IDEFrame ticket={ticket} />
      </div>
    </section>
  );
}
