import { execSync } from "node:child_process";

export function gitHeadShort(cwd: string = process.cwd()): string | null {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

export function gitCommit(
  files: string[],
  message: string,
  cwd: string = process.cwd(),
): string | null {
  try {
    const quoted = files.map((f) => JSON.stringify(f)).join(" ");
    execSync(`git add -- ${quoted}`, { cwd, stdio: "ignore" });
    execSync(`git commit -m ${JSON.stringify(message)}`, {
      cwd,
      stdio: "ignore",
    });
    return gitHeadShort(cwd);
  } catch {
    return null;
  }
}
