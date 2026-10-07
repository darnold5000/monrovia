#!/usr/bin/env node
/**
 * Print pending Supabase migration SQL for manual apply in Dashboard → SQL Editor.
 *
 * Usage:
 *   npm run db:migrations
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = join(root, "supabase", "migrations");

const files = readdirSync(migrationsDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();

console.log("Apply these in Supabase Dashboard → SQL Editor (in order):\n");
for (const file of files) {
  console.log(`--- ${file} ---`);
  console.log(readFileSync(join(migrationsDir, file), "utf8").trim());
  console.log("\n");
}
