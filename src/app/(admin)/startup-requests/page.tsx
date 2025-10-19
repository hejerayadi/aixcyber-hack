
"use client";

import { useState, useEffect } from 'react';

interface Recommendation {
  name: string;
  sector: string;
  country: string;
  score: number;
  scorePercentage: number;
}

export default function StartupRequestsPage() {
  const [aiSummary, setAiSummary] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Set static AI summary
  useEffect(() => {
    setAiSummary("Based on the investor profile, the current portfolio, and the top 3 recommended startups, I recommend the following startups as they are aligned with the investor's focus on Fintech sector and the US region. These startups, Cole Group, Hughes-Miller, and Willis Boone and Larson, demonstrate growth potential and are well-suited for a balanced risk tolerance, as they operate in the same sector and region as the existing portfolio, providing a familiar and low-risk investment opportunity.");
    setLoading(false);
  }, []);

  // Default companies (fallback)
  const defaultCompanies = [
    { 
      id: 'C-001', 
      name: 'TechCorp Solutions', 
      country: 'Tunisia', 
      score: 0.87, 
      industry: 'Technology',
      revenue: '2.5M TND',
      employees: 45,
      founded: 2020,
      description: 'Leading provider of AI-powered business automation solutions for enterprises across North Africa.'
    },
    { 
      id: 'C-002', 
      name: 'GreenEnergy Ltd', 
      country: 'Morocco', 
      score: 0.92, 
      industry: 'Renewable Energy',
      revenue: '4.2M TND',
      employees: 78,
      founded: 2018,
      description: 'Innovative solar and wind energy solutions with focus on sustainable development and clean technology.'
    },
    { 
      id: 'C-003', 
      name: 'MediTech Innovations', 
      country: 'Algeria', 
      score: 0.74, 
      industry: 'Healthcare',
      revenue: '1.8M TND',
      employees: 32,
      founded: 2021,
      description: 'Revolutionary telemedicine platform connecting patients with healthcare providers across remote regions.'
    }
  ];

  // Static AI recommendations based on your model output
  const companies = [
    {
      id: 'AI-1',
      name: 'Cole Group',
      country: 'US',
      score: 1.092,
      industry: 'Fintech',
      revenue: '3.2M USD',
      employees: 45,
      founded: 2019,
      description: 'AI-recommended Fintech startup with 109% compatibility score. High growth potential in financial technology sector.'
    },
    {
      id: 'AI-2',
      name: 'Hughes-Miller',
      country: 'US',
      score: 0.994,
      industry: 'Fintech',
      revenue: '2.8M USD',
      employees: 38,
      founded: 2020,
      description: 'AI-recommended Fintech startup with 99% compatibility score. Strong alignment with portfolio focus.'
    },
    {
      id: 'AI-3',
      name: 'Willis Boone and Larson',
      country: 'US',
      score: 0.873,
      industry: 'Fintech',
      revenue: '1.9M USD',
      employees: 28,
      founded: 2021,
      description: 'AI-recommended Fintech startup with 87% compatibility score. Well-suited for balanced risk tolerance.'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Startup Recommendations</h1>
        {loading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading AI recommendations...
          </div>
        )}
      </div>

      {/* Company Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{company.name}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <span className="mr-2">🌍</span>
                  {company.country}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(company.score)}`}>
                {Math.round(company.score * 100)}%
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sector:</span>
                <span className="font-medium">{company.industry}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Revenue:</span>
                <span className="font-medium">{company.revenue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Employees:</span>
                <span className="font-medium">{company.employees}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Founded:</span>
                <span className="font-medium">{company.founded}</span>
              </div>
              {company.id.startsWith('AI-') && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">AI Score:</span>
                  <span className="font-medium text-blue-600">{Math.round(company.score * 100)}%</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {company.description}
            </p>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${getScoreColor(company.score)}`}>
                {getScoreLabel(company.score)}
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI Portfolio Analysis
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="ai-summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI-Generated Investment Analysis
            </label>
            <div className="w-full min-h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
              {loading ? (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Generating AI analysis...
                </div>
              ) : aiSummary ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {aiSummary}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  AI analysis will appear here once recommendations are loaded...
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Analysis
            </button>
            <button 
              onClick={() => setAiSummary('')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
