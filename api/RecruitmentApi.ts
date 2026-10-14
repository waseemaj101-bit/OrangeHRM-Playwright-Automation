import { formatDate } from '@utils/helpers';
import { CandidateData } from '@utils/dataFactory';
import { BaseApi } from './BaseApi';

export interface CandidateRecord {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

export class RecruitmentApi extends BaseApi {
  async createCandidate(input: CandidateData): Promise<CandidateRecord> {
    const res = await this.post<CandidateRecord>('/recruitment/candidates', {
      firstName: input.firstName,
      middleName: '',
      lastName: input.lastName,
      email: input.email,
      contactNumber: input.phone,
      keywords: '',
      comment: '',
      dateOfApplication: formatDate(new Date(), 'yyyy-mm-dd'),
      consentToKeepData: false,
      vacancyId: null,
    });
    return res.data;
  }

  async getCandidate(id: number): Promise<CandidateRecord> {
    return (await this.get<CandidateRecord>(`/recruitment/candidates/${id}`)).data;
  }

  async deleteCandidate(id: number): Promise<void> {
    await this.remove('/recruitment/candidates', [id]);
  }

  async deleteCandidateIfExists(id?: number): Promise<void> {
    if (id === undefined) return;
    await this.rawDelete('/recruitment/candidates', [id]);
  }
}
