import { ApiEnvelope, BaseApi } from './BaseApi';

export interface LeaveTypeRecord {
  id: number;
  name: string;
}

export class LeaveApi extends BaseApi {
  listLeaveTypes(): Promise<ApiEnvelope<LeaveTypeRecord[]>> {
    return this.get<LeaveTypeRecord[]>('/leave/leave-types');
  }

  listLeavePeriods() {
    return this.get<unknown[]>('/leave/leave-periods');
  }
}
