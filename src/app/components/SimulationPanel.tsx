import { useState } from 'react';
import { Play, Square, RotateCcw, Settings } from 'lucide-react';
import { SimulationState, TradingSettings } from '../App';

interface SimulationPanelProps {
  simulationState: SimulationState;
  onUpdate: (state: SimulationState) => void;
  settings: TradingSettings;
}

export function SimulationPanel({ simulationState, onUpdate, settings }: SimulationPanelProps) {
  const [initialBalance, setInitialBalance] = useState(simulationState.initialBalance);

  const handleStart = () => {
    onUpdate({
      ...simulationState,
      isRunning: true
    });
  };

  const handleStop = () => {
    onUpdate({
      ...simulationState,
      isRunning: false
    });
  };

  const handleReset = () => {
    onUpdate({
      isRunning: false,
      initialBalance: initialBalance,
      currentBalance: initialBalance,
      positions: [],
      trades: [],
      totalPnl: 0
    });
  };

  return (
    <div className="bg-white rounded-lg border border-purple-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-600" />
        <h2 className="font-semibold text-lg">Simulation Settings</h2>
      </div>

      {/* Initial Balance Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Initial Balance (USD)</label>
        <input
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(Number(e.target.value))}
          disabled={simulationState.isRunning}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mb-4">
        {!simulationState.isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors px-4"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs text-purple-800">
          <strong>Simulation Mode:</strong> Trading with fake money using real market prices.
          Set your initial balance above and start the bot to simulate trading.
        </p>
      </div>
    </div>
  );
}