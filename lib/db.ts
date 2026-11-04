import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const databasePath =
  process.env.PORTFOLIO_DB_PATH || path.join(process.cwd(), "data", "portfolio.db");

declare global {
  var portfolioDatabase: Database.Database | undefined;
}

export function getDatabase() {
  if (!globalThis.portfolioDatabase) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
    const database = new Database(databasePath);
    database.pragma("journal_mode = WAL");
    database.exec(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    globalThis.portfolioDatabase = database;
  }

  return globalThis.portfolioDatabase;
}
