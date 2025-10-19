
export const metadata = {
  title: 'Startup Funding Requests | Admin',
};

export default function StartupRequestsPage() {
  const data = [
    { id: 'SU-101', name: 'FinTech Tunisia', amount: 200000, stage: 'Seed', score: 0.78, equityOffered: '8%', valuation: '2.5M TND', founder: 'A. Ben Ali', summary: 'Payments infrastructure for SMEs.' },
    { id: 'SU-102', name: 'AgriTech SA', amount: 120000, stage: 'Pre-Seed', score: 0.65, equityOffered: '5%', valuation: '900k TND', founder: 'S. Mhiri', summary: 'Sensor + analytics for irrigation.' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Startup Funding Requests</h1>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <h2 className="font-semibold mb-4">Incoming Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((s) => (
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
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded">Approve Invest</button>
                <button className="px-3 py-1 text-sm border rounded">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
