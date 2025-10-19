"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useState, useEffect } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BourseActionsPage() {
  const [predictions, setPredictions] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [riskAssessments, setRiskAssessments] = useState<{ [key: string]: string }>({});
  const [loadingRisk, setLoadingRisk] = useState<{ [key: string]: boolean }>({});

  const data = [
    { id: 'BT-01', name: 'Google', ticker: 'GOOGL', price: 485.50, changePercent: 2.4, quantity: 100, marketCap: '1.8T USD', action: 'Buy', score: 0.86 },
    { id: 'BT-02', name: 'IBM', ticker: 'IBM', price: 185.20, changePercent: -0.6, quantity: 50, marketCap: '165B USD', action: 'Hold', score: 0.56 },
    { id: 'BT-03', name: 'Microsoft', ticker: 'MSFT', price: 425.75, changePercent: -4.2, quantity: 200, marketCap: '3.2T USD', action: 'Sell', score: 0.2 },
    { id: 'BT-04', name: 'Apple', ticker: 'AAPL', price: 195.40, changePercent: 1.8, quantity: 150, marketCap: '3.0T USD', action: 'Buy', score: 0.75 },
  ];

  // Fetch predictions from the model
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('/api/predict-stocks');
        if (response.ok) {
          const data = await response.json();
          setPredictions(data.predictions);
        } else {
          console.error('Failed to fetch predictions');
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Function to get comprehensive risk analysis
  const getRiskAnalysis = async (ticker: string, companyName: string) => {
    setLoadingRisk(prev => ({ ...prev, [ticker]: true }));
    
    try {
      console.log(`Requesting risk analysis for ${companyName} (${ticker})...`);
      
      const response = await fetch('/api/risk-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker, companyName }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Risk analysis data received:', data);
        setRiskAssessments(prev => ({ ...prev, [ticker]: data.riskAssessment }));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        setRiskAssessments(prev => ({ 
          ...prev, 
          [ticker]: `Risk analysis failed (${response.status}): ${errorData.error || 'Unknown error'}` 
        }));
      }
    } catch (error) {
      console.error('Network error:', error);
      setRiskAssessments(prev => ({ 
        ...prev, 
        [ticker]: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setLoadingRisk(prev => ({ ...prev, [ticker]: false }));
    }
  };

  // Sample Close price data for each ticker with high volatility (100-500 range)
  const closePriceData: { [key: string]: number[] } = {
    'GOOGL': [480, 495, 465, 500, 485], // High volatility, near top of range
    'IBM': [180, 165, 195, 155, 185],   // Medium volatility, lower range
    'MSFT': [420, 435, 405, 445, 425],  // Medium volatility, upper range
    'AAPL': [190, 210, 175, 205, 195],  // High volatility, probably the middle
  };

  // Recent dates from 15/10/2025 to today + prediction date
  const dates = ['15/10/2025', '16/10/2025', '17/10/2025', '18/10/2025', '19/10/2025'];
  const datesWithPrediction = ['15/10/2025', '16/10/2025', '17/10/2025', '18/10/2025', '19/10/2025', '20/10/2025'];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Bourse Actions</h1>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Close Price Curves</h2>
          {loading ? (
            <div className="text-sm text-gray-500">Loading AI predictions...</div>
          ) : Object.keys(predictions).length > 0 ? (
            <div className="text-sm text-green-600">✓ AI Predictions loaded</div>
          ) : (
            <div className="text-sm text-red-500">✗ AI Predictions unavailable</div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((r) => (
            <div key={r.id} className="p-4 border rounded bg-white dark:bg-gray-900">
              <h3 className="font-medium text-gray-900 dark:text-white">{r.name} <span className="text-xs text-gray-500">{r.ticker}</span></h3>
              {predictions[r.ticker] && (
                <div className="mb-2 text-sm">
                  <span className="text-red-600 font-semibold">AI Prediction (20/10/2025): ${predictions[r.ticker].toFixed(2)}</span>
                </div>
              )}
              
              {/* Risk Analysis Button */}
              <div className="mb-3">
                <button
                  onClick={() => getRiskAnalysis(r.ticker, r.name)}
                  disabled={loadingRisk[r.ticker]}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loadingRisk[r.ticker] ? 'Analyzing...' : 'Get Risk Analysis'}
                </button>
              </div>

              {/* Risk Assessment Display */}
              {riskAssessments[r.ticker] && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    🚨 Comprehensive Risk Assessment
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    {riskAssessments[r.ticker]}
                  </p>
                </div>
              )}
              <Line
                data={{
                  labels: datesWithPrediction, // Include prediction date
                  datasets: [
                    {
                      label: 'Historical Close Price',
                      data: closePriceData[r.ticker], // Historical data
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      fill: false,
                    },
                    // Add prediction dataset if available
                    ...(predictions[r.ticker] ? [{
                      label: 'AI Prediction (20/10/2025)',
                      data: [...closePriceData[r.ticker], predictions[r.ticker]], // Include prediction
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderDash: [5, 5], // Dashed line for prediction
                      fill: false,
                      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                      pointBorderColor: 'rgba(255, 99, 132, 1)',
                      pointRadius: 6, // Larger point for prediction
                    }] : []),
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: false, // Don't start from zero for better price visualization
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top' as const,
                    },
                  },
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
