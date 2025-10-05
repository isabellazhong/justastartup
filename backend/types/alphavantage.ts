// AlphaVantage API Types - Full response structure
export interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  OfficialSite?: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  AnalystRatingStrongBuy?: string;
  AnalystRatingBuy?: string;
  AnalystRatingHold?: string;
  AnalystRatingSell?: string;
  AnalystRatingStrongSell?: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
  "50DayMovingAverage": string;
  "200DayMovingAverage": string;
  SharesOutstanding: string;
  SharesFloat?: string;
  PercentInsiders?: string;
  PercentInstitutions?: string;
  DividendDate?: string;
  ExDividendDate?: string;
}

// Startup-focused data extraction types
export interface StartupMarketAnalysis {
  company: {
    symbol: string;
    name: string;
    description: string;
    website?: string;
    sector: string;
    industry: string;
    country: string;
    exchange: string;
  };
  marketMetrics: {
    marketCap: number;
    marketCapFormatted: string;
    marketSize: 'Large-Cap' | 'Mid-Cap' | 'Small-Cap' | 'Micro-Cap';
    revenue: number;
    revenueFormatted: string;
    profitMargin: number;
    growthRate: number;
  };
  competitiveMetrics: {
    peRatio: number;
    priceToSales: number;
    beta: number;
    volatility: 'Low' | 'Medium' | 'High';
    analystSentiment: {
      strongBuy: number;
      buy: number;
      hold: number;
      sell: number;
      strongSell: number;
      overallRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    };
  };
  barrierAnalysis: {
    marketCapBarrier: 'Low' | 'Medium' | 'High';
    profitabilityBarrier: 'Low' | 'Medium' | 'High';
    competitionLevel: 'Low' | 'Medium' | 'High';
    industryMaturity: 'Emerging' | 'Growing' | 'Mature';
  };
}

export interface PitchDeckData {
  marketOpportunity: {
    totalMarketSize: string;
    industryGrowth: number;
    profitMargins: number;
    competitorCount: number;
  };
  competitiveLandscape: {
    majorPlayers: string[];
    marketLeader: {
      name: string;
      marketCap: string;
      advantage: string;
    };
    entryBarriers: string[];
  };
  financialBenchmarks: {
    averagePE: number;
    averageProfitMargin: number;
    revenueGrowth: number;
    marketMultiples: {
      priceToSales: number;
      evToRevenue: number;
    };
  };
}

export interface AlphaVantageResponse {
  Symbol?: string;
  Name?: string;
  Note?: string;
  Information?: string;
  [key: string]: any;
}

export interface AlphaVantageError {
  Note?: string;
  Information?: string;
  "Error Message"?: string;
}
