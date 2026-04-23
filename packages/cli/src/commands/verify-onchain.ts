import type { Hex } from "viem";
import { c } from "../io/colors.js";
import { loadTicket } from "../core/ticket.js";
import { parseCriteria } from "../core/criteria.js";
import { runCriteria } from "../core/runner.js";
import { hashOutcome } from "../core/hash.js";
import { verifyOnchain } from "../core/onchain.js";

export interface VerifyOnchainOptions {
  id: string;
  rehash: boolean;
}

export async function verifyOnchainCommand(
  opts: VerifyOnchainOptions,
): Promise<void> {
  const ticket = loadTicket(opts.id);

  console.log("");
  console.log(
    `  ${c.dim("ticket")}       ${c.bold(ticket.frontmatter.id)} — ${ticket.frontmatter.title}`,
  );

  if (ticket.frontmatter.status !== "sealed") {
    console.log("");
    console.log(
      c.fail(`  ticket ${ticket.frontmatter.id} is not sealed — nothing to verify onchain`),
    );
    process.exit(1);
  }

  const onchainField = ticket.frontmatter.onchain;
  if (!onchainField) {
    console.log("");
    console.log(c.fail(`  ticket has no onchain attestation`));
    console.log(c.dim(`  (seal with --onchain first)`));
    process.exit(1);
  }

  const txHash = extractTxHash(onchainField);
  if (!txHash) {
    console.log("");
    console.log(c.fail(`  could not parse tx hash from onchain field: ${onchainField}`));
    process.exit(1);
  }

  let localHash: Hex;
  if (opts.rehash) {
    console.log(`  ${c.dim("mode")}         rehash — re-running criteria`);
    const criteria = parseCriteria(ticket.body);
    if (criteria.length === 0) {
      console.log("");
      console.log(c.fail("  no criteria in ticket — cannot rehash"));
      process.exit(1);
    }
    const results = runCriteria(criteria);
    const allPassed = results.every((r) => r.passed);
    if (!allPassed) {
      console.log("");
      console.log(c.fail("  criteria failed on rehash — environment may have drifted"));
      for (const r of results.filter((r) => !r.passed)) {
        console.log(c.dim(`    ${c.fail("✗")} ${r.shell} exit ${r.actual_exit}`));
      }
      process.exit(1);
    }
    const outcome = {
      id: ticket.frontmatter.id,
      title: ticket.frontmatter.title,
      agent: ticket.frontmatter.agent ?? "",
      commit: ticket.frontmatter.commit ?? "",
      sealedAt: ticket.frontmatter.sealed ?? "",
      criteria: results.map((r) => ({
        shell: r.shell,
        expect_exit: r.expect_exit,
        actual_exit: r.actual_exit,
        passed: r.passed,
      })),
    };
    localHash = hashOutcome(outcome);
    console.log(`  ${c.dim("rehash")}       ${c.hash(localHash)}`);
  } else {
    const fromFrontmatter = ticket.frontmatter.attestation_hash;
    if (!fromFrontmatter) {
      console.log("");
      console.log(c.fail("  ticket has no attestation_hash in frontmatter"));
      process.exit(1);
    }
    localHash = fromFrontmatter as Hex;
    console.log(`  ${c.dim("local hash")}   ${c.hash(localHash)}`);
  }

  console.log(`  ${c.dim("tx")}           ${c.hash(txHash)}`);
  console.log(`  ${c.dim("reading")}      monad testnet...`);

  const result = await verifyOnchain(txHash, localHash);

  console.log("");

  if (result.kind === "match") {
    console.log(`  ${c.dim("onchain")}      ${c.hash(result.onchainHash)}`);
    console.log(`  ${c.dim("block")}        ${result.blockNumber.toLocaleString()}`);
    if (result.eventCount > 1) {
      console.log(
        c.dim(`  (matched 1 of ${result.eventCount} Sealed events in this tx)`),
      );
    }
    console.log("");
    console.log(`  ${c.pass("✓ onchain hash matches local attestation")}`);
    return;
  }

  if (result.kind === "mismatch") {
    console.log(`  ${c.dim("block")}        ${result.blockNumber.toLocaleString()}`);
    if (result.onchainHashes.length > 0) {
      console.log(
        `  ${c.dim("onchain")}      ${result.onchainHashes.length} Sealed event${result.onchainHashes.length === 1 ? "" : "s"}:`,
      );
      for (const h of result.onchainHashes) {
        console.log(`               ${c.hash(h)}`);
      }
    }
    console.log("");
    console.log(`  ${c.fail("✗ MISMATCH — ticket was tampered or different ticket attested")}`);
    console.log(c.dim(`  ${result.reason}`));
    process.exit(1);
  }

  // kind === "error" — network / timeout / not-found
  console.log(
    `  ${c.dim("warn")}         could not reach chain — verification inconclusive`,
  );
  console.log(c.dim(`  ${result.reason}`));
  console.log(c.dim(`  (retry when network is available)`));
  process.exit(2);
}

/**
 * Accepts common encodings of the onchain field:
 *   monad://tx/0x...
 *   monad-testnet://tx/0x...
 *   https://testnet.monadexplorer.com/tx/0x...
 *   0x... (raw 32-byte hash)
 */
function extractTxHash(onchainField: string): Hex | null {
  const m = onchainField.match(/0x[0-9a-fA-F]{64}/);
  return m ? (m[0] as Hex) : null;
}
