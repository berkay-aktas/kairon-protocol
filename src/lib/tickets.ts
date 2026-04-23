import rawSeed from "../../data/seed-tickets.json";
import type { Ticket, TicketRaw } from "./types";

function stripHexPrefix(h?: string): string | undefined {
  if (!h) return undefined;
  return h.startsWith("0x") ? h.slice(2) : h;
}

function normalize(raw: TicketRaw): Ticket {
  const txReal =
    !!raw.txHash && raw.txHash !== "pending" && raw.txHash.length > 8;
  const hasOnchain = txReal && raw.block != null;
  const status: Ticket["status"] =
    raw.status ??
    (hasOnchain && raw.sealedAt
      ? "sealed"
      : raw.sealedAt
      ? "verifying"
      : txReal
      ? "verifying"
      : "open");

  return {
    id: String(raw.id),
    title: raw.title ?? "untitled",
    status,
    agent: raw.agent ?? "unknown",
    commit: raw.commit,
    opened: raw.createdAt ?? new Date().toISOString(),
    sealed: raw.sealedAt ?? undefined,
    proofHash: stripHexPrefix(raw.proof),
    txHash: txReal ? raw.txHash : undefined,
    blockNumber: raw.block ?? undefined,
    explorerUrl: raw.explorerUrl,
    from: raw.from,
    to: raw.to,
    method: raw.method,
    gasUsed: raw.gasUsed,
    context: raw.context,
    criteria: raw.criteria ?? [],
    outcome: raw.outcome,
  };
}

/** Normalized list of all backend-seeded tickets. */
export const SEED_TICKETS: Ticket[] = (rawSeed as TicketRaw[]).map(normalize);

/** Rich, always-sealed demo ticket shown on the landing page. Not in the seed file;
 *  deliberately separate so landing looks final regardless of backend seal state. */
export const LANDING_TICKET_042: Ticket = {
  id: "042",
  title: "JWT → session cookie migration",
  status: "sealed",
  agent: "claude-opus-4.6",
  opened: "2026-04-22T10:34:12Z",
  sealed: "2026-04-22T14:21:44Z",
  commit: "a7f3b2d",
  proofHash:
    "a3f49c8b7e214c5f8d02ba19f7e302d86b1f8c5a4d9271a0c9e43b871f0de9b2",
  txHash:
    "0x4a7fc8e21d04b88d2a0c3a5e1f9d7c4b6e3a0f1d2c5b8a7e4f1d3c2b5a8e7f1d",
  blockNumber: 18442903,
  explorerUrl: "https://testnet.monadexplorer.com/tx/0x4a7fc8e21d04",
  from: "0xA2dE19f0e8B79cBb",
  to: "kairon.sol",
  method: "Sealed(bytes32 hash, address signer, uint256 timestamp)",
  gasUsed: 23841,
  context:
    "Client-side session timeouts are rising. JWT's stateless nature prevents server-side invalidation. Migrating to server-side sessions backed by Redis.",
  criteria: [
    { shell: "npm test -- auth.test.ts", expect_exit: 0, timeout: 60, passed: true, duration_ms: 842 },
    { shell: "npm test -- session.test.ts", expect_exit: 0, timeout: 60, passed: true, duration_ms: 421 },
    { shell: "npm run build", expect_exit: 0, timeout: 120, passed: true, duration_ms: 4200 },
  ],
  outcome: {
    lines: [
      { t: "14:20:11", text: "running criteria (3)", kind: "head" },
      { t: "14:20:11", text: "$ npm test -- auth.test.ts", kind: "head" },
      { text: "  ✓ handles expired session                ( 23ms )", kind: "pass" },
      { text: "  ✓ refreshes on boundary                  ( 14ms )", kind: "pass" },
      { text: "  ✓ rejects tampered token                 (  8ms )", kind: "pass" },
      { text: "  ✓ honors absolute timeout                ( 19ms )", kind: "pass" },
      { text: "  … 43 more passed", kind: "meta" },
      { text: "  47 passed, 0 failed                      (842ms )", kind: "pass" },
      { t: "14:20:28", text: "$ npm test -- session.test.ts", kind: "head" },
      { text: "  23 passed, 0 failed                      (421ms )", kind: "pass" },
      { t: "14:21:44", text: "$ npm run build", kind: "head" },
      { text: "  ✓ built in 4.2s                                  ", kind: "pass" },
      { t: "14:21:44", text: "all checks passed. sealing.", kind: "final" },
    ],
  },
};

export const DEFAULT_TICKET: Ticket = LANDING_TICKET_042;

/** Get a ticket by id. For ticket 042 we augment backend seed metadata with
 *  rich landing content (criteria/outcome/context) so /r/042 is always readable. */
export function getTicket(id: string): Ticket | null {
  if (id === "042") {
    const seedEntry = SEED_TICKETS.find((t) => t.id === "042");
    if (!seedEntry) return LANDING_TICKET_042;
    return {
      ...LANDING_TICKET_042,
      agent: seedEntry.agent || LANDING_TICKET_042.agent,
      commit: seedEntry.commit || LANDING_TICKET_042.commit,
      opened: seedEntry.opened || LANDING_TICKET_042.opened,
      sealed: seedEntry.sealed ?? LANDING_TICKET_042.sealed,
      proofHash: seedEntry.proofHash || LANDING_TICKET_042.proofHash,
      txHash: seedEntry.txHash || LANDING_TICKET_042.txHash,
      blockNumber: seedEntry.blockNumber ?? LANDING_TICKET_042.blockNumber,
      status:
        seedEntry.status === "sealed" ? "sealed" : LANDING_TICKET_042.status,
    };
  }
  return SEED_TICKETS.find((t) => t.id === id) ?? null;
}

export function listTickets(): Ticket[] {
  return [...SEED_TICKETS].sort((a, b) => b.opened.localeCompare(a.opened));
}

export function listSealed(): Ticket[] {
  return SEED_TICKETS.filter((t) => t.status === "sealed");
}

export function listActive(): Ticket[] {
  return SEED_TICKETS.filter(
    (t) => t.status === "verifying" || t.status === "open"
  );
}

export function shortHash(hex?: string, groups = 3, size = 4): string {
  if (!hex) return "—";
  const trimmed = hex.startsWith("0x") ? hex.slice(2) : hex;
  const chunks: string[] = [];
  for (let i = 0; i < trimmed.length && chunks.length < groups; i += size) {
    chunks.push(trimmed.slice(i, i + size));
  }
  return (hex.startsWith("0x") ? "0x" : "") + chunks.join(" ") + "…";
}

export function formatHM(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(
    d.getUTCMinutes()
  ).padStart(2, "0")}`;
}

export function formatDateShort(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}
