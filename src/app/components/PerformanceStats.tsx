import { DollarSign, TrendingUp, Percent, Activity } from 'lucide-react';
import { SimulationState } from '../App';

interface PerformanceStatsProps {
  mode: 'real' | 'simulation';
  simulationState?: SimulationState;
}

export function PerformanceStats({ mode, simulationState }: PerformanceStatsProps) {
  // For simulation mode, calculate stats from simulationState
  const simPnl = simulationState?.totalPnl || 0;
  const simBalance = simulationState?.currentBalance || 10000;
  const simInitial = simulationState?.initialBalance || 10000;
  const simPnlPercent = ((simPnl / simInitial) * 100);
  const simTrades = simulationState?.trades?.length || 0;
  
  // Mock real stats (would come from backend in production)
  const stats = mode === 'simulation' ? [
    {
      id: 'pnl',
      label: 'Total PnL',
      value: `${simPnl >= 0 ? '+' : ''}$${simPnl.toFixed(2)}`,
      change: `${simPnlPercent >= 0 ? '+' : ''}${simPnlPercent.toFixed(2)}%`,
      icon: DollarSign,
      color: simPnl >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: simPnl >= 0 ? 'bg-green-50' : 'bg-red-50',
      positive: simPnl >= 0
    },
    {
      id: 'balance',
      label: 'Current Balance',
      value: `$${simBalance.toLocaleString()}`,
      change: `$${simInitial.toLocaleString()} initial`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      positive: true
    },
    {
      id: 'trades',
      label: 'Total Trades',
      value: simTrades.toString(),
      change: simulationState?.isRunning ? 'Running' : 'Stopped',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      positive: true
    },
    {
      id: 'avgtrade',
      label: 'Avg Trade',
      value: simTrades > 0 ? `$${(simPnl / simTrades).toFixed(2)}` : '$0.00',
      change: simTrades > 0 ? '+0.00%' : 'No trades',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      positive: true
    }
  ] : [
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