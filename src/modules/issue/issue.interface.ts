// Entity Interface
export interface IIssue {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    reporter_id: string;
    created_at: Date;
    updated_at: Date;
}

// DTOs
export interface ICreateIssueDTO {
    title: string;
    description: string;
    reporter_id: string;
    type: string;
}

export interface IUpdateIssueDTO {
    title?: string;
    description?: string;
    type?: string;
    status?: string;
}

// Repository Interface
export interface IIssueRepository {
    findById(id: string): Promise<IIssue | null>;
    findByReporterId(reporter_id: string): Promise<IIssue[]>;
    create(data: ICreateIssueDTO): Promise<IIssue>;
    update(id: string, data: IUpdateIssueDTO): Promise<IIssue | null>;
    delete(id: string): Promise<boolean>;
}