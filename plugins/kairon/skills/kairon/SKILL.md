---
name: kairon
description: Use when the user asks to seal, verify, or replay a coding task as a tamper-evident attestation. Triggers on phrases like "seal this", "seal this ticket", "open a sealed ticket for…", "verify ticket 042", or when the user wants proof-of-work for their AI agent output.
---

# kairon — sealed ticket attestation

Kairon records agent work as tamper-evident attestations. The CLI opens a ticket, proposes success criteria from the project's scripts, runs the work, verifies the criteria, and seals the outcome as a SHA-256 hash — committed to git and optionally emitted as a `Sealed` event on Monad testnet.

This skill shells out to the `kairon` CLI. Do not reimplement the logic.

## When to invoke

- `seal this: <title>` / `seal: <title>` — open a sealed ticket and do the work under attestation
- "seal this" / "seal as a ticket" / "make this a sealed ticket" — same, title taken from surrounding context
- "verify ticket N" / "verify N onchain" — check the onchain record
- "replay N" — re-run criteria and compare hashes
- "list kairon tickets" / "what's sealed" — inspect state

If the user wants regular task tracking without the attestation framing, route elsewhere — kairon is specifically for cryptographically-recorded work.

## Command surface

Run from the repo root. If `kairon` is not on `$PATH`, prepend `pnpm exec` or use `npx @kairon/cli`.

```
kairon open "<title>"       # create ticket, suggest criteria from package.json / Cargo.toml / go.mod / pyproject.toml
kairon verify <id>          # run criteria, report pass/fail
kairon seal <id>            # verify, hash, commit. --onchain emits Sealed event (needs KAIRON_* env vars)
kairon verify-onchain <id>  # read-only: fetch tx receipt, compare onchain hash to local
kairon replay <id>          # re-run criteria and compare recomputed hash against stored
kairon list                 # open + sealed tickets in cwd
kairon show <id>            # full ticket detail
```

## Example interactions

**"seal this: fix auth bug"**

1. Run `kairon open "fix auth bug"`. The CLI prints suggested criteria and a `[Y/n]` prompt.
2. Show the suggestions. On yes, proceed. If they want changes, edit `kairon/tickets/<id>.md`'s `## Criteria` section before running verify.
3. Do the actual work — edit files, run tests, debug. Nothing kairon-specific here.
4. Run `kairon seal <id>`. Add `--onchain` if the user mentions chain, release, or cross-org proof.
5. Report the seal hash and, if onchain, the tx hash plus explorer link.

**"verify ticket 042"**

Run `kairon verify-onchain 042`. Report the result verbatim — match, mismatch, or inconclusive (network unreachable). Mismatch means the ticket's metadata was edited, the signer differs, or a different ticket was attested under this tx — surface the reason directly.

**"replay 042"**

Run `kairon replay 042`. Clean replay = criteria still pass and recomputed hash matches stored. If criteria pass but the hash differs, ticket metadata or outcome was edited since seal — flag this to the user.

## Honest limitations

Criteria are shell commands a dev writes; `- shell: true` would pass. Kairon records what was claimed, not what was true — value is in the audit trail, not independent verification. Replay is deterministic only if the environment is reproducible. Onchain records a hash, a signer, and a timestamp; it does not verify criteria ran.

Treat Kairon as a receipt layer. The chain proves *that* a claim was made; the criteria prove *what* was claimed.
