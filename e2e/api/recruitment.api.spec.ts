import { test, expect } from '@fixtures/test.fixture';
import { buildCandidate } from '@utils/dataFactory';

test.describe('API - Recruitment candidates', () => {
  test('creates a candidate and reads it back', { tag: '@smoke' }, async ({ recruitmentApi }) => {
    const input = buildCandidate();
    const created = await recruitmentApi.createCandidate(input);
    try {
      expect(created.id).toBeGreaterThan(0);
      const fetched = await recruitmentApi.getCandidate(created.id);
      expect(fetched.firstName).toBe(input.firstName);
      expect(fetched.lastName).toBe(input.lastName);
    } finally {
      await recruitmentApi.deleteCandidateIfExists(created.id);
    }
  });

  test('reads a candidate created by the fixture', async ({ recruitmentApi, candidate }) => {
    const fetched = await recruitmentApi.getCandidate(candidate.id!);
    expect(fetched.lastName).toBe(candidate.lastName);
  });

  test('deletes a candidate', async ({ recruitmentApi, candidate }) => {
    await recruitmentApi.deleteCandidate(candidate.id!);
    const res = await recruitmentApi.rawGet(`/recruitment/candidates/${candidate.id}`);
    // the record is gone: either an error status or an empty payload
    const body = res.ok() ? await res.json() : null;
    expect(!res.ok() || !body?.data).toBeTruthy();
  });
});
