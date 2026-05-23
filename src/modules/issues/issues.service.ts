import { pool } from "../../config/db";

const createIssueIntoDb = async (payload: any, reporter_id: number) => {
  const { title, description, type, status } = payload;

  if (!title || !description || !type || !reporter_id) {
    throw new Error("All fields are required");
  }

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, status, reporter_id) VALUES($1,$2,$3,$4,$5)
    RETURNING *`,
    [title, description, type, status, reporter_id],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (filters: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  let query = `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues`;
  const queryValues: any[] = [];
  const whereClauses: string[] = [];

  if (filters.type) {
    queryValues.push(filters.type);
    whereClauses.push(`type = $${queryValues.length}`);
  }

  if (filters.status) {
    queryValues.push(filters.status);
    whereClauses.push(`status = $${queryValues.length}`);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(" AND ");
  }

  if (filters.sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  const { rows: issues } = await pool.query(query, queryValues);

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const userQuery = `SELECT id, name, role FROM users WHERE id IN (${reporterIds.map((_, i) => `$${i + 1}`).join(", ")})`;
  const { rows: users } = await pool.query(userQuery, reporterIds);

  const userMap = users.reduce((acc: any, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const result = issues.map((issue) => {
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: userMap[reporter_id] || null,
    };
  });

  return result;
};

export const issuesService = {
  createIssueIntoDb,
  getAllIssuesFromDB,
};
