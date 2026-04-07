import { useState } from 'react';
import { WalletManager, WalletInfo } from './components/WalletManager';
import { TradingOverview } from './components/TradingOverview';
import { SettingsPanel } from './components/SettingsPanel';
import { LivePriceChart } from './components/LivePriceChart';
import { PerformanceStats } from './components/PerformanceStats';
import { TradingBotPanel } from './components/TradingBotPanel';
import { Bot } from 'lucide-react';

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [botActive, setBotActive] = useState(false);

  const handleWalletConnect = (info: WalletInfo) => {
    console.log('[App] handleWalletConnect called with:', info);
    setWalletConnected(true);
    setWalletInfo(info);
  };

  const handleBotToggle = (active: boolean) => {
    setBotActive(active);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DeFi Trading Bot</h1>
                <p className="text-xs text-gray-500">Layer 2 Mean Reversion Strategy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Network</div>
                <div className="text-sm font-medium text-gray-900">Arbitrum One</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Stats */}
        <div className="mb-6">
          <PerformanceStats />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Settings */}
          <div className="space-y-6">
            <WalletManager onWalletConnect={handleWalletConnect} />
            <SettingsPanel />
          </div>

          {/* Middle Column - Price Chart */}
          <div className="lg:col-span-2 space-y-6">
            <TradingBotPanel 
              botActive={botActive} 
              onBotToggle={handleBotToggle}
              walletConnected={walletConnected}
              walletInfo={walletInfo}
            />
            <LivePriceChart />
            <TradingOverview 
              walletConnected={walletConnected}
              walletInfo={walletInfo}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>
              ⚠️ Trading cryptocurrencies involves significant risk. Only trade with funds you can afford to lose.
            </p>
            <p>© 2026 DeFi Trading Bot</p>
          </div>
        </footer>
      </main>
    </div>
  );
}