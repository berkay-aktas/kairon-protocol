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

const url = "http://localhost:3000/demo";
console.log("→", url);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

await page.screenshot({ path: `${out}/d1-live.png` });
console.log("✓ d1-live");

await page.locator('button:has-text("ticket inbox")').click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/d2-inbox.png` });
console.log("✓ d2-inbox");

await page.locator('button:has-text("monad ledger")').click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/d3-ledger.png` });
console.log("✓ d3-ledger");

await page.locator('button:has-text("report")').click();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/d4-report.png` });
console.log("✓ d4-report");

// live session mid-sequence
await page.locator('button:has-text("live session")').click();
await page.waitForTimeout(5000);
await page.screenshot({ path: `${out}/d5-live-mid.png` });
console.log("✓ d5-live-mid");

await browser.close();
console.log("done");
