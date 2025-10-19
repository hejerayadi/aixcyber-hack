 
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';

// load react-apexcharts only on client to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }) as any;

// Small mocked data helpers — replace with real API hooks later
const mockStats = () => ({
  portfolioValue: 125000,
  profitYTD: 8200,
  profitPercentYTD: 7.0,
  cash: 15000,
});

const mockBourseRecommendations = () => [
  {
    id: 'BT-01',
    name: 'Google',
    ticker: 'GOOGL',
    action: 'Buy',
    reason: 'AI prediction shows strong momentum',
    score: 0.86,
    price: 485.50,
    changePercent: 2.4,
    quantity: 100,
    marketCap: '1.8T USD',
  },
  {
    id: 'BT-02',
    name: 'IBM',
    ticker: 'IBM',
    action: 'Hold',
    reason: 'Mixed signals from AI analysis',
    score: 0.56,
    price: 185.20,
    changePercent: -0.6,
    quantity: 50,
    marketCap: '165B USD',
  },
  {
    id: 'BT-03',
    name: 'Microsoft',
    ticker: 'MSFT',
    action: 'Sell',
    reason: 'AI indicates volatility concerns',
    score: 0.2,
    price: 425.75,
    changePercent: -4.2,
    quantity: 200,
    marketCap: '3.2T USD',
  },
  {
    id: 'BT-04',
    name: 'Apple',
    ticker: 'AAPL',
    action: 'Buy',
    reason: 'AI shows resilient performance',
    score: 0.75,
    price: 195.40,
    changePercent: 1.8,
    quantity: 150,
    marketCap: '3.0T USD',
  },
];

const mockStartupRequests = () => [
  {
    id: 'AI-1',
    name: 'Cole Group',
    amount: 3200000,
    stage: 'Series A',
    score: 1.092,
    equityOffered: '12%',
    valuation: '26.7M USD',
    founder: 'Cole Management',
    summary: 'AI-recommended Fintech startup with 109% compatibility score. High growth potential in financial technology sector.',
  },
  {
    id: 'AI-2',
    name: 'Hughes-Miller',
    amount: 2800000,
    stage: 'Series A',
    score: 0.994,
    equityOffered: '10%',
    valuation: '28M USD',
    founder: 'Hughes-Miller Team',
    summary: 'AI-recommended Fintech startup with 99% compatibility score. Strong alignment with portfolio focus.',
  },
  {
    id: 'AI-3',
    name: 'Willis Boone and Larson',
    amount: 1900000,
    stage: 'Seed',
    score: 0.873,
    equityOffered: '8%',
    valuation: '23.8M USD',
    founder: 'Willis Boone & Larson',
    summary: 'AI-recommended Fintech startup with 87% compatibility score. Well-suited for balanced risk tolerance.',
  },
];

export default function InvestorLanding() {
  const stats = mockStats();
  const bourse = mockBourseRecommendations();
  const startups = mockStartupRequests();

  const chartOptions = {
    chart: { id: 'portfolio', toolbar: { show: false } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    stroke: { curve: 'smooth' },
    colors: ['#4f46e5'],
    tooltip: { enabled: true },
  } as any;

  const chartSeries = [
    {
      name: 'Portfolio value',
      data: [100000, 102000, 98000, 105000, 110000, 120000, stats.portfolioValue],
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 max-w-full overflow-hidden">
      <div className="col-span-12 xl:col-span-7 space-y-6 min-w-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Portfolio Value</div>
            <div className="text-2xl font-semibold">{stats.portfolioValue.toLocaleString()} TND</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Profit YTD</div>
            <div className="text-2xl font-semibold">{stats.profitYTD.toLocaleString()} TND</div>
            <div className="text-sm text-green-500">{stats.profitPercentYTD}%</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-sm text-gray-500">Available Cash</div>
            <div className="text-2xl font-semibold">{stats.cash.toLocaleString()} TND</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">Performance</h3>
          <div className="h-56">
            {typeof window !== 'undefined' && (
              <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={220} />
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">AI-Powered Bourse Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {bourse.map((r) => (
              <div key={r.id} className="p-4 border rounded bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{r.name} <span className="text-xs text-gray-500">{r.ticker}</span></div>
                    <div className="text-xs text-gray-500">{r.marketCap}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm font-semibold ${r.action === 'Buy' ? 'bg-green-100 text-green-700' : r.action === 'Sell' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.action}</div>
                </div>

                <div className="mt-3">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-semibold">${r.price.toLocaleString()} <span className={`ml-2 text-sm ${r.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>({r.changePercent >= 0 ? '+' : ''}{r.changePercent}%)</span></div>
                  <div className="text-xs text-gray-500 mt-1">Holding: {r.quantity} · Value: ${(r.price * r.quantity).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-2">{r.reason}</div>
                  <div className="text-sm text-gray-500 mt-2">AI Score: {Math.round(r.score * 100)}%</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded">Details</button>
                  <button className="px-3 py-1 text-sm border rounded">Trade</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-5 space-y-6 min-w-0">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">AI-Recommended Startups</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((s) => (
              <div key={s.id} className="p-4 border rounded bg-white dark:bg-gray-900 min-w-0">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-medium text-gray-900 dark:text-white truncate">{s.name}</div>
                      <div className="text-sm text-gray-500 truncate">Founder: {s.founder}</div>
                      <div className="text-sm text-gray-500 truncate">Stage: {s.stage} · {s.valuation}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm text-gray-500">Investment</div>
                      <div className="font-semibold text-lg">${s.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Equity: {s.equityOffered}</div>
                      <div className="text-sm text-blue-600 font-medium">AI: {Math.round(s.score * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4',
                    maxHeight: '2.8em'
                  }}>
                    {s.summary}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">View</button>
                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Invest</button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Decline</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Create Investment Order</button>
            <button className="px-4 py-2 border rounded">Request Portfolio Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
