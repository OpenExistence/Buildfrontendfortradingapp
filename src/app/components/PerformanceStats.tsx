import { DollarSign, TrendingUp, Percent, Activity } from 'lucide-react';

export function PerformanceStats() {
  const stats = [
    {
      id: 'pnl',
      label: 'Total PnL',
      value: '+$2,456.78',
      change: '+8.42%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      positive: true
    },
    {
      id: 'winrate',
      label: 'Win Rate',
      value: '68.5%',
      change: '+2.3%',
      icon: Percent,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      positive: true
    },
    {
      id: 'trades',
      label: 'Total Trades',
      value: '127',
      change: '+12 today',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      positive: true
    },
    {
      id: 'avgtrade',
      label: 'Avg Trade',
      value: '+$19.34',
      change: '+0.89%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </span>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className={`text-2xl font-semibold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
