import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const out = "/tmp/kairon-shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});
const page = await ctx.newPage();

// sealed rich page
await page.goto("http://localhost:3000/r/042", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.screenshot({ path: `${out}/r1-r042-top.png` });
await page.evaluate(() => window.scrollBy({ top: 600, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/r2-r042-mid.png` });
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/r3-r042-bottom.png` });
console.log("✓ r042 shots");

// pending ticket
await page.goto("http://localhost:3000/r/041", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/r4-r041-pending.png` });
console.log("✓ r041 pending");

// r042 top-crop (viewport-clipped, not fullpage — 2000px image cap)
await page.goto("http://localhost:3000/r/042", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.screenshot({
  path: `${out}/r0-r042-top.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});
console.log("✓ r042 top-crop");

await browser.close();
console.log("done");
