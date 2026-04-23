import {
  createPublicClient,
  createWalletClient,
  defineChain,
  fallback,
  http,
  parseAbi,
  parseEventLogs,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const DEFAULT_RPC = "https://testnet-rpc.monad.xyz";
const FALLBACK_RPC = "https://monad-testnet.drpc.org";
const EXPLORER = "https://testnet.monadexplorer.com";

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

const kaironAbi = parseAbi([
  "event Sealed(bytes32 indexed proofHash, address indexed signer, uint256 timestamp)",
  "function seal(bytes32 proofHash)",
  "function sealMany(bytes32[] hashes)",
]);

export type AttestationOutcome =
  | { success: true; txHash: Hex; explorerUrl: string }
  | { success: false; reason: string };

export async function attestOnchain(proofHash: Hex): Promise<AttestationOutcome> {
  const addr = (process.env.KAIRON_CONTRACT_ADDRESS ?? "").trim() as Address;
  const key = (process.env.KAIRON_PRIVATE_KEY ?? "").trim() as Hex;

  if (!addr || addr.length !== 42 || !addr.startsWith("0x")) {
    return { success: false, reason: "KAIRON_CONTRACT_ADDRESS not set" };
  }
  if (!key || key.length !== 66 || !key.startsWith("0x")) {
    return { success: false, reason: "KAIRON_PRIVATE_KEY not set" };
  }

  try {
    const account = privateKeyToAccount(key);
    const walletClient = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http(),
    });
    const txHash = await withTimeout(
      walletClient.writeContract({
        address: addr,
        abi: kaironAbi,
        functionName: "seal",
        args: [proofHash],
      }),
      3_000,
    );
    return {
      success: true,
      txHash,
      explorerUrl: `${EXPLORER}/tx/${txHash}`,
    };
  } catch (err) {
    return {
      success: false,
      reason: err instanceof Error ? err.message : "unknown error",
    };
  }
}

export type VerifyOnchainOutcome =
  | { kind: "match"; onchainHash: Hex; blockNumber: number; eventCount: number }
  | { kind: "mismatch"; onchainHashes: Hex[]; blockNumber: number; reason: string }
  | { kind: "error"; reason: string };

export async function verifyOnchain(
  txHash: Hex,
  localHash: Hex,
): Promise<VerifyOnchainOutcome> {
  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: fallback([
      http(process.env.MONAD_TESTNET_RPC ?? DEFAULT_RPC),
      http(FALLBACK_RPC),
    ]),
  });

  try {
    const receipt = await withTimeout(
      publicClient.getTransactionReceipt({ hash: txHash }),
      3_000,
    );

    if (receipt.status !== "success") {
      return { kind: "error", reason: `tx status is ${receipt.status}` };
    }

    const events = parseEventLogs({
      abi: kaironAbi,
      logs: receipt.logs,
      eventName: "Sealed",
    });

    if (events.length === 0) {
      return {
        kind: "mismatch",
        onchainHashes: [],
        blockNumber: Number(receipt.blockNumber),
        reason: "no Sealed events in tx",
      };
    }

    const hashes = events.map((e) => e.args.proofHash as Hex);
    const normalizedLocal = localHash.toLowerCase() as Hex;
    const matched = hashes.find((h) => h.toLowerCase() === normalizedLocal);

    if (matched) {
      return {
        kind: "match",
        onchainHash: matched,
        blockNumber: Number(receipt.blockNumber),
        eventCount: events.length,
      };
    }

    return {
      kind: "mismatch",
      onchainHashes: hashes,
      blockNumber: Number(receipt.blockNumber),
      reason:
        hashes.length === 1
          ? "local hash differs from the sealed attestation"
          : `local hash not among ${hashes.length} Sealed events in this tx`,
    };
  } catch (err) {
    return {
      kind: "error",
      reason: err instanceof Error ? err.message : "unknown RPC error",
    };
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}
