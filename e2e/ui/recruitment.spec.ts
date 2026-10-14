import { test } from '@fixtures/test.fixture';
import { buildCandidate } from '@utils/dataFactory';

test.describe('Recruitment - candidates', () => {
  test('adds a new candidate', { tag: '@smoke' }, async ({ recruitmentPage }) => {
    const data = buildCandidate();
    await recruitmentPage.addCandidate(data);
    try {
      await recruitmentPage.searchCandidate(data.fullName);
      await recruitmentPage.expectCandidateListed(data.fullName);
    } finally {
      await recruitmentPage.deleteCandidateIfExists(data.fullName);
    }
  });

  test('searches a candidate by name', async ({ recruitmentPage, candidate }) => {
    await recruitmentPage.searchCandidate(candidate.fullName);
    await recruitmentPage.expectCandidateListed(candidate.fullName);
  });

  test('deletes a candidate', async ({ recruitmentPage, candidate }) => {
    await recruitmentPage.deleteCandidate(candidate.fullName);
  });
});
