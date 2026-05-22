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
}
