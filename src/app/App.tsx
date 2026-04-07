import { useState, useEffect } from 'react';
import { WalletManager, WalletInfo } from './components/WalletManager';
import { TradingOverview } from './components/TradingOverview';
import { SettingsPanel } from './components/SettingsPanel';
import { LivePriceChart } from './components/LivePriceChart';
import { PerformanceStats } from './components/PerformanceStats';
import { TradingBotPanel } from './components/TradingBotPanel';
import { SimulationPanel } from './components/SimulationPanel';
import { Bot, PlayCircle, Settings } from 'lucide-react';

type TradingMode = 'real' | 'simulation';

export interface TradingSettings {
  capitalPerTrade: number; // % or absolute amount
  slippageTolerance: number;
  stopLossStd: number;
  maxDrawdown: number;
  cooldownMinutes: number;
  tradingEnabled: boolean;
  amountType: 'percentage' | 'fixed';
}

export interface SimulationState {
  isRunning: boolean;
  initialBalance: number;
  currentBalance: number;
  positions: any[];
  trades: any[];
  totalPnl: number;
}

const defaultSettings: TradingSettings = {
  capitalPerTrade: 10,
  slippageTolerance: 0.5,
  stopLossStd: 3,
  maxDrawdown: 20,
  cooldownMinutes: 5,
  tradingEnabled: false,
  amountType: 'percentage'
};

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [botActive, setBotActive] = useState(false);
  const [tradingMode, setTradingMode] = useState<TradingMode>('real');
  const [settings, setSettings] = useState<TradingSettings>(defaultSettings);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    initialBalance: 10000,
    currentBalance: 10000,
    positions: [],
    trades: [],
    totalPnl: 0
  });

  const handleWalletConnect = (info: WalletInfo) => {
    console.log('[App] handleWalletConnect called with:', info);
    setWalletConnected(true);
    setWalletInfo(info);
  };

  const handleBotToggle = (active: boolean) => {
    setBotActive(active);
  };

  const handleSettingsChange = (newSettings: TradingSettings) => {
    setSettings(newSettings);
  };

  const handleSimulationUpdate = (newState: SimulationState) => {
    setSimulationState(newState);
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
            
            {/* Trading Mode Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setTradingMode('real')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tradingMode === 'real'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                Real Trading
              </button>
              <button
                onClick={() => setTradingMode('simulation')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tradingMode === 'simulation'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                Simulation
              </button>
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
        {/* Performance Stats - Different for each mode */}
        <div className="mb-6">
          <PerformanceStats 
            mode={tradingMode}
            simulationState={tradingMode === 'simulation' ? simulationState : undefined}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Settings */}
          <div className="space-y-6">
            {tradingMode === 'real' ? (
              <WalletManager onWalletConnect={handleWalletConnect} />
            ) : (
              <SimulationPanel 
                simulationState={simulationState}
                onUpdate={handleSimulationUpdate}
                settings={settings}
              />
            )}
            <SettingsPanel 
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>

          {/* Middle Column - Price Chart & Trading */}
          <div className="lg:col-span-2 space-y-6">
            {tradingMode === 'real' ? (
              <>
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
              </>
            ) : (
              <>
                {/* Simulation Trading Overview */}
                <div className="bg-white rounded-lg border border-purple-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <h2 className="font-semibold text-lg">Simulation Trading</h2>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      simulationState.isRunning ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {simulationState.isRunning ? 'Running' : 'Stopped'}
                    </div>
                  </div>
                  
                  {/* Simulation Balance */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500">Initial</div>
                      <div className="text-xl font-bold text-gray-900">
                        ${simulationState.initialBalance.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500">Current</div>
                      <div className={`text-xl font-bold ${
                        simulationState.currentBalance >= simulationState.initialBalance 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${simulationState.currentBalance.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500">P&L</div>
                      <div className={`text-xl font-bold ${
                        simulationState.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {simulationState.totalPnl >= 0 ? '+' : ''}${simulationState.totalPnl.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Simulation Positions */}
                  <div className="mb-4">
                    <h3 className="text-sm text-gray-600 mb-3">Open Positions</h3>
                    {simulationState.positions.length === 0 ? (
                      <div className="text-sm text-gray-400 italic">No open positions</div>
                    ) : (
                      <div className="space-y-2">
                        {simulationState.positions.map((pos: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium">{pos.side}</div>
                            <div className="text-sm">${pos.amount.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Trades */}
                  <div>
                    <h3 className="text-sm text-gray-600 mb-3">Recent Trades</h3>
                    {simulationState.trades.length === 0 ? (
                      <div className="text-sm text-gray-400 italic">No trades yet</div>
                    ) : (
                      <div className="space-y-1">
                        {simulationState.trades.slice(-5).reverse().map((trade: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-xs text-gray-500">{trade.time}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              trade.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>{trade.side}</span>
                            <span className="text-xs font-mono">${trade.price.toFixed(2)}</span>
                            <span className={`text-xs ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <LivePriceChart />
                
                {/* Dynamic Trading Overview for Simulation */}
                <TradingOverview 
                  walletConnected={true}
                  walletInfo={{
                    address: 'SIMULATION',
                    chainId: 42161,
                    networkName: 'Simulation Mode',
                    balances: {
                      USD: simulationState.currentBalance.toString()
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>
              ⚠️ Trading cryptocurrencies involves significant risk. Only trade with funds you can afford to lose.
              {tradingMode === 'simulation' && ' Simulation mode uses fake money.'}
            </p>
            <p>© 2026 DeFi Trading Bot</p>
          </div>
        </footer>
      </main>
    </div>
  );
}