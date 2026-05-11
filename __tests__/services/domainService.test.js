const domainRepository = require('../../repositories/DomainRepository');
const domainService = require('../../services/DomainService');

jest.mock('../../repositories/DomainRepository', () => ({
  getAllWithProgress: jest.fn()
}));

describe('DomainService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 2/4 mastery status for a partially completed domain', async () => {
    const domains = [
      {
        id: 'domain-1',
        title: 'Communication',
        description: 'Desc',
        scenarios: [
          { userProgressEntries: [{ status: 'completed' }] },
          { userProgressEntries: [{ status: 'completed' }] },
          { userProgressEntries: [{ status: 'in_progress' }] },
          { userProgressEntries: [] }
        ]
      }
    ];

    domainRepository.getAllWithProgress.mockResolvedValue(domains);

    const result = await domainService.getDomainsWithProgress('user-1');

    expect(result.domains[0].masteryStatus).toBe('2/4');
    expect(result.summary.label).toBe('0/1 Domains Mastered');
  });

  it('should mark a domain as mastered when all scenarios are completed', async () => {
    const domains = [
      {
        id: 'domain-2',
        title: 'Leadership',
        description: 'Desc',
        scenarios: [
          { userProgressEntries: [{ status: 'completed' }] },
          { userProgressEntries: [{ status: 'completed' }] }
        ]
      }
    ];

    domainRepository.getAllWithProgress.mockResolvedValue(domains);

    const result = await domainService.getDomainsWithProgress('user-1');

    expect(result.domains[0].isMastered).toBe(true);
    expect(result.summary.label).toBe('1/1 Domains Mastered');
  });

  it('should handle empty domains safely', async () => {
    domainRepository.getAllWithProgress.mockResolvedValue([]);

    const result = await domainService.getDomainsWithProgress('user-1');

    expect(result.summary.label).toBe('0/0 Domains Mastered');
  });
});
