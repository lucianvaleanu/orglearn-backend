const domainRepository = require('../repositories/DomainRepository');

class DomainService {
  async getDomainsWithProgress(userId) {
    const domains = await domainRepository.getAllWithProgress(userId);

    const domainStats = domains.map((domain) => {
      const scenarios = Array.isArray(domain.scenarios) ? domain.scenarios : [];
      const totalScenarios = scenarios.length;
      const completedScenarios = scenarios.reduce((count, scenario) => {
        const progressEntry = Array.isArray(scenario.userProgressEntries)
          ? scenario.userProgressEntries[0]
          : null;
        if (progressEntry && progressEntry.status === 'completed') {
          return count + 1;
        }
        return count;
      }, 0);

      return {
        domainId: domain.id,
        title: domain.title,
        description: domain.description,
        totalScenarios,
        completedScenarios,
        masteryStatus: `${completedScenarios}/${totalScenarios}`,
        isMastered: totalScenarios > 0 && completedScenarios === totalScenarios
      };
    });

    const masteredCount = domainStats.filter((domain) => domain.isMastered).length;
    const totalDomains = domainStats.length;

    return {
      domains: domainStats,
      summary: {
        masteredCount,
        totalDomains,
        label: `${masteredCount}/${totalDomains} Domains Mastered`
      }
    };
  }
}

module.exports = new DomainService();
