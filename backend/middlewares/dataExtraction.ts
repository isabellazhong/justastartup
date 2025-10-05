import { CompanyOverview, StartupMarketAnalysis, PitchDeckData } from '../types/alphavantage';

/**
 * Middleware to extract and analyze startup-relevant data from AlphaVantage company data
 */
export class DataExtractionMiddleware {
  
  /**
   * Extract startup market analysis from company overview data
   */
  static extractStartupAnalysis(companyData: CompanyOverview): StartupMarketAnalysis {
    const marketCap = parseFloat(companyData.MarketCapitalization) || 0;
    const revenue = parseFloat(companyData.RevenueTTM) || 0;
    const profitMargin = parseFloat(companyData.ProfitMargin) || 0;
    const growthRate = parseFloat(companyData.QuarterlyRevenueGrowthYOY) || 0;
    const peRatio = parseFloat(companyData.PERatio) || 0;
    const priceToSales = parseFloat(companyData.PriceToSalesRatioTTM) || 0;
    const beta = parseFloat(companyData.Beta) || 1;

    // Analyst sentiment
    const strongBuy = parseInt(companyData.AnalystRatingStrongBuy || '0');
    const buy = parseInt(companyData.AnalystRatingBuy || '0');
    const hold = parseInt(companyData.AnalystRatingHold || '0');
    const sell = parseInt(companyData.AnalystRatingSell || '0');
    const strongSell = parseInt(companyData.AnalystRatingStrongSell || '0');

    return {
      company: {
        symbol: companyData.Symbol,
        name: companyData.Name,
        description: companyData.Description,
        website: companyData.OfficialSite,
        sector: companyData.Sector,
        industry: companyData.Industry,
        country: companyData.Country,
        exchange: companyData.Exchange
      },
      marketMetrics: {
        marketCap,
        marketCapFormatted: this.formatMarketCap(marketCap),
        marketSize: this.categorizeMarketSize(marketCap),
        revenue,
        revenueFormatted: this.formatCurrency(revenue),
        profitMargin: profitMargin * 100, // Convert to percentage
        growthRate: growthRate * 100 // Convert to percentage
      },
      competitiveMetrics: {
        peRatio,
        priceToSales,
        beta,
        volatility: this.categorizeVolatility(beta),
        analystSentiment: {
          strongBuy,
          buy,
          hold,
          sell,
          strongSell,
          overallRating: this.calculateOverallRating(strongBuy, buy, hold, sell, strongSell)
        }
      },
      barrierAnalysis: {
        marketCapBarrier: this.analyzeMarketCapBarrier(marketCap),
        profitabilityBarrier: this.analyzeProfitabilityBarrier(profitMargin),
        competitionLevel: this.analyzeCompetitionLevel(peRatio, priceToSales),
        industryMaturity: this.analyzeIndustryMaturity(growthRate, beta)
      }
    };
  }

  /**
   * Extract pitch deck data focusing on market opportunity and competition
   */
  static extractPitchDeckData(companyData: CompanyOverview): PitchDeckData {
    const analysis = this.extractStartupAnalysis(companyData);
    
    return {
      marketOpportunity: {
        totalMarketSize: analysis.marketMetrics.marketCapFormatted,
        industryGrowth: analysis.marketMetrics.growthRate,
        profitMargins: analysis.marketMetrics.profitMargin,
        competitorCount: this.estimateCompetitorCount(companyData.Industry)
      },
      competitiveLandscape: {
        majorPlayers: [companyData.Name], // Would be expanded with industry research
        marketLeader: {
          name: companyData.Name,
          marketCap: analysis.marketMetrics.marketCapFormatted,
          advantage: this.identifyCompetitiveAdvantage(analysis)
        },
        entryBarriers: this.identifyEntryBarriers(analysis)
      },
      financialBenchmarks: {
        averagePE: analysis.competitiveMetrics.peRatio,
        averageProfitMargin: analysis.marketMetrics.profitMargin,
        revenueGrowth: analysis.marketMetrics.growthRate,
        marketMultiples: {
          priceToSales: analysis.competitiveMetrics.priceToSales,
          evToRevenue: parseFloat(companyData.EVToRevenue) || 0
        }
      }
    };
  }

  // Helper methods for categorization and analysis
  private static formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  }

  private static formatCurrency(amount: number): string {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  }

  private static categorizeMarketSize(marketCap: number): 'Large-Cap' | 'Mid-Cap' | 'Small-Cap' | 'Micro-Cap' {
    if (marketCap >= 10e9) return 'Large-Cap';
    if (marketCap >= 2e9) return 'Mid-Cap';
    if (marketCap >= 300e6) return 'Small-Cap';
    return 'Micro-Cap';
  }

  private static categorizeVolatility(beta: number): 'Low' | 'Medium' | 'High' {
    if (beta < 0.8) return 'Low';
    if (beta <= 1.2) return 'Medium';
    return 'High';
  }

  private static calculateOverallRating(strongBuy: number, buy: number, hold: number, sell: number, strongSell: number): 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' {
    const total = strongBuy + buy + hold + sell + strongSell;
    if (total === 0) return 'Hold';
    
    const score = (strongBuy * 5 + buy * 4 + hold * 3 + sell * 2 + strongSell * 1) / total;
    
    if (score >= 4.5) return 'Strong Buy';
    if (score >= 3.5) return 'Buy';
    if (score >= 2.5) return 'Hold';
    if (score >= 1.5) return 'Sell';
    return 'Strong Sell';
  }

  private static analyzeMarketCapBarrier(marketCap: number): 'Low' | 'Medium' | 'High' {
    if (marketCap >= 10e9) return 'High';
    if (marketCap >= 1e9) return 'Medium';
    return 'Low';
  }

  private static analyzeProfitabilityBarrier(profitMargin: number): 'Low' | 'Medium' | 'High' {
    if (profitMargin >= 0.2) return 'High'; // 20%+ margins
    if (profitMargin >= 0.1) return 'Medium'; // 10-20% margins
    return 'Low';
  }

  private static analyzeCompetitionLevel(peRatio: number, priceToSales: number): 'Low' | 'Medium' | 'High' {
    // High P/E and P/S ratios often indicate high competition and growth expectations
    if (peRatio > 30 || priceToSales > 10) return 'High';
    if (peRatio > 15 || priceToSales > 5) return 'Medium';
    return 'Low';
  }

  private static analyzeIndustryMaturity(growthRate: number, beta: number): 'Emerging' | 'Growing' | 'Mature' {
    if (growthRate > 0.2 && beta > 1.2) return 'Emerging'; // High growth, high volatility
    if (growthRate > 0.1 || beta > 1.0) return 'Growing'; // Moderate growth or volatility
    return 'Mature';
  }

  private static identifyCompetitiveAdvantage(analysis: StartupMarketAnalysis): string {
    const { profitMargin, marketSize } = analysis.marketMetrics;
    const { beta } = analysis.competitiveMetrics;
    
    if (profitMargin > 20 && marketSize === 'Large-Cap') return 'Market leader with strong profitability';
    if (profitMargin > 15) return 'High profit margins';
    if (beta < 0.8) return 'Stable, low-risk business model';
    if (marketSize === 'Large-Cap') return 'Established market presence';
    return 'Growing market position';
  }

  private static identifyEntryBarriers(analysis: StartupMarketAnalysis): string[] {
    const barriers: string[] = [];
    
    if (analysis.barrierAnalysis.marketCapBarrier === 'High') {
      barriers.push('High capital requirements');
    }
    if (analysis.barrierAnalysis.profitabilityBarrier === 'High') {
      barriers.push('Established profit margins indicate operational expertise needed');
    }
    if (analysis.barrierAnalysis.competitionLevel === 'High') {
      barriers.push('Intense competition with high valuations');
    }
    if (analysis.barrierAnalysis.industryMaturity === 'Mature') {
      barriers.push('Mature industry with established players');
    }
    
    return barriers.length > 0 ? barriers : ['Moderate barriers to entry'];
  }

  private static estimateCompetitorCount(industry: string): number {
    // Simplified logic - would be enhanced with industry databases
    const competitiveIndustries = [
      'SOFTWARE', 'TECHNOLOGY SERVICES', 'INTERNET', 'CONSUMER SERVICES'
    ];
    
    if (competitiveIndustries.some(ind => industry.toUpperCase().includes(ind))) {
      return 50; // Highly competitive
    }
    return 20; // Moderate competition
  }
}