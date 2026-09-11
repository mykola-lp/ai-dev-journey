import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

// Single shared module for all SQLite access. Nothing outside this file
// should import `better-sqlite3` directly — every query and every table
// definition lives here so the storage layer stays swappable (e.g. to
// Postgres later) without touching route handlers.

const DB_PATH = path.join(process.cwd(), "data", "kidsstore.db");

declare global {
  // eslint-disable-next-line no-var
  var __kidsstoreDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  const schema = fs.readFileSync(path.join(process.cwd(), "src", "lib", "schema.sql"), "utf-8");
  db.exec(schema);

  return db;
}

// Reused across hot reloads in dev, and across requests in production.
export function getDb(): Database.Database {
  if (!global.__kidsstoreDb) {
    global.__kidsstoreDb = createConnection();
  }
  return global.__kidsstoreDb;
}

export type CallbackRequestInput = {
  name: string;
  phone: string;
  message?: string;
  locale: string;
};

export function insertCallbackRequest(input: CallbackRequestInput) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO callback_requests (name, phone, message, locale)
     VALUES (@name, @phone, @message, @locale)`,
  );
  const result = stmt.run({
    name: input.name,
    phone: input.phone,
    message: input.message ?? null,
    locale: input.locale,
  });
  return result.lastInsertRowid;
}
