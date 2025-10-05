import { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './TrendsChart.css';

// Register all Chart.js components
Chart.register(...registerables);

// Define the structure of the API response
interface TrendsData {
  series: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  queries: string[];
  averages: Record<string, number> | null;
}

interface TrendsChartProps {
  name: string,
  idea: string
}

export default function TrendsChart({name, idea}: TrendsChartProps) {
  // State variables
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geo, setGeo] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('today 12-m');

  // Function to fetch data from the API
  const fetchTrendsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
    // Get the API URL from environment variables or use a default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // Add name and idea parameters to the products request
      const productsParams = new URLSearchParams();
      productsParams.append('name', name);
      productsParams.append('idea', idea);
      
      // Make both API calls
      const responseProducts = await fetch(`${apiUrl}/api/serp/related-words?${productsParams.toString()}`);
      
      // Check if the products response is OK before parsing JSON
      if (!responseProducts.ok) {
        throw new Error(`Failed to fetch products data: ${responseProducts.status} ${responseProducts.statusText}`);
      }
      
      const productsResult = await responseProducts.json();
      // Build query parameters
      const params = new URLSearchParams();
      if (geo) params.append('geo', geo);
      params.append('date', timeRange);
      // The backend returns {response: string} where response is a comma-separated list
      params.append('q', productsResult); 
    
      
      // Make the API call
      const responseChart = await fetch(`${apiUrl}/api/serp/trends/chart?${params.toString()}`);
      
      // Check if the response is OK before parsing JSON
      if (!responseChart.ok) {
        // Just log the status without trying to parse the response
        throw new Error(`Failed to fetch trends data: ${responseChart.status} ${responseChart.statusText}`);
      }
      
      // Process the chart response (only parse JSON if response was ok)
      const result = await responseChart.json();
      
      // Handle demo mode or successful response
      if (result.demo) {
        console.warn('Using demo data - API key not configured');
        // Use demo data if available
        setData(result.data);
      } else {
        setData(result.data);
      }
    } catch (err) {
      console.error('Error fetching trends data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data on initial load
  useEffect(() => {
    fetchTrendsData();
  }, [name, idea, geo, timeRange]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrendsData();
  };

  // Prepare chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Google Trends Interest Over Time',
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Interest',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  // Generate random colors for datasets if not defined
  const getDatasetWithColors = () => {
    if (!data?.series.datasets) return [];
    
    return data.series.datasets.map((dataset, index) => {
      // Generate a color based on the index
      const hue = (index * 137) % 360; // Use golden angle approximation for better distribution
      const color = `hsla(${hue}, 70%, 60%, 0.8)`;
      
      return {
        ...dataset,
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency for the background
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
    });
  };
  
  // Construct chart data from API response
  const chartData = data ? {
    labels: data.series.labels,
    datasets: getDatasetWithColors(),
  } : { labels: [], datasets: [] };

  return (
    <div className="trends-chart-container">
      <div className="chart-header">
        <h2>Google Trends Analysis</h2>
        <p>Compare search interest over time for multiple terms</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <select 
          value={geo}
          onChange={(e) => setGeo(e.target.value)}
        >
          <option value="">Worldwide</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="today 12-m">Past 12 months</option>
          <option value="today 3-m">Past 3 months</option>
          <option value="today 1-m">Past month</option>
          <option value="today 5-y">Past 5 years</option>
          <option value="all">All time</option>
        </select>
        
        <button type="submit">
          Search
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-indicator">
          <div>Loading trends data...</div>
        </div>
      ) : (
        <div className="chart-area">
          {data && (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      )}
      
      {data?.averages && (
        <div className="chart-options">
          <div className="chart-option">
            <strong>Averages: </strong>
            {Object.entries(data.averages).map(([query, value]) => (
              <span key={query}>
                {query}: {value}
              </span>
            )).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, ' | ', curr], [] as React.ReactNode[])}
          </div>
        </div>
      )}
    </div>
  );
}