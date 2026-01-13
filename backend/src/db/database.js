import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "../../db.sqlite");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite DB:", err);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

// Initialize schema
const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema, (err) => {
  if (err) {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  }
  console.log("Database schema initialized");
});
