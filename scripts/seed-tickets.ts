// Seed 5 sealed tickets to Monad testnet via a single sealMany() tx.
//
//   pnpm seed              # sign + send + write data/seed-tickets.json
//   pnpm seed --dry-run    # print hashes and preview JSON, no signing
//
// Reads KAIRON_CONTRACT_ADDRESS and KAIRON_PRIVATE_KEY from the repo-root
// .env.local. Searches upward from cwd so the script works from any subdir.

import * as fs from "node:fs";
import * as path from "node:path";
import { createHash } from "node:crypto";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  fallback,
  formatEther,
  http,
  parseAbi,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const DEFAULT_RPC = "https://testnet-rpc.monad.xyz";
const FALLBACK_RPC = "https://monad-testnet.drpc.org";
const EXPLORER = "https://testnet.monadexplorer.com";

const repoRoot = findRepoRoot();
loadEnv(path.join(repoRoot, ".env.local"));

const dryRun = process.argv.slice(2).includes("--dry-run");

// --- chain ---

const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.MONAD_TESTNET_RPC ?? DEFAULT_RPC] },
  },
  blockExplorers: {
    default: { name: "Monad Testnet Explorer", url: EXPLORER },
  },
  testnet: true,
});

const transport = fallback([
  http(process.env.MONAD_TESTNET_RPC ?? DEFAULT_RPC),
  http(FALLBACK_RPC),
]);

const publicClient = createPublicClient({ chain: monadTestnet, transport });

const kaironAbi = parseAbi([
  "event Sealed(bytes32 indexed proofHash, address indexed signer, uint256 timestamp)",
  "function seal(bytes32 proofHash)",
  "function sealMany(bytes32[] hashes)",
]);

// --- tickets ---

interface SeedTicket {
  id: string;
  title: string;
  agent: string;
  commit: string;
  proof: `0x${string}`;
  txHash: string;
  block: number | null;
  createdAt: string;
  sealedAt: string;
}

const baseTickets: Omit<SeedTicket, "proof" | "txHash" | "block">[] = [
  {
    id: "042",
    title: "JWT to session cookie migration",
    agent: "claude-opus-4.7",
    commit: "a7f3b2d",
    createdAt: "2026-04-22T10:34:12.000Z",
    sealedAt: "2026-04-22T14:21:44.000Z",
  },
  {
    id: "041",
    title: "Rate limiter middleware for /api",
    agent: "claude-sonnet-4-6",
    commit: "3f1c8a2",
    createdAt: "2026-04-22T08:15:00.000Z",
    sealedAt: "2026-04-22T11:47:30.000Z",
  },
  {
    id: "040",
    title: "Stripe payment webhook with idempotency",
    agent: "claude-opus-4.7",
    commit: "e9d7c45",
    createdAt: "2026-04-21T16:02:09.000Z",
    sealedAt: "2026-04-21T18:39:12.000Z",
  },
  {
    id: "039",
    title: "Postgres full-text index migration for /search",
    agent: "claude-sonnet-4-6",
    commit: "bc2af61",
    createdAt: "2026-04-21T09:00:00.000Z",
    sealedAt: "2026-04-21T13:22:05.000Z",
  },
  {
    id: "038",
    title: "Redis cache layer for invoice lookups",
    agent: "claude-opus-4.7",
    commit: "5a1b9f3",
    createdAt: "2026-04-20T19:45:00.000Z",
    sealedAt: "2026-04-20T22:11:37.000Z",
  },
];

function computeProof(t: {
  id: string;
  title: string;
  agent: string;
  commit: string;
  sealedAt: string;
}): `0x${string}` {
  const blob = JSON.stringify({
    id: t.id,
    title: t.title,
    agent: t.agent,
    commit: t.commit,
    sealedAt: t.sealedAt,
  });
  return ("0x" + createHash("sha256").update(blob).digest("hex")) as `0x${string}`;
}

function buildTickets(): SeedTicket[] {
  return baseTickets.map((t) => ({
    ...t,
    proof: computeProof(t),
    txHash: "pending",
    block: null,
  }));
}

// --- main ---

async function main() {
  const tickets = buildTickets();
  const uniq = new Set(tickets.map((t) => t.proof));
  if (uniq.size !== tickets.length) {
    throw new Error("hash collision among seed tickets — fix base metadata");
  }

  console.log("");
  console.log(
    `  seed-tickets — ${dryRun ? "dry run" : "signing " + tickets.length + " attestations"}`,
  );
  console.log("");
  for (const t of tickets) {
    console.log(`    ${t.id}  ${t.title}`);
    console.log(`         agent   ${t.agent}`);
    console.log(`         commit  ${t.commit}`);
    console.log(`         proof   ${t.proof}`);
    console.log("");
  }

  if (dryRun) {
    console.log("  --dry-run: no transaction will be sent, no file written");
    console.log("");
    console.log("  preview of data/seed-tickets.json:");
    console.log(JSON.stringify(tickets, null, 2));
    return;
  }

  const addr = (process.env.KAIRON_CONTRACT_ADDRESS ?? "").trim() as Address;
  const key = (process.env.KAIRON_PRIVATE_KEY ?? "").trim() as Hex;
  if (!addr || addr.length !== 42 || !addr.startsWith("0x")) {
    throw new Error("KAIRON_CONTRACT_ADDRESS missing or malformed in .env.local");
  }
  if (!key || key.length !== 66 || !key.startsWith("0x")) {
    throw new Error("KAIRON_PRIVATE_KEY missing or malformed in .env.local");
  }

  const account = privateKeyToAccount(key);
  const [balance, code] = await Promise.all([
    publicClient.getBalance({ address: account.address }),
    publicClient.getCode({ address: addr }),
  ]);

  console.log(`  signer    ${account.address}`);
  console.log(`  contract  ${addr}`);
  console.log(`  balance   ${formatEther(balance)} MON`);
  console.log("");

  if (balance === BigInt(0)) {
    throw new Error(
      `signer ${account.address} has 0 MON — fund it from the Monad testnet faucet`,
    );
  }
  if (!code || code === "0x") {
    throw new Error(`no contract deployed at ${addr} on chain ${monadTestnet.id}`);
  }

  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport,
  });

  console.log(`  sending   sealMany(${tickets.length})...`);
  const hashes = tickets.map((t) => t.proof);
  const txHash = await walletClient.writeContract({
    address: addr,
    abi: kaironAbi,
    functionName: "sealMany",
    args: [hashes],
  });
  console.log(`  tx        ${txHash}`);
  console.log(`  explorer  ${EXPLORER}/tx/${txHash}`);
  console.log("  waiting for receipt...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  const block = Number(receipt.blockNumber);
  console.log(`  block     ${block}`);
  console.log(`  status    ${receipt.status}`);

  if (receipt.status !== "success") {
    throw new Error("tx reverted — not updating data/seed-tickets.json");
  }

  const final: SeedTicket[] = tickets.map((t) => ({ ...t, txHash, block }));
  const outPath = path.join(repoRoot, "data", "seed-tickets.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(final, null, 2) + "\n");

  console.log("");
  console.log(`  wrote     ${outPath}`);
  console.log(`  ${tickets.length} tickets sealed onchain in one tx.`);
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("  seed failed:", err instanceof Error ? err.message : err);
  console.error("");
  process.exit(1);
});

// --- utils ---

function findRepoRoot(): string {
  let dir = process.cwd();
  while (true) {
    if (
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml")) ||
      fs.existsSync(path.join(dir, ".git"))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}

function loadEnv(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
