/**
 * @file issue.repository.ts
 * @description This file contains the implementation of the IssueRepository class, which is responsible for handling all database operations related to issues. It implements the IIssueRepository interface defined in issue.interface.ts. The class uses a PostgreSQL connection pool to execute queries and manage transactions. Each method corresponds to a specific CRUD operation, allowing for creating, reading, updating, and deleting issues in the database. The repository pattern helps to abstract away the database logic from the rest of the application, making it easier to maintain and test.
 */

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
  /**
   * @desc Creates a new issue in the database using the provided data. It constructs an SQL query to insert a new record into the "issues" table with the specified title, description, reporter_id, and type. The method returns the newly created issue as an IIssue object, which includes all relevant fields such as id, title, description, type, status, reporter_id, created_at, and updated_at. The reporter_id is included in the data parameter to associate the issue with the user who reported it.
   * @param {ICreateIssueDTO & { reporter_id: string }} data - The data transfer object containing the information needed to create a new issue, including the title, description, type, and the ID of the reporter.
   * @returns {Promise<IIssue>} - A promise that resolves to the newly created issue object.
   */
  public async create(
    data: ICreateIssueDTO & {
      reporter_id: string;
    },
  ): Promise<IIssue> {
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
  /**
   * @desc Updates an existing issue in the database based on the provided ID and update data. It constructs an SQL query to update the issue's title, description, and type fields using the COALESCE function to retain existing values if new ones are not provided. The method returns the updated issue as an IIssue object if the update is successful, or null if no issue with the specified ID exists. Additionally, it updates the "updated_at" timestamp to reflect the time of the update.
   * @param {string} id - The ID of the issue to be updated.
   * @param {IUpdateIssueDTO} data - The data transfer object containing the fields to be updated for the issue.
   * @returns {Promise<IIssue | null>} - A promise that resolves to the updated issue object or null if the issue does not exist.
   */
  public async update(
    id: string,
    data: IUpdateIssueDTO,
  ): Promise<IIssue | null> {
    const query = `
      UPDATE issues
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          type = COALESCE($3, type),
          status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *
    `;
    const values = [data.title, data.description, data.type, data.status, id];
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
  /**
   * @desc Deletes an issue from the database based on the provided ID. It constructs an SQL query to remove the issue from the "issues" table and returns a boolean indicating whether the deletion was successful. The method checks the number of rows affected by the delete operation to determine if the issue was found and deleted, returning true if at least one row was deleted and false otherwise.
   * @param {string} id - The ID of the issue to be deleted.
   * @returns {Promise<boolean>} - A promise that resolves to true if the issue was successfully deleted, or false if no issue with the specified ID exists.
   */
  public async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM issues
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return (result.rowCount as number) > 0;
  }
  /**
   * @desc Retrieves an issue from the database based on the provided ID. It constructs an SQL query to select the issue details from the "issues" table and also retrieves the reporter's information from the "users" table. The method returns an IIssueDetails object containing the issue details along with the reporter's information if the issue is found, or null if no issue with the specified ID exists. The returned object includes fields such as title, description, type, status, reporter_id, created_at, updated_at, and a nested reporter object with the reporter's id, name, and role.
   * @param {string} id - The ID of the issue to be retrieved.
   * @returns {Promise<IIssueDetails | null>} - A promise that resolves to the issue details object if found, or null if no issue with the specified ID exists.
   */
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
  /**
   * @desc Retrieves all issues from the database with optional sorting and filtering. It constructs an SQL query to select issues from the "issues" table based on the provided sort order (newest or oldest) and filter criteria (type and status). The method returns an array of IIssue objects that match the specified sorting and filtering conditions. The sorting is applied based on the "created_at" timestamp, and the filtering allows for narrowing down the results by issue type and status.
   * @param {string} sort - The sorting order for the issues, either "newest" or "oldest".
   * @param {Object} filter - An object containing optional filter criteria for the issues, including type and status.
   * @returns {Promise<IIssue[]>} - A promise that resolves to an array of issue objects that match the sorting and filtering criteria.
   */
  public async findByReporterId(reporter_id: string): Promise<IIssue[]> {
    throw new Error("Method not implemented.");
  }
  /**
   * @desc Retrieves all issues from the database with optional sorting and filtering. It constructs an SQL query to select issues from the "issues" table based on the provided sort order (newest or oldest) and filter criteria (type and status). The method returns an array of IIssue objects that match the specified sorting and filtering conditions. The sorting is applied based on the "created_at" timestamp, and the filtering allows for narrowing down the results by issue type and status.
   * @param {string} sort - The sorting order for the issues, either "newest" or "oldest".
   * @param {Object} filter - An object containing optional filter criteria for the issues, including type and status.
   * @returns {Promise<IIssue[]>} - A promise that resolves to an array of issue objects that match the sorting and filtering criteria.
   */
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
    const issues = result.rows;

    // Attach reporter information to each issue
    const issuesWithReporter = await Promise.all(
      issues.map(async (issue) => {
        const userResult = await this.pool.query(
          `SELECT id, name, role FROM users WHERE id = $1`,
          [issue.reporter_id],
        );
        const { reporter_id, created_at, updated_at, ...trimIssue } = issue;
        return {
          ...trimIssue,
          reporter: userResult.rows[0] || null,
          created_at,
          updated_at,
        };
      }),
    );
    return issuesWithReporter;
  }
}
