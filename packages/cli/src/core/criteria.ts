export interface Criterion {
  shell: string;
  expect_exit: number;
}

export function parseCriteria(body: string): Criterion[] {
  const match = body.match(/##\s+Criteria\s*\n([\s\S]*?)(?:\n##\s+|$)/);
  if (!match) return [];
  const block = match[1];

  const results: Criterion[] = [];
  const lines = block.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const shellMatch = lines[i].trim().match(/^-\s+shell:\s+(.+)$/);
    if (!shellMatch) continue;
    const shell = shellMatch[1].trim();
    let expect_exit = 0;
    if (i + 1 < lines.length) {
      const exitMatch = lines[i + 1].trim().match(/^expect_exit:\s+(\d+)$/);
      if (exitMatch) {
        expect_exit = parseInt(exitMatch[1], 10);
        i++;
      }
    }
    results.push({ shell, expect_exit });
  }
  return results;
}
