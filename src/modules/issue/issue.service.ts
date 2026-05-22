import type { IIssueRepository } from "./issue.interface";

export class IssueService {
    private issueRepository: IIssueRepository;

    constructor(issueRepository: IIssueRepository) {
        this.issueRepository = issueRepository;
    }

    public async createIssue(title: string, description: string, reporter_id: string, type: string) {
        const issue = await this.issueRepository.create({
            title,
            description,
            reporter_id,
            type
        });
        
        return issue;
    }
    public async updateIssue(id: string, title?: string, description?: string) {
        throw new Error("Method not implemented.");
    }
    public async deleteIssue(id: string) {
        throw new Error("Method not implemented.");
    }
    public async getAllIssues() {
        throw new Error("Method not implemented.");
    }
    public async getIssueById(id: string) {
        throw new Error("Method not implemented.");
    }
    public async getIssuesByReporterId(reporter_id: string) {
        throw new Error("Method not implemented.");
    }
    
}