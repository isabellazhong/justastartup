import { Router, Request, Response } from 'express';
import serpApiClient from '../utils/serpai.js';
import { formatTrendsData } from '../utils/dataFormatter.js';
import gemini from '../llm/gemini.js';

const router = Router();

/**
 * @route GET /api/serp/trends
 * @desc Get Google Trends data from SerpAPI
 * @access Public
 */


router.get('/trends/products', async (req: Request, res: Response) => {
    try {
        const {name, idea} = req.query; 
        const query = `
        Return the top 3 products that is realted to this product (including the type of product itself). The 
        product is ${name} and the idea behind this product is ${idea}. Return the 3 words as a string seperated 
        by a comma between each product. Please do not include and preamble or postamble in your response. 
        `
        const response: string = await gemini.ask(query); 

        res.json({
            response
        });
    } catch (error) {
        console.error('Error fetching Google Trends data:', error);
    
        // Handle specific error types
        if (error instanceof Error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        }
        
        // Generic error handler
        return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching Google Trends data',
        });
        }
  });

router.get('/trends', async (req: Request, res: Response) => {
  try {
    const { q, geo, date, cat, gprop, tz, hl } = req.query;
    
    // Build query parameters for SerpAPI
    const queryParams: Record<string, any> = {};
    
    // Add optional parameters if they exist
    if (q) queryParams.q = q;
    if (geo) queryParams.geo = geo;
    if (date) queryParams.date = date;
    if (cat) queryParams.cat = cat;
    if (gprop) queryParams.gprop = gprop;
    if (tz) queryParams.tz = tz;
    if (hl) queryParams.hl = hl;
    
    // Get data from SerpAPI
    const trendsData = await serpApiClient.getGoogleTrends(queryParams);
    
    // Return the data
    return res.json(trendsData);
  } catch (error) {
    console.error('Error fetching Google Trends data:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    
    // Generic error handler
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while fetching Google Trends data',
    });
  }
});

/**
 * @route GET /api/serp/trends/native
 * @desc Get Google Trends data using native SerpAPI package
 * @access Public
 */
router.get('/trends/native', async (req: Request, res: Response) => {
  try {
    const { q, geo, date, data_type, format } = req.query;
    
    // Build query parameters for SerpAPI
    const queryParams: Record<string, any> = {
      data_type: data_type || 'TIMESERIES'
    };
    
    // Add optional parameters if they exist
    if (q) queryParams.q = q;
    if (geo) queryParams.geo = geo;
    if (date) queryParams.date = date;
    
    // Get data from SerpAPI using native package
    const trendsData = await serpApiClient.getGoogleTrendsNative(queryParams);
    
    // Format data for charts if requested
    if (format === 'chart') {
      const formattedData = formatTrendsData(trendsData, {
        dateFormat: 'yyyy-MM-dd'
      });
      
      return res.json({
        success: true,
        formatted: formattedData,
        raw: trendsData
      });
    }
    
    // Return the raw data
    return res.json(trendsData);
  } catch (error) {
    console.error('Error fetching Google Trends data (native):', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while fetching Google Trends data',
    });
  }
});

/**
 * @route GET /api/serp/trends/chart
 * @desc Get Google Trends data formatted for charts
 * @access Public
 */
router.get('/trends/chart', async (req: Request, res: Response) => {
  try {
    const { 
      q, geo, date, data_type,
      dateFormat, includeTotals, includeAverages 
    } = req.query;
    
    // Build query parameters for SerpAPI
    const queryParams: Record<string, any> = {
      data_type: data_type || 'TIMESERIES'
    };
    
    // Add optional parameters if they exist
    if (q) queryParams.q = q;
    if (geo) queryParams.geo = geo;
    if (date) queryParams.date = date;
    
    // Get data from SerpAPI
    const method = req.query.useNative === 'true' ? 'getGoogleTrendsNative' : 'getGoogleTrends';
    const trendsData = await serpApiClient[method](queryParams);
    
    // Format chart options
    const chartOptions = {
      dateFormat: dateFormat as string || 'yyyy-MM-dd',
      includeTotals: includeTotals === 'true',
      includeAverages: includeAverages !== 'false',
      normalizeValues: req.query.normalize === 'true',
    };
    
    // Format the data for charts
    const formattedData = formatTrendsData(trendsData, chartOptions);
    
    // Return formatted data
    return res.json({
      success: true,
      data: formattedData,
      // Only include raw data if explicitly requested
      ...(req.query.includeRaw === 'true' && { raw: trendsData })
    });
  } catch (error) {
    console.error('Error formatting Google Trends chart data:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    
    // Generic error handler
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while formatting Google Trends data',
    });
  }});

router.get('/trends/summary', async (req: Request, res: Response) => {
  try {
    const { name, idea } = req.query;
    const projectName = String(name || '').trim();
    const projectIdea = String(idea || '').trim();

    if (!projectName && !projectIdea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one of `name` or `idea` as query parameters.'
      });
    }

    const prompt = `You are a helpful business analyst. Given the project name: "${projectName}" and the idea: "${projectIdea}", write a long, descriptive business-logistics style summary focused on the following areas: Competitors, Vulnerabilities, Target audience, Complements/replacements. For each area, provide a substantial paragraph that explains the topic in plain English and evaluates viability. Do not return JSON — return one continuous long string that a human can read. Include examples when helpful.`;

    const response: string = await gemini.ask(prompt);

    return res.json({ response });
  } catch (error) {
    console.error('Error generating trends summary:', error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while generating the trends summary',
    });
  }
});

export default router;