import { Pool } from "pg";
import config from "../config/index.js";
const pool = new Pool({
  connectionString: config.databaseUrl,
});

const initDb = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) CHECK (role IN ('contributor', 'maintainer')) NOT NULL DEFAULT 'contributor',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT,
            type VARCHAR(50) CHECK (type IN ('bug', 'feature_request')) NOT NULL,
            status VARCHAR(50) CHECK (status IN ('open', 'in_progress', 'resolved')) NOT NULL DEFAULT 'open',
            reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    console.log("🌐✅ Database initialized successfully");
  } catch (error) {
    throw new Error(`🌐❌ Failed to initialize database: ${error}`);
  }
};

export { pool, initDb };
