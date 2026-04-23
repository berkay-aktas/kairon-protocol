import { createHash } from "node:crypto";

export function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(canonical).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") +
    "}"
  );
}

export function sha256Hex(data: string): `0x${string}` {
  return ("0x" + createHash("sha256").update(data).digest("hex")) as `0x${string}`;
}

export function hashOutcome(outcome: unknown): `0x${string}` {
  return sha256Hex(canonical(outcome));
}
