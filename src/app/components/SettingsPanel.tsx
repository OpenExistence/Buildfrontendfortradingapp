import { useState } from 'react';
import { Settings, Save } from 'lucide-react';

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    capitalPerTrade: 10,
    slippageTolerance: 0.5,
    stopLoss: 3,
    maxDrawdown: 15,
    tradingEnabled: true,
    cooldownMinutes: 5
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // Mock save action
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="font-semibold text-lg">Settings</h2>
      </div>

      <div className="space-y-5">
        {/* Capital per trade */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Capital per Trade (%)
          </label>
          <input
            type="number"
            value={settings.capitalPerTrade}
            onChange={(e) =>
              setSettings({ ...settings, capitalPerTrade: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum capital to use per single trade
          </p>
        </div>

        {/* Slippage */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Slippage Tolerance (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={settings.slippageTolerance}
            onChange={(e) =>
              setSettings({ ...settings, slippageTolerance: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0.1"
            max="5"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum acceptable price slippage
          </p>
        </div>

        {/* Stop Loss */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Stop Loss (std deviations)
          </label>
          <input
            type="number"
            value={settings.stopLoss}
            onChange={(e) =>
              setSettings({ ...settings, stopLoss: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="5"
          />
          <p className="text-xs text-gray-500 mt-1">
            Stop loss if price exceeds N standard deviations
          </p>
        </div>

        {/* Max Drawdown */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Max Drawdown (%)
          </label>
          <input
            type="number"
            value={settings.maxDrawdown}
            onChange={(e) =>
              setSettings({ ...settings, maxDrawdown: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="5"
            max="50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Stop trading if cumulative loss exceeds this threshold
          </p>
        </div>

        {/* Cooldown */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Cooldown Between Trades (minutes)
          </label>
          <input
            type="number"
            value={settings.cooldownMinutes}
            onChange={(e) =>
              setSettings({ ...settings, cooldownMinutes: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="60"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum time to wait between trades
          </p>
        </div>

        {/* Trading Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium">Trading Enabled</div>
            <div className="text-xs text-gray-500">
              Enable or disable automatic trading
            </div>
          </div>
          <button
            onClick={() =>
              setSettings({ ...settings, tradingEnabled: !settings.tradingEnabled })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.tradingEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.tradingEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
