import { execSync } from "node:child_process";
import type { Criterion } from "./criteria.js";

export interface CriterionResult {
  shell: string;
  expect_exit: number;
  actual_exit: number;
  passed: boolean;
  duration_ms: number;
  stdout_tail: string;
}

export function runCriteria(
  criteria: Criterion[],
  cwd: string = process.cwd(),
): CriterionResult[] {
  const results: CriterionResult[] = [];
  for (const c of criteria) {
    const start = Date.now();
    let actual_exit = 0;
    let stdout_tail = "";
    try {
      const stdout = execSync(c.shell, {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 60_000,
      });
      stdout_tail = lastLines(stdout, 3);
    } catch (err) {
      const e = err as NodeJS.ErrnoException & {
        status?: number;
        stdout?: Buffer | string;
        stderr?: Buffer | string;
      };
      actual_exit = typeof e.status === "number" ? e.status : 1;
      const out =
        (e.stdout ? e.stdout.toString() : "") +
        (e.stderr ? e.stderr.toString() : "");
      stdout_tail = lastLines(out, 3);
    }
    results.push({
      shell: c.shell,
      expect_exit: c.expect_exit,
      actual_exit,
      passed: actual_exit === c.expect_exit,
      duration_ms: Date.now() - start,
      stdout_tail,
    });
  }
  return results;
}

function lastLines(s: string, n: number): string {
  return s.trim().split("\n").slice(-n).join("\n");
}
