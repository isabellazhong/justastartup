const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { getJson } = require('serpapi');
const { formatTrendsData } = require('./utils/chartFormatter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Justastartup API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SerpAPI Trends route
app.get('/api/serp/trends', async (req, res) => {
  try {
    // Check if API key is set
    const apiKey = process.env.VITE_SERPAI_KEY;
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey || apiKey === 'dummy-key') {
      return res.status(401).json({
        success: false,
        message: 'SerpAPI key is not properly configured in the .env file',
        demo: true,
        sampleData: {
          // Sample data for development/testing
          google_trends: {
            widgets: [
              {
                id: "TIMESERIES",
                title: "Interest over time",
                type: "TIMESERIES",
                data: [
                  { date: "2023-10-01", value: 50 },
                  { date: "2023-10-08", value: 75 },
                  { date: "2023-10-15", value: 100 },
                  { date: "2023-10-22", value: 85 },
                ]
              }
            ]
          }
        }
      });
    }
    
    // Extract query parameters from the request
    const { q, geo, date, cat, gprop, tz, hl } = req.query;
    
    // Build query parameters for SerpAPI
    const queryParams = {
      engine: 'google_trends',
      api_key: apiKey,
    };
    
    // Add optional parameters if they exist
    if (q) queryParams.q = q;
    if (geo) queryParams.geo = geo;
    if (date) queryParams.date = date;
    if (cat) queryParams.cat = cat;
    if (gprop) queryParams.gprop = gprop;
    if (tz) queryParams.tz = tz;
    if (hl) queryParams.hl = hl;
    
    console.log('Sending request to SerpAPI with params:', 
      JSON.stringify({...queryParams, api_key: '[REDACTED]'}));
    
    // Get data from SerpAPI
    const response = await axios.get('https://serpapi.com/search', {
      params: queryParams
    });
    
    console.log('Response received from SerpAPI');
    
    // Return the data
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching Google Trends data:', error.message);
    
    // Handle error response from axios
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: `SerpAPI Error: ${error.response.data?.error || error.message}`,
        status: error.response.status
      });
    }
    
    // Generic error handler
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
    });
  }
});

// Log environment variables
console.log('Environment variables loaded:', Object.keys(process.env).length);
console.log('SERPAPI key available:', !!process.env.VITE_SERPAI_KEY);

// SerpAPI Trends route using native serpapi package
app.get('/api/serp/trends/native', async (req, res) => {
  try {
    // Check if API key is set
    const apiKey = process.env.VITE_SERPAI_KEY;
    
    if (!apiKey || apiKey === 'dummy-key') {
      return res.status(401).json({
        success: false,
        message: 'SerpAPI key is not properly configured in the .env file',
        demo: true,
        sampleData: {
          interest_over_time: {
            "coffee": [50, 55, 48, 52],
            "milk": [32, 30, 35, 38],
            "timeline": ["2023-10-01", "2023-10-08", "2023-10-15", "2023-10-22"]
          }
        }
      });
    }
    
    // Extract query parameters from the request
    const { q, geo, date, data_type } = req.query;
    
    // Build query parameters for SerpAPI
    const queryParams = {
      engine: 'google_trends',
      api_key: apiKey,
      data_type: data_type || 'TIMESERIES'
    };
    
    // Add optional parameters if they exist
    if (q) queryParams.q = q;
    if (geo) queryParams.geo = geo;
    if (date) queryParams.date = date;
    
    console.log('Sending request to SerpAPI native with params:',
      JSON.stringify({...queryParams, api_key: '[REDACTED]'}));
    
    // Create a promise wrapper for the callback-based getJson function
    const serpApiPromise = new Promise((resolve, reject) => {
      getJson(queryParams, (json) => {
        if (json.error) {
          reject(new Error(json.error));
        } else {
          resolve(json);
        }
      });
    });
    
    // Get data from SerpAPI
    const data = await serpApiPromise;
    console.log('Response received from SerpAPI native');
    
    // Return the data
    return res.json(data);
  } catch (error) {
    console.error('Error fetching Google Trends data (native):', error.message);
    
    // Generic error handler
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
    });
  }
});

// Chart formatted trends endpoint
app.get('/api/serp/trends/chart', async (req, res) => {
  try {
    // Check if API key is set
    const apiKey = process.env.VITE_SERPAI_KEY;
    
    if (!apiKey || apiKey === 'dummy-key') {
      // Return sample formatted data for development
      const sampleData = {
        series: {
          labels: ['2023-10-01', '2023-10-08', '2023-10-15', '2023-10-22'],
          datasets: [
            { label: 'coffee', data: [50, 55, 48, 52] },
            { label: 'milk', data: [32, 30, 35, 38] },
          ]
        },
        timeSeries: [
          { date: '2023-10-01', coffee: 50, milk: 32, timestamp: 1696118400000, total: 82 },
          { date: '2023-10-08', coffee: 55, milk: 30, timestamp: 1696723200000, total: 85 },
          { date: '2023-10-15', coffee: 48, milk: 35, timestamp: 1697328000000, total: 83 },
          { date: '2023-10-22', coffee: 52, milk: 38, timestamp: 1697932800000, total: 90 },
        ],
        queries: ['coffee', 'milk'],
        averages: { coffee: 51.25, milk: 33.75 }
      };

      return res.json({
        success: false,
        message: 'SerpAPI key is not properly configured in the .env file',
        demo: true,
        data: sampleData
      });
    }
    
    // Extract query parameters from the request
    const { 
      q, geo, date, data_type,
      dateFormat, includeTotals, includeAverages, useNative, normalize, includeRaw 
    } = req.query;
    
    // Build query parameters for SerpAPI
    const queryParams = {
      engine: 'google_trends',
      api_key: apiKey,
      data_type: data_type || 'TIMESERIES'
    };
    
    // Add optional parameters if they exist
    if (q) queryParams.q = q;
    if (geo) queryParams.geo = geo;
    if (date) queryParams.date = date;
    
    console.log('Sending request to SerpAPI for chart data:',
      JSON.stringify({...queryParams, api_key: '[REDACTED]'}));
    
    let trendsData;
    
    // Get data from SerpAPI using the appropriate method
    if (useNative === 'true') {
      // Create a promise wrapper for the callback-based getJson function
      trendsData = await new Promise((resolve, reject) => {
        getJson(queryParams, (json) => {
          if (json.error) {
            reject(new Error(json.error));
          } else {
            resolve(json);
          }
        });
      });
    } else {
      // Use axios
      const response = await axios.get('https://serpapi.com/search', {
        params: queryParams
      });
      trendsData = response.data;
    }
    
    console.log('Response received from SerpAPI, formatting for charts');
    
    // Format chart options
    const chartOptions = {
      dateFormat: dateFormat || 'yyyy-MM-dd',
      includeTotals: includeTotals === 'true',
      includeAverages: includeAverages !== 'false',
      normalizeValues: normalize === 'true'
    };
    
    // Format the data for charts
    const formattedData = formatTrendsData(trendsData, chartOptions);
    
    // Return formatted data
    return res.json({
      success: true,
      data: formattedData,
      // Only include raw data if explicitly requested
      ...(includeRaw === 'true' && { raw: trendsData })
    });
  } catch (error) {
    console.error('Error formatting Google Trends chart data:', error.message);
    
    // Handle error response from axios
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: `SerpAPI Error: ${error.response.data?.error || error.message}`,
        status: error.response.status
      });
    }
    
    // Generic error handler
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port or close the other application.`);
  }
});