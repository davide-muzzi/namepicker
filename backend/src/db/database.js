import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "../../data/db.sqlite");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database");

  db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
    if (pragmaErr) {
      console.error("Failed to enable foreign keys:", pragmaErr.message);
      process.exit(1);
    }
  });
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
