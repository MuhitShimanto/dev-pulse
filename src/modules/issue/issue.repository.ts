import type { Pool } from "pg";
import type {
  ICreateIssueDTO,
  IIssue,
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
    throw new Error("Method not implemented.");
  }
  public async delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public async findById(id: string): Promise<IIssue | null> {
    throw new Error("Method not implemented.");
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
