import { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './TrendsChart.css';

// Register all Chart.js components
Chart.register(...registerables);

// Define the structure of the processed chart data
interface TrendsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
  }>;
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
      const apiUrl = 'http://localhost:8000';
    // Add name and idea parameters to the products request
      const productsParams = new URLSearchParams();
      productsParams.append('name', name);
      productsParams.append('idea', idea);
      
      // Make both API calls
      const responseProducts = await fetch(`${apiUrl}/api/gemini/related-words?${productsParams.toString()}`);
      const responseProductsText = await responseProducts.json();
      
      // Build query parameters
      const params = new URLSearchParams();
      if (geo) params.append('geo', geo);
      params.append('date', timeRange);
      // Use related words from the backend (comma-separated)
      params.append('q', String(responseProductsText?.relatedWords || '')); 
    
      // Make the API call
      const responseChart = await fetch(`${apiUrl}/api/analytics/trends/chart?${params.toString()}`);

      // Check if the response is OK before parsing JSON
      if (!responseChart.ok) {
        // Just log the status without trying to parse the response
        throw new Error(`Failed to fetch trends data: ${responseChart.status} ${responseChart.statusText}`);
      }
      
      // Process the chart response
      const result = await responseChart.json();

      // Use backend-provided datasets per query; add colors
      const labelsFromApi = Array.isArray(result?.data?.labels) ? result.data.labels : [];
      const datasetsFromApi: Array<{ label: string; data: number[] }> = Array.isArray(result?.data?.datasets)
        ? result.data.datasets
        : [];

      const coloredDatasets = datasetsFromApi.map((ds, index) => ({
        ...ds,
        borderColor: `hsl(${(index * 137) % 360}, 70%, 60%)`,
        backgroundColor: `hsl(${(index * 137) % 360}, 70%, 60%, 0.3)`,
        borderWidth: 2,
      }));

      setData({
        labels: labelsFromApi,
        datasets: coloredDatasets,
      });
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
        text: 'Google Trends Analysis of Similar Products',
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
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.06)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.06)'
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.25
      },
      point: {
        radius: 2,
        hoverRadius: 4
      }
    }
  };

  // Construct chart data directly from processed datasets
  const chartData = data ? {
    labels: data.labels,
    datasets: data.datasets,
  } : { labels: [], datasets: [] };

  return (
    <div className="trends-chart-container">
      <div className="chart-header">
        <h2>Google Trends Analysis of Similar Products</h2>
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
    </div>
  );
}