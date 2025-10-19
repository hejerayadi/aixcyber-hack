export const metadata = {
  title: 'My Portfolio - AtlasWealth',
  description: 'Portfolio overview for the investor including holdings, startups, transactions and analytics',
};

import Analytics from '../../../components/portfolio/Analytics';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Portfolio</h1>

      <section className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-semibold mb-2">Overview</h2>
        <p className="text-sm text-gray-500">Total value, diversification and performance summary.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Total value: <strong>125,000 TND</strong></div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Diversification: <strong>Stocks 60% · Startups 25% · Cash 15%</strong></div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">Performance: <strong>+7.0% YTD</strong></div>
        </div>
      </section>

      <section className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-semibold mb-2">Stocks (Actions)</h2>
        <p className="text-sm text-gray-500">List of stocks, quantities, current value and gains/losses.</p>
        <div className="mt-3">
          <div className="flex justify-between text-sm py-2 border-b"><div>Société A (TUN)</div><div>100 · 15,000 TND · +1,200 TND</div></div>
          <div className="flex justify-between text-sm py-2 border-b"><div>Société B (TUN)</div><div>50 · 8,000 TND · -400 TND</div></div>
        </div>
      </section>

      <section className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-semibold mb-2">Startups</h2>
        <p className="text-sm text-gray-500">Amounts invested, shares owned, latest valuation and news/updates.</p>
        <div className="mt-3">
          <div className="flex justify-between text-sm py-2 border-b"><div>FinTech Tunisia</div><div>200,000 TND · 8% · Valuation: 2.5M TND</div></div>
          <div className="flex justify-between text-sm py-2 border-b"><div>AgriTech SA</div><div>120,000 TND · 4% · Valuation: 900k TND</div></div>
        </div>
      </section>

      <section className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-semibold mb-2">Other Assets</h2>
        <p className="text-sm text-gray-500">Bonds, funds, cash and other supported asset classes.</p>
        <div className="mt-3 text-sm">
          <div>Cash: 15,000 TND</div>
          <div>Bonds: 10,000 TND</div>
        </div>
      </section>

      <section className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-semibold mb-2">Transactions</h2>
        <p className="text-sm text-gray-500">Investment history, capital calls and distributions.</p>
        <div className="mt-3 text-sm">
          <div className="border-b py-2">2025-09-15 · Bought Société A · 100 shares · 14,000 TND</div>
          <div className="border-b py-2">2025-08-10 · Invested in FinTech Tunisia · 200,000 TND</div>
        </div>
      </section>

      <section className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-semibold mb-2">Analytics</h2>
        <p className="text-sm text-gray-500">Charts, risk indicators and personalized AI recommendations.</p>
        <div className="mt-3">
          <Analytics />
        </div>
      </section>
    </div>
  );
}
