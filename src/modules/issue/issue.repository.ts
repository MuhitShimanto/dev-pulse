import type { Pool } from "pg";
import type {
  ICreateIssueDTO,
  IIssue,
  IIssueDetails,
  IIssueRepository,
  IUpdateIssueDTO,
} from "./issue.interface";

export class IssueRepository implements IIssueRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
  public async create(data: ICreateIssueDTO): Promise<IIssue> {
    const { title, description, reporter_id, type } = data;
    const query = `
        INSERT INTO issues (title, description, reporter_id, type)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [title, description, reporter_id, type];
    const issue = await this.pool.query(query, values);
    return issue.rows[0] as IIssue;
  }
  public async update(
    id: string,
    data: IUpdateIssueDTO,
  ): Promise<IIssue | null> {
    const query = `
      UPDATE issues
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          type = COALESCE($3, type)
      WHERE id = $4
      RETURNING *
    `;
    const values = [data.title, data.description, data.type, id];
    const result = await this.pool.query(query, values);
    if (!result.rows[0]) {
      return null;
    }
    await this.pool.query(
      `
      UPDATE issues
      SET updated_at = NOW()
      WHERE id = $1
     `,
      [id],
    );
    return result.rows[0] as IIssue;
  }
  public async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM issues
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rowCount as number > 0;
  }
  public async findById(id: string): Promise<IIssueDetails | null> {
    const query = `
      SELECT *
      FROM issues
      WHERE id = $1
    `;
    const issueResult = await this.pool.query(query, [id]);
    if (!issueResult.rows[0]) {
      return null;
    }
    const reporterQuery = `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `;
    const reporter = await this.pool.query(reporterQuery, [
      issueResult.rows[0]?.reporter_id,
    ]);
    const { created_at, updated_at, ...trimIssue } = issueResult.rows[0];
    return {
      ...trimIssue,
      reporter: reporter.rows[0],
      created_at,
      updated_at,
    };
  }
  public async findByReporterId(reporter_id: string): Promise<IIssue[]> {
    throw new Error("Method not implemented.");
  }
  public async findAll(
    sort: "newest" | "oldest",
    filter: { type?: string; status?: string },
  ): Promise<IIssue[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    let query = `SELECT * FROM issues`;

    // Filtering
    if (filter.type) {
      values.push(filter.type);
      conditions.push(`type = $${values.length}`);
    }

    if (filter.status) {
      values.push(filter.status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    // Sorting
    const orderBy = sort === "oldest" ? "created_at ASC" : "created_at DESC";

    query += ` ORDER BY ${orderBy}`;

    const result = await this.pool.query(query, values);
    return result.rows as IIssue[];
  }
}
