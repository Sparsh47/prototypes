import sqlite3 from "sqlite3";
import path from "path";

export const getDB = (nodeName: string) => {
  const dbPath = path.join(__dirname, `../db/${nodeName}.sqlite`)
  return new sqlite3.Database(dbPath)
}
