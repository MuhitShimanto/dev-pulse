/**
 * @file issue.interface.ts
 * @description This file defines the interfaces for the Issue entity, including the main entity interface, DTOs for creating and updating issues, and the repository interface for data access operations.
 */

// Entity Interface
export interface IIssue {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "open" | "in_progress" | "resolved";
  reporter_id: string;
  created_at: Date;
  updated_at: Date;
}
export interface IIssueDetails extends IIssue {
  reporter: {
    id: string;
    name: string;
    role: string;
  };
}

// DTOs
export interface ICreateIssueDTO {
  title: string;
  description: string;
  type: string;
}

export interface IUpdateIssueDTO {
  title?: string | undefined;
  description?: string | undefined;
  type?: string | undefined;
  status?: "open" | "in_progress" | "resolved" | undefined;
}

// Repository Interface
export interface IIssueRepository {
  findAll(
    sort: string,
    filter: { type?: string; status?: string },
  ): Promise<IIssue[]>;
  findById(id: string): Promise<IIssueDetails | null>;
  findByReporterId(reporter_id: string): Promise<IIssue[]>;
  create(
    data: ICreateIssueDTO & {
      reporter_id: string;
    },
  ): Promise<IIssue>;
  update(id: string, data: IUpdateIssueDTO): Promise<IIssue | null>;
  delete(id: string): Promise<boolean>;
}
