const base = '/web/index.php';

/** All page URLs in one place. */
export const routes = {
  login: `${base}/auth/login`,
  dashboard: `${base}/dashboard/index`,

  pimList: `${base}/pim/viewEmployeeList`,
  addEmployee: `${base}/pim/addEmployee`,
  myInfo: `${base}/pim/viewMyDetails`,

  users: `${base}/admin/viewSystemUsers`,
  addUser: `${base}/admin/saveSystemUser`,

  leaveList: `${base}/leave/viewLeaveList`,
  addEntitlement: `${base}/leave/addLeaveEntitlement`,
  assignLeave: `${base}/leave/assignLeave`,

  candidates: `${base}/recruitment/viewCandidates`,
  addCandidate: `${base}/recruitment/addCandidate`,
};

/** API fragments used to wait for search results. */
export const api = {
  employees: '/api/v2/pim/employees',
  users: '/api/v2/admin/users',
  candidates: '/api/v2/recruitment/candidates',
  leaveRequests: '/api/v2/leave/employees/leave-requests',
};
