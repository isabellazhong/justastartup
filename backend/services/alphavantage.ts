import axios from 'axios';
import { CompanyOverview, AlphaVantageResponse, AlphaVantageError } from '../types/alphavantage';

class AlphaVantageService {
  private baseUrl = 'https://www.alphavantage.co/query';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ALPHAVANTAGE_API_KEY || 'demo';
  }

  /**
   * Fetch company overview data from AlphaVantage API
   * @param symbol Stock symbol (e.g., 'IBM', 'AAPL')
   * @returns Promise<CompanyOverview | null>
   */
  async getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
    try {
      const url = `${this.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`;
      
      const response = await axios.get<AlphaVantageResponse>(url, {
        headers: {
          'User-Agent': 'Justastartup-Backend'
        },
        timeout: 10000 // 10 second timeout
      });

      const data = response.data;

      // Check for API errors
      if (data.Note || data.Information || data["Error Message"]) {
        console.error('AlphaVantage API Error:', data);
        return null;
      }

      // Check if we have valid company data
      if (!data.Symbol || !data.Name) {
        console.error('Invalid company data received from AlphaVantage');
        return null;
      }

      return data as CompanyOverview;
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw new Error(`Failed to fetch company overview for ${symbol}`);
    }
  }

  /**
   * Validate if a stock symbol exists
   * @param symbol Stock symbol to validate
   * @returns Promise<boolean>
   */
  async validateSymbol(symbol: string): Promise<boolean> {
    try {
      const overview = await this.getCompanyOverview(symbol);
      return overview !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get simplified company info for reports
   * @param symbol Stock symbol
   * @returns Promise with essential company information
   */
  async getCompanyInfoForReport(symbol: string) {
    try {
      const overview = await this.getCompanyOverview(symbol);
      
      if (!overview) {
        return null;
      }

      return {
        symbol: overview.Symbol,
        name: overview.Name,
        description: overview.Description,
        sector: overview.Sector,
        industry: overview.Industry,
        country: overview.Country,
        marketCap: overview.MarketCapitalization,
        peRatio: overview.PERatio,
        eps: overview.EPS,
        revenue: overview.RevenueTTM,
        profitMargin: overview.ProfitMargin,
        exchange: overview.Exchange,
        currency: overview.Currency
      };
    } catch (error) {
      console.error('Error getting company info for report:', error);
      throw error;
    }
  }
}

export default new AlphaVantageService();