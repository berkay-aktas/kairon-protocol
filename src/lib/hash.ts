export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function chunkHash(hex: string, groupSize = 4): string[] {
  const groups: string[] = [];
  for (let i = 0; i < hex.length; i += groupSize) {
    groups.push(hex.slice(i, i + groupSize));
  }
  return groups;
}
