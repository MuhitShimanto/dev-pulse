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
    reporter_id: string;
    type: string;
}

export interface IUpdateIssueDTO {
    title?: string | undefined;
    description?: string | undefined;
    type?: string | undefined;
    status?: string | undefined;
}

// Repository Interface
export interface IIssueRepository {
    findAll(sort: string, filter: { type?: string; status?: string }): Promise<IIssue[]>;
    findById(id: string): Promise<IIssueDetails | null>;
    findByReporterId(reporter_id: string): Promise<IIssue[]>;
    create(data: ICreateIssueDTO): Promise<IIssue>;
    update(id: string, data: IUpdateIssueDTO): Promise<IIssue | null>;
    delete(id: string): Promise<boolean>;
}