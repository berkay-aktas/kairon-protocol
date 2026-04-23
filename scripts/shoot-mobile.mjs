import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";

const out = "/tmp/kairon-shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const iphone = devices["iPhone 13"];
const ctx = await browser.newContext({
  ...iphone,
  colorScheme: "light",
});
const page = await ctx.newPage();

// landing
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/m1-landing.png`, fullPage: true });
console.log("✓ mobile landing");

// /demo inbox
await page.goto("http://localhost:3000/demo", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.locator('button:has-text("ticket inbox")').click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/m2-demo-inbox.png` });
console.log("✓ mobile demo inbox");

// /r/042
await page.goto("http://localhost:3000/r/042", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/m3-r042.png`, fullPage: true });
console.log("✓ mobile /r/042");

await browser.close();
console.log("done");
