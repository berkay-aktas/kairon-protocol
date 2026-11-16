# Kairon

Attestation layer for AI coding agents.

An agent opens a ticket, proposes success criteria from the project's scripts, does the work, verifies the criteria, and seals the outcome as a SHA-256 hash — committed to git and optionally emitted as a `Sealed` event on Monad testnet. The chain records *that* a claim was made; the criteria record *what* was claimed.

## How it fits together

```
Claude Code  ──►  kairon skill  ──►  @kairon/cli  ──►  git (+ Monad testnet)
                                     │
                                     ├─ open     ticket file, criteria, signer
                                     ├─ verify   run criteria, hash result
                                     ├─ seal     commit hash; --onchain emits Sealed()
                                     └─ replay   re-run, compare hash
```

Three moving parts live here:

- **`contracts/`** — one Solidity contract, one event, no storage. Foundry project.
- **`packages/cli/`** — TypeScript CLI. Ticket lifecycle, criteria runner, onchain attestation via viem.
- **`plugins/kairon/`** — Claude Code skill that routes `"seal this: …"` phrases to the CLI.

`src/` is the marketing site (Next.js 16, Tailwind 4).

## Quick start

```bash
pnpm install
pnpm --filter @kairon/cli build
pnpm --filter @kairon/cli link --global
```

Run the demo — self-contained, no network:

```bash
cd packages/cli/demo
kairon verify 042
kairon seal 042 --no-commit
kairon replay 042
kairon verify-onchain 043    # reads a pre-seeded tx back from Monad testnet
```

Run the site:

```bash
pnpm dev            # http://localhost:3000
pnpm seed           # reset data/ back to the seed fixtures
```

## Onchain

Monad testnet only. Contract deploy + RPC details in [`contracts/README.md`](contracts/README.md). Set the deployed address in `.env.local` as `KAIRON_CONTRACT_ADDRESS=0x…`; both `src/lib/monad.ts` and the CLI pick it up from there.

- Chain ID: 10143
- Explorer: https://testnet.monadexplorer.com
- RPC: `https://testnet-rpc.monad.xyz` (drpc fallback, 3s timeout)

## Layout

```
contracts/          Kairon.sol, tests, deploy script
packages/cli/       @kairon/cli
  demo/             fixtures that run without a network
plugins/kairon/     Claude Code skill (shells out; does not reimplement)
src/                landing, interactive demo, /r/<id> receipt page
scripts/            seed + playwright screenshot helpers
data/               seed tickets
docs/prd.md         product spec
```

## Honest limitations

Criteria are shell commands a developer writes; `- shell: true` passes. Kairon records what was *claimed*, not what was independently true — the value is in the audit trail, not in external verification. Replay is deterministic only if the environment is. Onchain is a hash, a signer, and a timestamp; it does not prove the criteria ran.

The chain proves *that* a claim was made. The criteria file proves *what* was claimed. Both together are the receipt.

## Status

Solo hackathon build for [Monad Blitz](https://monad.xyz) Kayseri (April 23, 2026) — honorable mention, top 6 projects. Testnet only, burner keys only. CLI is not on npm yet — use the local link flow above.
