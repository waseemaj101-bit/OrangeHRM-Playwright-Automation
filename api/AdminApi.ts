import { ApiEnvelope, BaseApi } from './BaseApi';

export interface UserRecord {
  id: number;
  userName: string;
  status: boolean;
  userRole?: { id: number; name: string };
}

export interface UserInput {
  username: string;
  password: string;
  empNumber: number;
  userRoleId: number;
}

export interface JobTitleRecord {
  id: number;
  title: string;
  description?: string | null;
  note?: string | null;
}

export class AdminApi extends BaseApi {
  // ---------- system users ----------
  async createUser(input: UserInput): Promise<UserRecord> {
    const res = await this.post<UserRecord>('/admin/users', {
      username: input.username,
      password: input.password,
      status: true,
      userRoleId: input.userRoleId,
      empNumber: input.empNumber,
    });
    return res.data;
  }

  async searchUsers(username: string): Promise<UserRecord[]> {
    const res = await this.get<UserRecord[]>('/admin/users', {
      username,
      limit: 50,
      offset: 0,
      sortField: 'u.userName',
      sortOrder: 'ASC',
    });
    return res.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.remove('/admin/users', [id]);
  }

  async deleteUserIfExists(id?: number): Promise<void> {
    if (id === undefined) return;
    await this.rawDelete('/admin/users', [id]);
  }

  // ---------- job titles ----------
  async createJobTitle(input: { title: string; description: string; note: string }) {
    const res = await this.post<JobTitleRecord>('/admin/job-titles', {
      ...input,
      specification: null,
    });
    return res.data;
  }

  listJobTitles(): Promise<ApiEnvelope<JobTitleRecord[]>> {
    return this.get<JobTitleRecord[]>('/admin/job-titles', { limit: 0, offset: 0 });
  }

  async getJobTitle(id: number): Promise<JobTitleRecord> {
    return (await this.get<JobTitleRecord>(`/admin/job-titles/${id}`)).data;
  }

  async deleteJobTitle(id: number): Promise<void> {
    await this.remove('/admin/job-titles', [id]);
  }

  async deleteJobTitleIfExists(id?: number): Promise<void> {
    if (id === undefined) return;
    await this.rawDelete('/admin/job-titles', [id]);
  }
}
