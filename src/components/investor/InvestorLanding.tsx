 
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
    name: 'Société A',
    ticker: 'SCT-A',
    action: 'Buy',
    reason: 'Uptrend, strong earnings',
    score: 0.86,
    price: 150.5,
    changePercent: 2.4,
    quantity: 100,
    marketCap: '120M TND',
  },
  {
    id: 'BT-02',
    name: 'Société B',
    ticker: 'SCT-B',
    action: 'Hold',
    reason: 'Fair valuation',
    score: 0.56,
    price: 160.2,
    changePercent: -0.6,
    quantity: 50,
    marketCap: '85M TND',
  },
  {
    id: 'BT-03',
    name: 'Société C',
    ticker: 'SCT-C',
    action: 'Sell',
    reason: 'Weak cashflow',
    score: 0.2,
    price: 48.75,
    changePercent: -4.2,
    quantity: 200,
    marketCap: '30M TND',
  },
];

const mockStartupRequests = () => [
  {
    id: 'SU-101',
    name: 'FinTech Tunisia',
    amount: 200000,
    stage: 'Seed',
    score: 0.78,
    equityOffered: '8%',
    valuation: '2.5M TND',
    founder: 'A. Ben Ali',
    summary: 'Payments infrastructure for SMEs in Tunisia.',
  },
  {
    id: 'SU-102',
    name: 'AgriTech SA',
    amount: 120000,
    stage: 'Pre-Seed',
    score: 0.65,
    equityOffered: '5%',
    valuation: '900k TND',
    founder: 'S. Mhiri',
    summary: 'Sensor + analytics platform to optimize irrigation.',
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
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7 space-y-6">
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
          <h3 className="font-semibold mb-2">Recommended Bourse Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="font-semibold">{r.price.toLocaleString()} TND <span className={`ml-2 text-sm ${r.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>({r.changePercent >= 0 ? '+' : ''}{r.changePercent}%)</span></div>
                  <div className="text-xs text-gray-500 mt-1">Holding: {r.quantity} · Current: {(r.price * r.quantity).toLocaleString()} TND</div>
                  <div className="text-sm text-gray-500 mt-2">{r.reason}</div>
                  <div className="text-sm text-gray-500 mt-2">score: {Math.round(r.score * 100)}%</div>
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

      <div className="col-span-12 xl:col-span-5 space-y-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">Startup Funding Requests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((s) => (
              <div key={s.id} className="p-4 border rounded bg-white dark:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{s.name}</div>
                    <div className="text-sm text-gray-500">Founder: {s.founder}</div>
                    <div className="text-sm text-gray-500">Stage: {s.stage} · Valuation: {s.valuation}</div>
                    <div className="text-sm text-gray-600 mt-2">{s.summary}</div>
                  </div>
                  <div className="ml-4 text-right w-40">
                    <div className="text-sm text-gray-500">Requested</div>
                    <div className="font-semibold">{s.amount.toLocaleString()} TND</div>
                    <div className="text-sm text-gray-500 mt-1">Equity: {s.equityOffered}</div>
                    <div className="text-sm text-gray-500 mt-1">score: {Math.round(s.score * 100)}%</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded">View</button>
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded">Invest</button>
                  <button className="px-3 py-1 text-sm border rounded">Decline</button>
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
