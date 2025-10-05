import express from 'express';
import alphaVantageService from '../services/alphavantage.js';
import marketAnalysisService from '../services/marketAnalysis.js';

const router = express.Router();

/**
 * GET /api/company/overview/:symbol
 * Fetch complete company overview data
 */
router.get('/overview/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.trim() === '') {
      return res.status(400).json({
        error: 'Symbol is required',
        message: 'Please provide a valid stock symbol'
      });
    }

    const overview = await alphaVantageService.getCompanyOverview(symbol.toUpperCase());
    
    if (!overview) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No data found for symbol: ${symbol}`
      });
    }

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error in company overview route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch company overview'
    });
  }
});

/**
 * GET /api/company/report/:symbol
 * Fetch simplified company info for reports
 */
router.get('/report/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.trim() === '') {
      return res.status(400).json({
        error: 'Symbol is required',
        message: 'Please provide a valid stock symbol'
      });
    }

    const companyInfo = await alphaVantageService.getCompanyInfoForReport(symbol.toUpperCase());
    
    if (!companyInfo) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No data found for symbol: ${symbol}`
      });
    }

    res.json({
      success: true,
      data: companyInfo
    });
  } catch (error) {
    console.error('Error in company report route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch company information for report'
    });
  }
});

/**
 * GET /api/company/validate/:symbol
 * Validate if a stock symbol exists
 */
router.get('/validate/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.trim() === '') {
      return res.status(400).json({
        error: 'Symbol is required',
        message: 'Please provide a valid stock symbol'
      });
    }

    const isValid = await alphaVantageService.validateSymbol(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        isValid
      }
    });
  } catch (error) {
    console.error('Error in symbol validation route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to validate symbol'
    });
  }
});

/**
 * GET /api/company/startup-analysis/:symbol
 * Get detailed startup market analysis for a competitor
 */
router.get('/startup-analysis/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.trim() === '') {
      return res.status(400).json({
        error: 'Symbol is required',
        message: 'Please provide a valid stock symbol'
      });
    }

    const analysis = await marketAnalysisService.analyzeCompetitor(symbol.toUpperCase());
    
    if (!analysis) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No analysis data found for symbol: ${symbol}`
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error in startup analysis route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze competitor for startup insights'
    });
  }
});

/**
 * GET /api/company/pitch-deck/:symbol
 * Get pitch deck data for a specific market/competitor
 */
router.get('/pitch-deck/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol || symbol.trim() === '') {
      return res.status(400).json({
        error: 'Symbol is required',
        message: 'Please provide a valid stock symbol'
      });
    }

    const pitchData = await marketAnalysisService.generatePitchDeckData(symbol.toUpperCase());
    
    if (!pitchData) {
      return res.status(404).json({
        error: 'Company not found',
        message: `No pitch deck data found for symbol: ${symbol}`
      });
    }

    res.json({
      success: true,
      data: pitchData
    });
  } catch (error) {
    console.error('Error in pitch deck route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate pitch deck data'
    });
  }
});

/**
 * POST /api/company/market-landscape
 * Analyze multiple competitors for comprehensive market research
 * Body: { symbols: ["IBM", "AAPL", "MSFT"] }
 */
router.post('/market-landscape', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        error: 'Symbols array is required',
        message: 'Please provide an array of stock symbols'
      });
    }

    if (symbols.length > 10) {
      return res.status(400).json({
        error: 'Too many symbols',
        message: 'Maximum 10 symbols allowed per request'
      });
    }

    const landscape = await marketAnalysisService.analyzeMarketLandscape(
      symbols.map(s => s.toUpperCase())
    );
    
    res.json({
      success: true,
      data: landscape
    });
  } catch (error) {
    console.error('Error in market landscape route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze market landscape'
    });
  }
});

/**
 * POST /api/company/startup-opportunity
 * Assess startup opportunity for a specific industry/market
 * Body: { competitorSymbols: ["IBM", "AAPL", "MSFT"] }
 */
router.post('/startup-opportunity', async (req, res) => {
  try {
    const { competitorSymbols } = req.body;
    
    if (!competitorSymbols || !Array.isArray(competitorSymbols) || competitorSymbols.length === 0) {
      return res.status(400).json({
        error: 'Competitor symbols array is required',
        message: 'Please provide an array of competitor stock symbols'
      });
    }

    if (competitorSymbols.length > 10) {
      return res.status(400).json({
        error: 'Too many symbols',
        message: 'Maximum 10 competitor symbols allowed per request'
      });
    }

    const opportunity = await marketAnalysisService.assessStartupOpportunity(
      competitorSymbols.map(s => s.toUpperCase())
    );
    
    res.json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Error in startup opportunity route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to assess startup opportunity'
    });
  }
});

export default router;