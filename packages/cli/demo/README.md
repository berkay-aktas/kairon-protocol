# demo fixture

Minimal Node project with 3 passing `node --test` suites and two tickets.

- `kairon/tickets/042.md` — open ticket; seal locally or onchain to exercise the full flow.
- `kairon/tickets/043.md` — pre-sealed ticket mapped to a real Monad testnet tx.

## Verify the real seed tx

```bash
kairon verify-onchain 043
```

Reads ticket 043's onchain link, fetches the receipt from Monad testnet, parses the `Sealed` event, and confirms the logged `proofHash` matches the local `attestation_hash`. Real tx [`0x49569f…9903`](https://testnet.monadexplorer.com/tx/0x49569f1b2dab1161976e8e0aea00bd74a541c523c99c6ed93dabd77fa0029903), block 27,268,620. Typical runtime ~0.6s. No env vars needed; read-only.

## Full flow (requires `.env.local` with `KAIRON_*` set)

```bash
kairon verify 042                     # run criteria
kairon seal 042 --no-commit           # hash + write outcome, offchain
kairon replay 042                     # re-run, compare hashes
kairon seal 042 --onchain --no-commit # emit Sealed event to Monad
kairon verify-onchain 042             # read it back, confirm
kairon verify-onchain 042 --rehash    # re-run criteria then compare onchain
```
