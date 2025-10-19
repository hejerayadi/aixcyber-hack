"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';

// Load react-apexcharts only on client
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }) as any;

const mockPerformance = () => ({
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  series: [100000, 102000, 98000, 105000, 110000, 120000, 125000],
});

const mockAllocation = () => ({
  labels: ['Stocks', 'Startups', 'Bonds', 'Cash'],
  series: [60, 25, 5, 10],
});

const mockHoldings = () => ({
  categories: ['Société A', 'Société B', 'Société C'],
  series: [15000, 8000, 6000],
});

export default function Analytics() {
  const perf = mockPerformance();
  const alloc = mockAllocation();
  const holdings = mockHoldings();

  // simple derived metrics (mocked calculations)
  const returns = perf.series[perf.series.length - 1] / perf.series[0] - 1;
  const volatility = 0.12; // mock annualized volatility
  const sharpe = (returns / volatility).toFixed(2);
  const maxDrawdown = -6.5; // mock
  const riskScore = Math.max(0, Math.round((volatility * 100) / 2));

  const perfOptions: any = {
    chart: { id: 'perf', toolbar: { show: false } },
    xaxis: { categories: perf.categories },
    stroke: { curve: 'smooth' },
    colors: ['#06b6d4'],
    tooltip: { enabled: true },
  };

  const perfSeries: any = [
    { name: 'Portfolio value', data: perf.series },
  ];

  const allocOptions: any = {
    chart: { type: 'donut' },
    labels: alloc.labels,
    colors: ['#4f46e5', '#6366f1', '#10b981', '#f59e0b'],
    legend: { position: 'bottom' },
  };

  const holdingsOptions: any = {
    chart: { id: 'holdings', toolbar: { show: false } },
    xaxis: { categories: holdings.categories },
    colors: ['#7c3aed'],
  };

  const holdingsSeries: any = [
    { name: 'Current value', data: holdings.series },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="text-sm text-gray-500">Risk Score</div>
          <div className="text-2xl font-semibold">{riskScore}</div>
          <div className="text-sm text-gray-500">Estimated portfolio risk</div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="text-sm text-gray-500">Sharpe Ratio</div>
          <div className="text-2xl font-semibold">{sharpe}</div>
          <div className="text-sm text-gray-500">Return / volatility</div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="text-sm text-gray-500">Max Drawdown</div>
          <div className="text-2xl font-semibold">{maxDrawdown}%</div>
          <div className="text-sm text-gray-500">Worst peak-to-trough</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">Performance</h3>
          <div className="h-56">
            {typeof window !== 'undefined' && (
              <ReactApexChart options={perfOptions} series={perfSeries} type="line" height={220} />
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">Allocation</h3>
          <div className="h-48">
            {typeof window !== 'undefined' && (
              <ReactApexChart options={allocOptions} series={alloc.series} type="donut" height={180} />
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="font-semibold mb-2">Holdings Breakdown</h3>
        <div className="h-48">
          {typeof window !== 'undefined' && (
            <ReactApexChart options={holdingsOptions} series={holdingsSeries} type="bar" height={220} />
          )}
        </div>
      </div>
    </div>
  );
}
