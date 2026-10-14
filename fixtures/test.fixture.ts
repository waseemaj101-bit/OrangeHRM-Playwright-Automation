import { APIRequestContext, test as base, expect } from '@playwright/test';
import { env } from '@config/env.config';
import { AdminApi } from '@api/AdminApi';
import { EmployeeApi } from '@api/EmployeeApi';
import { LeaveApi } from '@api/LeaveApi';
import { RecruitmentApi } from '@api/RecruitmentApi';
import { AdminPage } from '@pages/AdminPage';
import { DashboardPage } from '@pages/DashboardPage';
import { LeavePage } from '@pages/LeavePage';
import { LoginPage } from '@pages/LoginPage';
import { MyInfoPage } from '@pages/MyInfoPage';
import { PimPage } from '@pages/PimPage';
import { RecruitmentPage } from '@pages/RecruitmentPage';
import {
  buildCandidate,
  buildEmployee,
  CandidateData,
  EmployeeData,
} from '@utils/dataFactory';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  adminPage: AdminPage;
  leavePage: LeavePage;
  recruitmentPage: RecruitmentPage;
  myInfoPage: MyInfoPage;
};

type ApiFixtures = {
  /** Authenticated API context (re-uses the session saved by auth.setup.ts). */
  apiContext: APIRequestContext;
  employeeApi: EmployeeApi;
  adminApi: AdminApi;
  recruitmentApi: RecruitmentApi;
  leaveApi: LeaveApi;
};

type DataFixtures = {
  /** A fresh employee, created through the API before the test and removed after it. */
  employee: EmployeeData;
  /** A fresh candidate, created through the API before the test and removed after it. */
  candidate: CandidateData;
};

export const test = base.extend<PageFixtures & ApiFixtures & DataFixtures>({
  // ---------- page objects ----------
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  leavePage: async ({ page }, use) => {
    await use(new LeavePage(page));
  },
  recruitmentPage: async ({ page }, use) => {
    await use(new RecruitmentPage(page));
  },
  myInfoPage: async ({ page }, use) => {
    await use(new MyInfoPage(page));
  },

  // ---------- API clients ----------
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.baseURL,
      storageState: env.authFile,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    await use(context);
    await context.dispose();
  },
  employeeApi: async ({ apiContext }, use) => {
    await use(new EmployeeApi(apiContext));
  },
  adminApi: async ({ apiContext }, use) => {
    await use(new AdminApi(apiContext));
  },
  recruitmentApi: async ({ apiContext }, use) => {
    await use(new RecruitmentApi(apiContext));
  },
  leaveApi: async ({ apiContext }, use) => {
    await use(new LeaveApi(apiContext));
  },

  // ---------- test data (created by API = fast and independent of the UI) ----------
  employee: async ({ employeeApi }, use) => {
    const data = buildEmployee();
    const created = await employeeApi.create(data);
    data.empNumber = created.empNumber;
    await use(data);
    await employeeApi.deleteIfExists(data.empNumber).catch(() => undefined);
  },

  candidate: async ({ recruitmentApi }, use) => {
    const data = buildCandidate();
    const created = await recruitmentApi.createCandidate(data);
    data.id = created.id;
    await use(data);
    await recruitmentApi.deleteCandidateIfExists(data.id).catch(() => undefined);
  },
});

export { expect };
