import { APIResponse } from '@playwright/test';
import { ApiEnvelope, BaseApi } from './BaseApi';

export interface EmployeeRecord {
  empNumber: number;
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  employeeId: string;
}

export class EmployeeApi extends BaseApi {
  async create(input: EmployeeInput): Promise<EmployeeRecord> {
    const res = await this.post<EmployeeRecord>('/pim/employees', {
      firstName: input.firstName,
      middleName: '',
      lastName: input.lastName,
      empPicture: null,
      employeeId: input.employeeId,
    });
    return res.data;
  }

  /** Sends any body, used for negative tests. */
  createRaw(body: Record<string, unknown>): Promise<APIResponse> {
    return this.rawPost('/pim/employees', body);
  }

  list(limit = 10): Promise<ApiEnvelope<EmployeeRecord[]>> {
    return this.get<EmployeeRecord[]>('/pim/employees', { limit, offset: 0 });
  }

  async search(nameOrId: string): Promise<EmployeeRecord[]> {
    const res = await this.get<EmployeeRecord[]>('/pim/employees', {
      nameOrId,
      limit: 50,
      offset: 0,
    });
    return res.data;
  }

  async getPersonalDetails(empNumber: number): Promise<EmployeeRecord> {
    const res = await this.get<EmployeeRecord>(`/pim/employees/${empNumber}/personal-details`);
    return res.data;
  }

  async updateLastName(employee: EmployeeInput & { empNumber: number }, lastName: string) {
    return this.put(`/pim/employees/${employee.empNumber}/personal-details`, {
      firstName: employee.firstName,
      middleName: '',
      lastName,
      employeeId: employee.employeeId,
      otherId: '',
      drivingLicenseNo: '',
      drivingLicenseExpiredDate: null,
      gender: null,
      maritalStatus: null,
      birthday: null,
      nationalityId: null,
    });
  }

  async delete(empNumber: number): Promise<void> {
    await this.remove('/pim/employees', [empNumber]);
  }

  /** Clean-up helper that never throws. */
  async deleteIfExists(empNumber?: number): Promise<void> {
    if (empNumber === undefined) return;
    await this.rawDelete('/pim/employees', [empNumber]);
  }
}
