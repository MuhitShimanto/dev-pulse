import type { IIssueRepository } from "./issue.interface";

export class IssueService {
  private issueRepository: IIssueRepository;

  constructor(issueRepository: IIssueRepository) {
    this.issueRepository = issueRepository;
  }

  public async createIssue(
    title: string,
    description: string,
    reporter_id: string,
    type: string,
  ) {
    const issue = await this.issueRepository.create({
      title,
      description,
      reporter_id,
      type,
    });

    return issue;
  }
  public async updateIssue(
    id: string,
    title?: string,
    description?: string,
    type?: string,
  ) {
    const updatedIssue = await this.issueRepository.update(id, {
        title, description, type
    });
    return updatedIssue;
  }
  public async deleteIssue(id: string) {
    return await this.issueRepository.delete(id);
  }
  public async getAllIssues(
    sort: string = "newest",
    type: string,
    status: string,
  ) {
    // Retrieve all issues with optional sorting and filtering
    const filter = {
      type,
      status,
    };
    const issues = await this.issueRepository.findAll(sort, filter);
    return issues;
  }
  public async getIssueById(id: string) {
    const issue = await this.issueRepository.findById(id);
    if (!issue) {
      return null;
    }

    const { reporter_id, ...issueWithoutReporterId } = issue;
    return issueWithoutReporterId;
  }
  public async getIssuesByReporterId(reporter_id: string) {
    throw new Error("Method not implemented.");
  }
}
