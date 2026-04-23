# Kairon contracts

Attestation primitive for the Kairon protocol. One event, two functions, no storage. When an agent seals a ticket, the outcome hash is emitted as a `Sealed` event — the chain is the record.

## Contract surface

```solidity
event Sealed(bytes32 indexed proofHash, address indexed signer, uint256 timestamp);

function seal(bytes32 proofHash) external;
function sealMany(bytes32[] calldata hashes) external;
```

No ownership, no upgrades, no storage. Anyone can attest; the chain time-stamps and indexes by signer and hash.

## Setup

```bash
# From contracts/
forge install foundry-rs/forge-std --no-commit
cp .env.example .env
# fill DEPLOYER_PRIVATE_KEY with a burner funded on Monad testnet
```

## Build

```bash
forge build
```

## Test

```bash
forge test -vv
```

## Deploy (Monad testnet)

```bash
source .env
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $MONAD_TESTNET_RPC \
  --broadcast \
  --private-key $DEPLOYER_PRIVATE_KEY
```

After broadcast, copy the printed address into the repo-root `.env.local` as `KAIRON_CONTRACT_ADDRESS=0x...`. Both `src/lib/monad.ts` and `packages/cli` read it from there.

## Network

- Chain ID: 10143
- Native token: MON
- Explorer: https://testnet.monadexplorer.com
- Fallback RPC: https://monad-testnet.drpc.org

## Gas

Tests assert a single `seal` stays under 60k gas. `sealMany` amortizes the base tx cost across events; prefer it for batch seeding.
