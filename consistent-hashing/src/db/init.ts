import sqlite3 from "sqlite3";
import path from "path";

const dbFiles = [
  "node1.sqlite",
  "node2.sqlite",
  "node3.sqlite",
  "node4.sqlite"
]

export const initDatabases = () => {
  dbFiles.forEach((el) => {
    const dbPath = path.join(__dirname, el)
    const db = new sqlite3.Database(dbPath)

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS kv_store (
          key TEXT PRIMARY KEY,
          value TEXT
        );
        `)
    });

    db.close()
  });

  console.log("Databases initialized")
}
