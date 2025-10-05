import axios from 'axios';
import { getJson } from 'serpapi';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * SerpAPI client for interacting with various SerpAPI endpoints
 */
export class SerpApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://serpapi.com/search';

  /**
   * Initialize the SerpAPI client
   * @param apiKey - API key for SerpAPI
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('SerpAPI key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get data from Google Trends via SerpAPI
   * @param params - Additional parameters to send with the request
   * @returns Promise with the response data
   */
  async getGoogleTrends(params: Record<string, any> = {}): Promise<any> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          engine: 'google_trends',
          api_key: this.apiKey,
          ...params
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;
        
        throw new Error(`SerpAPI Error (${status}): ${message}`);
      }
      
      // Handle other errors
      throw error;
    }
  }

  /**
   * Get data from Google Trends via native SerpAPI package
   * @param params - Parameters to send with the request
   * @returns Promise with the response data
   */
  getGoogleTrendsNative(params: Record<string, any> = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      getJson({
        engine: 'google_trends',
        api_key: this.apiKey,
        ...params
      }, (data: any) => {
        if (data.error) {
          reject(new Error(`SerpAPI Error: ${data.error}`));
        } else {
          resolve(data);
        }
      });
    });
  }
}

const serpApiKey = process.env.VITE_SERPAI_KEY || '';

export default new SerpApiClient(serpApiKey);
