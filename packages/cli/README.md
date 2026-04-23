# @kairon/cli

Command surface for the Kairon attestation protocol.

## Install

Once published to npm:

```bash
pnpm install -g @kairon/cli
# or
npm install -g @kairon/cli
```

From a local checkout of this repo:

```bash
pnpm --filter @kairon/cli build
pnpm --filter @kairon/cli link --global
```

After either, `kairon` is on `$PATH`.

## Commands

- `kairon open <title>` — open a new ticket; suggests criteria from project fingerprints.
- `kairon verify <id>` — run the ticket's criteria and report pass/fail.
- `kairon seal <id>` — verify, hash the outcome, write it back, git-commit. `--onchain` emits a `Sealed` event to Monad when `KAIRON_CONTRACT_ADDRESS` and `KAIRON_PRIVATE_KEY` are set. `--no-commit` skips git.
- `kairon verify-onchain <id>` — read the `Sealed` event back from Monad and compare it to the ticket's local hash. `--rehash` re-runs criteria first. Read-only; no env vars needed. 3s timeout with drpc fallback.
- `kairon replay <id>` — re-run a sealed ticket's criteria; succeeds iff the recomputed hash matches the sealed hash.
- `kairon list` — open and sealed tickets in the cwd's `kairon/tickets/`.
- `kairon show <id>` — full ticket detail.

## Environment

CLI searches upward from `process.cwd()` for `.env.local` and loads it. Variables used:

- `KAIRON_CONTRACT_ADDRESS` — deployed `Kairon` address on Monad testnet.
- `KAIRON_PRIVATE_KEY` — signer for onchain attestation (burner only).
- `MONAD_TESTNET_RPC` — optional RPC override.

## Development

```bash
pnpm --filter @kairon/cli build     # emit dist/
pnpm --filter @kairon/cli dev       # run src/ directly via tsx
pnpm --filter @kairon/cli typecheck # tsc --noEmit
```

## Demo fixture

`demo/` contains a tiny Node project with three passing `node --test` suites and a pre-seeded open ticket (`kairon/tickets/042.md`). Runs end-to-end without a network:

```bash
cd packages/cli/demo
kairon verify 042
kairon seal 042 --no-commit           # offchain
kairon seal 042 --onchain --no-commit # once KAIRON_* env vars are set
kairon replay 042
kairon verify-onchain 043             # reads back the live seed tx (tx 0x49569f…9903, block 27,268,620)
```
