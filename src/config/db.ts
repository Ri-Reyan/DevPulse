import { Pool } from "pg";
import { config } from "./secretEnvs";

export const pool = new Pool({
  connectionString: config.neon_secret,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      email VARCHAR(30) UNIQUE NOT NULL,
      password VARCHAR(300) NOT NULL CHECK(LENGTH(password) >= 8),
      role VARCHAR(20) CHECK(role in ('contributor', 'maintainer')) DEFAULT 'contributor',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW())`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL CHECK(LENGTH(description) >= 20),
        type VARCHAR(20) NOT NULL CHECK(type in ('bug', 'feature_request')),
        status VARCHAR(20) CHECK(status in('open', 'in_progress', 'resolved')) DEFAULT 'open',
        reporter_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`);

    console.log("Database connected successfully");
  } catch (error: any) {
    console.log(`Database connection failed error: ${error.message} `);
  }
};

export default initDB;
