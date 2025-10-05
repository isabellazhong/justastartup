import { CompanyOverview, StartupMarketAnalysis, PitchDeckData } from '../types/alphavantage';
import { DataExtractionMiddleware } from '../middlewares/dataExtraction';
import alphaVantageService from './alphavantage';

/**
 * Service focused on startup market analysis and competitive intelligence
 */
class MarketAnalysisService {

  /**
   * Analyze a specific company/competitor for startup market research
   */
  async analyzeCompetitor(symbol: string): Promise<StartupMarketAnalysis | null> {
    try {
      const companyData = await alphaVantageService.getCompanyOverview(symbol);
      
      if (!companyData) {
        return null;
      }

      return DataExtractionMiddleware.extractStartupAnalysis(companyData);
    } catch (error) {
      console.error(`Error analyzing competitor ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Generate pitch deck data for a specific market/competitor
   */
  async generatePitchDeckData(symbol: string): Promise<PitchDeckData | null> {
    try {
      const companyData = await alphaVantageService.getCompanyOverview(symbol);
      
      if (!companyData) {
        return null;
      }

      return DataExtractionMiddleware.extractPitchDeckData(companyData);
    } catch (error) {
      console.error(`Error generating pitch deck data for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Analyze multiple competitors for comprehensive market research
   */
  async analyzeMarketLandscape(symbols: string[]): Promise<{
    competitors: StartupMarketAnalysis[];
    marketInsights: {
      averageMarketCap: number;
      averageProfitMargin: number;
      averageGrowthRate: number;
      competitionLevel: 'Low' | 'Medium' | 'High';
      industryTrends: string[];
      opportunityScore: number; // 1-10 scale
    };
  }> {
    try {
      const competitors: StartupMarketAnalysis[] = [];
      
      // Analyze each competitor
      for (const symbol of symbols) {
        const analysis = await this.analyzeCompetitor(symbol);
        if (analysis) {
          competitors.push(analysis);
        }
      }

      if (competitors.length === 0) {
        throw new Error('No valid competitor data found');
      }

      // Calculate market insights
      const marketInsights = this.calculateMarketInsights(competitors);

      return {
        competitors,
        marketInsights
      };
    } catch (error) {
      console.error('Error analyzing market landscape:', error);
      throw error;
    }
  }

  /**
   * Get startup opportunity assessment for a specific industry
   */
  async assessStartupOpportunity(competitorSymbols: string[]): Promise<{
    opportunityScore: number;
    entryBarriers: string[];
    marketSize: string;
    competitionLevel: 'Low' | 'Medium' | 'High';
    recommendations: string[];
  }> {
    try {
      const landscape = await this.analyzeMarketLandscape(competitorSymbols);
      
      const entryBarriers: string[] = [];
      const recommendations: string[] = [];
      
      // Analyze barriers across all competitors
      landscape.competitors.forEach(competitor => {
        if (competitor.barrierAnalysis.marketCapBarrier === 'High') {
          entryBarriers.push(`High capital requirements (${competitor.company.name} has ${competitor.marketMetrics.marketCapFormatted} market cap)`);
        }
        if (competitor.barrierAnalysis.profitabilityBarrier === 'High') {
          entryBarriers.push(`High profitability standards (${competitor.marketMetrics.profitMargin.toFixed(1)}% margins)`);
        }
      });

      // Generate recommendations
      if (landscape.marketInsights.competitionLevel === 'Low') {
        recommendations.push('Market shows low competition - good opportunity for new entrants');
      }
      if (landscape.marketInsights.averageGrowthRate > 15) {
        recommendations.push('High industry growth rate suggests expanding market opportunity');
      }
      if (landscape.marketInsights.opportunityScore > 7) {
        recommendations.push('Strong market opportunity with favorable conditions for startups');
      } else if (landscape.marketInsights.opportunityScore < 4) {
        recommendations.push('Challenging market conditions - consider alternative approaches or timing');
      }

      return {
        opportunityScore: landscape.marketInsights.opportunityScore,
        entryBarriers: [...new Set(entryBarriers)], // Remove duplicates
        marketSize: this.categorizeMarketSize(landscape.marketInsights.averageMarketCap),
        competitionLevel: landscape.marketInsights.competitionLevel,
        recommendations
      };
    } catch (error) {
      console.error('Error assessing startup opportunity:', error);
      throw error;
    }
  }

  private calculateMarketInsights(competitors: StartupMarketAnalysis[]) {
    const marketCaps = competitors.map(c => c.marketMetrics.marketCap);
    const profitMargins = competitors.map(c => c.marketMetrics.profitMargin);
    const growthRates = competitors.map(c => c.marketMetrics.growthRate);
    
    const averageMarketCap = marketCaps.reduce((a, b) => a + b, 0) / marketCaps.length;
    const averageProfitMargin = profitMargins.reduce((a, b) => a + b, 0) / profitMargins.length;
    const averageGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

    // Determine competition level
    const highCompetitionCount = competitors.filter(c => c.barrierAnalysis.competitionLevel === 'High').length;
    const competitionLevel: 'Low' | 'Medium' | 'High' = 
      highCompetitionCount > competitors.length / 2 ? 'High' : 
      highCompetitionCount > 0 ? 'Medium' : 'Low';

    // Generate industry trends
    const industryTrends: string[] = [];
    if (averageGrowthRate > 15) industryTrends.push('High growth industry');
    if (averageProfitMargin > 20) industryTrends.push('High-margin business models');
    if (competitors.some(c => c.barrierAnalysis.industryMaturity === 'Emerging')) {
      industryTrends.push('Emerging technology sector');
    }

    // Calculate opportunity score (1-10)
    let opportunityScore = 5; // Base score
    
    // Positive factors
    if (averageGrowthRate > 20) opportunityScore += 2;
    else if (averageGrowthRate > 10) opportunityScore += 1;
    
    if (competitionLevel === 'Low') opportunityScore += 2;
    else if (competitionLevel === 'Medium') opportunityScore += 1;
    else opportunityScore -= 1;
    
    if (averageProfitMargin > 15) opportunityScore += 1;
    
    // Negative factors
    if (averageMarketCap > 50e9) opportunityScore -= 1; // Very large players
    
    opportunityScore = Math.max(1, Math.min(10, opportunityScore));

    return {
      averageMarketCap,
      averageProfitMargin,
      averageGrowthRate,
      competitionLevel,
      industryTrends,
      opportunityScore
    };
  }

  private categorizeMarketSize(averageMarketCap: number): string {
    if (averageMarketCap >= 10e9) return 'Large enterprise market';
    if (averageMarketCap >= 1e9) return 'Mid-market opportunity';
    return 'Small to medium business market';
  }
}

export default new MarketAnalysisService();