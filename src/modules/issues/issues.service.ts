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

const getSingleIssueFromDB = async (id: string) => {
  const issueQuery = `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id = $1`;
  const { rows: issues } = await pool.query(issueQuery, [id]);

  if (issues.length === 0) return null;

  const issue = issues[0];

  const userQuery = `SELECT id, name, role FROM users WHERE id = $1`;
  const { rows: users } = await pool.query(userQuery, [issue.reporter_id]);

  const { reporter_id, ...issueData } = issue;

  return {
    ...issueData,
    reporter: users[0] || null,
  };
};

const updateIssueInDB = async (
  id: string,
  user: { id: number; role: string },
  payload: {
    title?: string;
    description?: string;
    type?: string;
    status?: string;
  },
) => {
  const checkQuery = `SELECT * FROM issues WHERE id = $1`;
  const { rows: issues } = await pool.query(checkQuery, [id]);

  if (issues.length === 0) {
    return { errorStatus: 404, message: "Requested resource does not exist" };
  }

  const currentIssue = issues[0];

  if (user.role === "contributor") {
    if (currentIssue.reporter_id !== user.id) {
      return {
        errorStatus: 403,
        message: "Forbidden: You can only update your own issues",
      };
    }

    if (currentIssue.status !== "open") {
      return {
        errorStatus: 409,
        message: "Conflict: Cannot update an issue that is not open",
      };
    }
  }

  const fields = ["title", "description", "type", "status"];
  const updateClauses: string[] = [];
  const queryValues: any[] = [];

  fields.forEach((field) => {
    if (payload[field as keyof typeof payload] !== undefined) {
      queryValues.push(payload[field as keyof typeof payload]);
      updateClauses.push(`${field} = $${queryValues.length}`);
    }
  });

  if (updateClauses.length === 0) {
    return {
      errorStatus: 400,
      message: "Bad Request: No fields provided for update",
    };
  }

  updateClauses.push(`updated_at = NOW()`);

  queryValues.push(id);
  const mainQuery = `UPDATE issues SET ${updateClauses.join(", ")} WHERE id = $${queryValues.length} RETURNING *`;

  const { rows: updatedRows } = await pool.query(mainQuery, queryValues);
  return { success: true, data: updatedRows[0] };
};

export const issuesService = {
  createIssueIntoDb,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
};
