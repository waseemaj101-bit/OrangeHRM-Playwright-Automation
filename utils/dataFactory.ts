import { faker } from '@faker-js/faker';
import adminData from '@data/admin.data.json';

/** Letters only, so names never break a locator or a form rule. */
const lettersOnly = (text: string): string => text.replace(/[^a-zA-Z]/g, '');

/** Short random suffix that keeps every generated record unique. */
const uniqueTag = (length = 5): string =>
  faker.string.alpha({ length, casing: 'upper' });

export interface EmployeeData {
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId: string;
  empNumber?: number; // set when the employee is created through the API
}

export interface SystemUserData {
  role: string;
  status: string;
  employeeName: string;
  username: string;
  password: string;
}

export interface CandidateData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  id?: number; // set when the candidate is created through the API
}

export interface AddressData {
  street: string;
  city: string;
}

export interface JobTitleData {
  title: string;
  description: string;
  note: string;
}

export function buildEmployee(): EmployeeData {
  const firstName = lettersOnly(faker.person.firstName());
  const lastName = `${lettersOnly(faker.person.lastName())}${uniqueTag()}`;
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    employeeId: `QA${faker.string.numeric(7)}`,
  };
}

export function buildSystemUser(
  employeeName: string,
  role: string = adminData.roles.ess,
): SystemUserData {
  return {
    role,
    status: adminData.status.enabled,
    employeeName,
    username: `qa_${faker.string.alphanumeric(8).toLowerCase()}`,
    // meets the default policy: upper, lower, number, symbol, 7+ chars
    password: `Qa@1${faker.string.alphanumeric(8)}`,
  };
}

export function buildCandidate(): CandidateData {
  const firstName = lettersOnly(faker.person.firstName());
  const lastName = `${lettersOnly(faker.person.lastName())}${uniqueTag()}`;
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName}.${lastName}@example.com`.toLowerCase(),
    phone: faker.string.numeric(10),
  };
}

export function buildAddress(): AddressData {
  return {
    street: faker.location.streetAddress(),
    city: lettersOnly(faker.location.city()),
  };
}

export function buildJobTitle(): JobTitleData {
  return {
    title: `QA Title ${uniqueTag(6)}`,
    description: faker.lorem.sentence(),
    note: faker.lorem.words(3),
  };
}

/** A value that cannot exist, for "no records" searches. */
export function buildUnknownId(): string {
  return faker.string.alpha({ length: 8, casing: 'upper' });
}
