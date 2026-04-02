import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function TradingOverview() {
  // Mock data
  const currentPrice = 64234.56;
  const rangeData = {
    lower: 62800.0,
    center: 64500.0,
    upper: 66200.0,
    status: 'range-bound' as const
  };

  const openPositions = [
    { id: 'pos-1', side: 'LONG', entry: 63100.5, amount: 0.0234, pnl: 265.43, pnlPercent: 1.8 },
    { id: 'pos-2', side: 'SHORT', entry: 65800.2, amount: 0.0156, pnl: 145.23, pnlPercent: 1.4 }
  ];

  const recentTrades = [
    { id: 'trade-1', time: '14:23:45', side: 'BUY', price: 63100.5, amount: 0.0234, pnl: null },
    { id: 'trade-2', time: '13:15:22', side: 'SELL', price: 64800.3, amount: 0.0189, pnl: 215.34 },
    { id: 'trade-3', time: '12:04:11', side: 'BUY', price: 63500.1, amount: 0.0189, pnl: null }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-purple-600" />
        <h2 className="font-semibold text-lg">Trading Overview</h2>
      </div>

      {/* Trading Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-gray-600">Current Range</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            {rangeData.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Upper Band</span>
            <span className="text-sm font-mono text-red-600">
              ${rangeData.upper.toLocaleString()}
            </span>
          </div>
          <div className="relative h-8 bg-gradient-to-r from-green-200 via-yellow-100 to-red-200 rounded-lg overflow-hidden">
            <div
              className="absolute top-0 h-full w-1 bg-blue-600"
              style={{
                left: `${((currentPrice - rangeData.lower) / (rangeData.upper - rangeData.lower)) * 100}%`
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                ${currentPrice.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Center (SMA)</span>
            <span className="text-sm font-mono text-gray-700">
              ${rangeData.center.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Lower Band</span>
            <span className="text-sm font-mono text-green-600">
              ${rangeData.lower.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-600 mb-3">Open Positions</h3>
        <div className="space-y-2">
          {openPositions.map((position) => (
            <div
              key={position.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {position.side === 'LONG' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <div>
                  <div className="text-sm font-medium">{position.side}</div>
                  <div className="text-xs text-gray-500">
                    Entry: ${position.entry.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{position.amount} BTC</div>
                <div className={`text-xs ${position.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  +${position.pnl} ({position.pnlPercent}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <h3 className="text-sm text-gray-600 mb-3">Recent Trades</h3>
        <div className="space-y-1">
          {recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">{trade.time}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    trade.side === 'BUY'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {trade.side}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono">${trade.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500">{trade.amount} BTC</span>
                {trade.pnl && (
                  <span className="text-xs text-green-600 w-16 text-right">
                    +${trade.pnl}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
