import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import type { D1Database } from "@cloudflare/workers-types";

// Execute the actual migration and SQL against SQLite, rather than mocking SQL results.
export function testDatabase() {
  const sqlite = new DatabaseSync(":memory:");
  for (const file of ["0001_lead_ledger.sql", "0002_pipeline_health.sql", "0003_unverified_notifications.sql"]) sqlite.exec(readFileSync(`workers/migrations/${file}`, "utf8"));
  const db = {
    prepare(sql: string) {
      let values: (string | number | null)[] = [];
      const statement = {
        bind(...args: typeof values) { values = args; return statement; },
        async run() { const result = sqlite.prepare(sql).run(...values); return { success: true, meta: { changes: Number(result.changes) } }; },
        async first() { return sqlite.prepare(sql).get(...values) ?? null; },
        async all() { return { success: true, results: sqlite.prepare(sql).all(...values) }; },
      };
      return statement;
    },
  } as unknown as D1Database;
  return { db, sqlite };
}
