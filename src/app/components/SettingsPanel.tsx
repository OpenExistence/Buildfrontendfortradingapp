import { Settings, Save } from 'lucide-react';
import { TradingSettings } from '../App';

interface SettingsPanelProps {
  settings: TradingSettings;
  onSettingsChange: (settings: TradingSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const handleChange = (key: keyof TradingSettings, value: number | boolean | string) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="font-semibold text-lg">Settings</h2>
      </div>

      <div className="space-y-5">
        {/* Amount Type Toggle */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Trade Amount Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange('amountType', 'percentage')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.amountType === 'percentage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Percentage (%)
            </button>
            <button
              onClick={() => handleChange('amountType', 'fixed')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.amountType === 'fixed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Fixed ($)
            </button>
          </div>
        </div>

        {/* Capital per trade */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {settings.amountType === 'percentage' ? 'Capital per Trade (%)' : 'Capital per Trade ($)'}
          </label>
          <input
            type="number"
            value={settings.capitalPerTrade}
            onChange={(e) => handleChange('capitalPerTrade', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max={settings.amountType === 'percentage' ? 100 : 10000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {settings.amountType === 'percentage' 
              ? 'Maximum capital to use per single trade (% of balance)'
              : 'Maximum capital to use per single trade (fixed amount)'
            }
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
            onChange={(e) => handleChange('slippageTolerance', Number(e.target.value))}
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
            value={settings.stopLossStd}
            onChange={(e) => handleChange('stopLossStd', Number(e.target.value))}
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
            onChange={(e) => handleChange('maxDrawdown', Number(e.target.value))}
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
            onChange={(e) => handleChange('cooldownMinutes', Number(e.target.value))}
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
            onClick={() => handleChange('tradingEnabled', !settings.tradingEnabled)}
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
          onClick={() => console.log('Settings saved:', settings)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}