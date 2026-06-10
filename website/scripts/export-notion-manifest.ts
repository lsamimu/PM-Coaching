/**
 * Export premium product specs to JSON for Notion workspace builder.
 * Run: npx tsx scripts/export-notion-manifest.ts
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import { premiumProducts } from "../src/lib/products";

const out = resolve(__dirname, "../../execution/notion/manifest.json");
writeFileSync(out, JSON.stringify(premiumProducts, null, 2));
console.log(`Wrote ${premiumProducts.length} products → ${out}`);
