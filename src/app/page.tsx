import { HeroTabs } from "@/components/hero-tabs";
import { MonadBand } from "@/components/monad-band";
import { BeforeAfterBand } from "@/components/before-after-band";
import { IDESection } from "@/components/ide-section";
import { Nav } from "@/components/nav";
import { ProblemSection } from "@/components/problem-section";
import { ArchitectureSection } from "@/components/architecture-section";
import { CTABlock } from "@/components/cta-block";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Nav />
      <HeroTabs />
      <MonadBand />
      <BeforeAfterBand />
      <ProblemSection />
      <IDESection />
      <ArchitectureSection />

      {/* the why · single italic interlude */}
      <section className="relative px-6 md:px-14 py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
            ✦
          </div>
          <p className="font-serif italic text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.25] text-ink-dim">
            Because trust should be evidence,
            <br />
            <span className="text-ink not-italic font-normal">not etiquette.</span>
          </p>
        </div>
      </section>

      <CTABlock />

      <section id="spec" className="relative px-6 md:px-14 py-32 md:py-44">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            <span className="tabular-nums text-seal">04</span>
            <span className="flex-1 h-px bg-border-strong" />
            <span>specification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-start">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl leading-[1.02] mb-6">
                One protocol.
                <br />
                <span className="italic text-ink-dim">Many surfaces.</span>
              </h2>
              <p className="text-ink-dim leading-relaxed max-w-xl mb-8">
                Kairon is a protocol, not a product. Today it lives inside Claude Code as
                a skill. The same spec runs under a CLI, under Cursor, under Codex.
                Any agent, any runner, one tamper-evident receipt.
              </p>
              <div className="flex flex-wrap gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em]">
                {[
                  "skill · claude code",
                  "cli · any agent",
                  "contract · monad",
                  "replay · deterministic",
                  "git-native",
                  "mit license",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 border border-border-strong bg-paper-2/40 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:pl-8 md:border-l md:border-border-strong">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
                references
              </div>
              <div className="space-y-4 font-mono text-[13px]">
                {[
                  ["github", "kairon-protocol/core"],
                  ["spec", "kairon.md · v0.3"],
                  ["contract", "monad://kairon.sol"],
                  ["blitz", "monad blitz · 2026"],
                ].map(([label, val]) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-4 group"
                  >
                    <span className="uppercase tracking-[0.22em] text-[11px] text-muted w-20">
                      {label}
                    </span>
                    <span className="flex-1 h-px bg-border group-hover:bg-seal/60 transition-colors" />
                    <span className="text-ink group-hover:text-seal transition-colors">
                      {val} ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 pt-10 border-t border-border-strong flex flex-col md:flex-row items-baseline justify-between gap-6">
            <div className="font-serif italic text-2xl md:text-3xl text-ink-dim leading-tight max-w-lg">
              When the agent&rsquo;s word becomes attestation,
              <br />
              trust stops being a claim.
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              kairon v0.3 · 2026 · mit
            </div>
          </div>
        </div>
      </section>

      <div className="h-32" />
    </main>
  );
}
