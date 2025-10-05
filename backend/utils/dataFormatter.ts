import { format, parse } from 'date-fns';

/**
 * Types for SerpAPI Google Trends response data
 */
interface SerpApiValue {
  query: string;
  value: string;
  extracted_value: number;
}

interface SerpApiTimelineData {
  date: string;
  timestamp: string;
  values: SerpApiValue[];
}

interface SerpApiAverage {
  query: string;
  value: number;
}

interface SerpApiResponse {
  search_metadata?: Record<string, any>;
  search_parameters?: Record<string, any>;
  interest_over_time?: {
    timeline_data: SerpApiTimelineData[];
    averages: SerpApiAverage[];
  };
}

/**
 * Types for formatted data
 */
interface LineChartData {
  labels: string[];     // X-axis labels (dates)
  datasets: {
    label: string;      // Line series name
    data: number[];     // Y-axis values
  }[];
}

interface ChartFormatOptions {
  dateFormat?: string;  // Format for the date strings in the output
}

/**
 * Formats SerpAPI Google Trends data into a structure suitable for line charts
 * 
 * @param data - The raw response from SerpAPI
 * @param options - Formatting options
 * @returns Formatted data for line charts
 */
export function formatTrendsData(
  data: SerpApiResponse,
  options: ChartFormatOptions = {}
): LineChartData {
  const {
    dateFormat = 'yyyy-MM-dd',
  } = options;

  if (!data.interest_over_time?.timeline_data?.length) {
    throw new Error('Invalid or empty data: No timeline data found');
  }

  // Format for line charts (x: time, y: quantity)
  return formatForLineChart(data, dateFormat);
}

/**
 * Format data for line charts with time on X-axis and quantity on Y-axis
 * Output: { labels: [dates], datasets: [{ label, data }] }
 */
function formatForLineChart(
  data: SerpApiResponse,
  dateFormat: string
): LineChartData {
  if (!data.interest_over_time?.timeline_data) return { labels: [], datasets: [] };

  const timelineData = data.interest_over_time.timeline_data;
  
  // Extract dates for X-axis labels
  const labels = timelineData.map(item => {
    try {
      // Format the date string consistently
      const datePart = item.date.split('–')[0].trim();
      return formatDate(datePart, dateFormat);
    } catch (e) {
      // If parsing fails, return the original date string
      return item.date;
    }
  });
  
  // Find all unique queries (each query will be a line in the graph)
  const querySet = new Set<string>();
  timelineData.forEach(item => {
    item.values.forEach(value => {
      querySet.add(value.query);
    });
  });
  const queries = Array.from(querySet);
  
  // Create datasets for each query (each is a line series)
  const datasets = queries.map(query => {
    const data = timelineData.map(item => {
      const value = item.values.find(v => v.query === query);
      return value ? value.extracted_value : 0;
    });
    
    return {
      label: query,
      data,
    };
  });
  
  return {
    labels,
    datasets,
  };
}

/**
 * Helper function to format dates consistently
 */
function formatDate(dateStr: string, targetFormat: string): string {
  try {
    // Try multiple common date formats
    let date;
    
    // Try "MMM d, yyyy" format (e.g., "May 30, 2021")
    if (dateStr.includes(',')) {
      date = parse(dateStr, 'MMM d, yyyy', new Date());
    } 
    // Try "MMM d yyyy" format (e.g., "May 30 2021")
    else if (dateStr.split(' ').length === 3) {
      date = parse(dateStr, 'MMM d yyyy', new Date());
    }
    // Try "MMM yyyy" format (e.g., "May 2021")
    else if (dateStr.split(' ').length === 2) {
      date = parse(dateStr, 'MMM yyyy', new Date());
    }
    // If none of the above work, try to create a date from the string
    else {
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime())) {
      return dateStr; // Fall back to original string if parsing fails
    }
    
    return format(date, targetFormat);
  } catch (e) {
    return dateStr; // Return original if format fails
  }
}
