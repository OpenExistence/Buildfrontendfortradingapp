import { useState, useEffect } from 'react';
import { Bot, Power, PowerOff, Loader2, AlertCircle } from 'lucide-react';
import { WalletInfo } from './WalletManager';

interface TradingBotPanelProps {
  botActive: boolean;
  onBotToggle: (active: boolean) => void;
  walletConnected: boolean;
  walletInfo: WalletInfo | null;
}

interface BotStatus {
  status: 'inactive' | 'active' | 'error';
  message: string;
  lastUpdate: string;
  activePositions: number;
  totalPnl: number;
}

export function TradingBotPanel({ botActive, onBotToggle, walletConnected, walletInfo }: TradingBotPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<BotStatus>({
    status: 'inactive',
    message: 'Bot is not running',
    lastUpdate: new Date().toLocaleTimeString(),
    activePositions: 0,
    totalPnl: 0
  });

  // Simulate bot status polling (in real app, this would connect to backend)
  useEffect(() => {
    if (!botActive) {
      setStatus({
        status: 'inactive',
        message: 'Bot is not running',
        lastUpdate: new Date().toLocaleTimeString(),
        activePositions: 0,
        totalPnl: 0
      });
      return;
    }

    // Simulate status updates
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        status: 'active',
        message: 'Scanning market conditions...',
        lastUpdate: new Date().toLocaleTimeString(),
        activePositions: Math.floor(Math.random() * 2),
        totalPnl: Math.random() * 500 - 100
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [botActive]);

  const handleToggle = async () => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate bot toggle (in real app, this would call backend API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      onBotToggle(!botActive);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle bot');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'active':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'active':
        return 'ACTIVE';
      case 'error':
        return 'ERROR';
      default:
        return 'INACTIVE';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-lg">Trading Bot</h2>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${botActive ? 'animate-pulse' : ''}`} />
          <span className={`text-sm font-bold ${botActive ? 'text-green-600' : 'text-gray-500'}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Status Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Active Positions</div>
          <div className="text-2xl font-bold text-gray-900">{status.activePositions}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Total P&L</div>
          <div className={`text-2xl font-bold ${status.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {status.totalPnl >= 0 ? '+' : ''}${status.totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="mb-6 text-sm text-gray-600">
        <span className="font-medium">Status:</span> {status.message}
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
          botActive
            ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
            : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : botActive ? (
          <>
            <PowerOff className="w-5 h-5" />
            Stop Bot
          </>
        ) : (
          <>
            <Power className="w-5 h-5" />
            Start Bot
          </>
        )}
      </button>

      {/* Wallet requirement hint */}
      {!walletConnected && (
        <p className="mt-3 text-xs text-center text-gray-500">
          Connect your wallet to enable the trading bot
        </p>
      )}
    </div>
  );
}