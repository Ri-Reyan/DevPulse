import { pool } from "../../config/db";
import bcrypt from "bcrypt";

export const createUserIntoDb = async (payload: any) => {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await pool.query(
    `
    INSERT INTO users (name, email, password) VALUES($1, $2, $3)
    RETURNING id,name,email,role,created_at,updated_at`,
    [name, email, hashedPass],
  );

  return user.rows[0];
};

const FindUserFromDb = async (payload: any) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user: any = await pool.query(
    `
    SELECT * FROM users
    WHERE email=$1`,
    [email],
  );

  if (user.row.length == 0) {
    throw new Error("Invalid credentials!");
  }

  const matchedPass = await bcrypt.compare(password, user.rows[0].password);

  if (!matchedPass) {
    throw new Error("Invalid credentials!");
  }

  return user.rows[0];
};

export const authService = {
  createUserIntoDb,
  FindUserFromDb,
};
