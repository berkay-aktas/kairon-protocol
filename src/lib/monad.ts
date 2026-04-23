import { createPublicClient, defineChain, fallback, http, parseAbi } from "viem";

const DEFAULT_RPC = "https://testnet-rpc.monad.xyz";
const FALLBACK_RPC = "https://monad-testnet.drpc.org";
const EXPLORER = "https://testnet.monadexplorer.com";

const primaryRpc = process.env.NEXT_PUBLIC_MONAD_RPC ?? DEFAULT_RPC;

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [primaryRpc] },
  },
  blockExplorers: {
    default: { name: "Monad Testnet Explorer", url: EXPLORER },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: fallback([http(primaryRpc), http(FALLBACK_RPC)]),
});

export const kaironAbi = parseAbi([
  "event Sealed(bytes32 indexed proofHash, address indexed signer, uint256 timestamp)",
  "function seal(bytes32 proofHash)",
  "function sealMany(bytes32[] hashes)",
]);

export const KAIRON_ADDRESS = (process.env.NEXT_PUBLIC_KAIRON_ADDRESS ?? "") as `0x${string}`;

export const EXPLORER_URL = EXPLORER;
export const txUrl = (hash: string) => `${EXPLORER}/tx/${hash}`;
export const addressUrl = (addr: string) => `${EXPLORER}/address/${addr}`;

export function watchBlockNumber(
  onBlock: (block: bigint) => void,
  onError?: (err: Error) => void,
): () => void {
  return publicClient.watchBlockNumber({
    onBlockNumber: onBlock,
    onError:
      onError ??
      ((err) => console.warn("[kairon] block watcher error:", err.message)),
    poll: true,
    pollingInterval: 1000,
  });
}
