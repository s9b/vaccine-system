const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'data', 'db.sqlite');
const db = new Database(dbPath);

// Set up WAL mode for better concurrency
db.pragma('journal_mode = WAL');

const createSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clinics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clinic_id INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      duration_minutes INTEGER NOT NULL,
      capacity INTEGER NOT NULL,
      available INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clinic_id) REFERENCES clinics (id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slot_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      seats_reserved INTEGER NOT NULL,
      status TEXT CHECK(status IN ('PENDING', 'CONFIRMED', 'FAILED')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (slot_id) REFERENCES slots (id)
    );
  `);
};

createSchema();

module.exports = db;
