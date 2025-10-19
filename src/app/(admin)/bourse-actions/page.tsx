
export const metadata = {
  title: 'Bourse Actions | Admin',
};

export default function BourseActionsPage() {
  const data = [
    { id: 'BT-01', name: 'Société A', ticker: 'SCT-A', price: 150.5, changePercent: 2.4, quantity: 100, marketCap: '120M TND', action: 'Buy', score: 0.86 },
    { id: 'BT-02', name: 'Société B', ticker: 'SCT-B', price: 160.2, changePercent: -0.6, quantity: 50, marketCap: '85M TND', action: 'Hold', score: 0.56 },
    { id: 'BT-03', name: 'Société C', ticker: 'SCT-C', price: 48.75, changePercent: -4.2, quantity: 200, marketCap: '30M TND', action: 'Sell', score: 0.2 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Bourse Actions</h1>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <h2 className="font-semibold mb-4">Recommended Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((r) => (
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
  );
}
