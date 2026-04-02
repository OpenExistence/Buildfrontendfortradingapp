import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { priceService, PriceData } from '../services/priceService';

export function LivePriceChart() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  const [loading, setLoading] = useState(true);
  const [upperBand, setUpperBand] = useState(0);
  const [lowerBand, setLowerBand] = useState(0);
  const [sma, setSma] = useState(0);
  const [adx, setAdx] = useState(0);

  // Fetch real price data
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeData = async () => {
      try {
        setLoading(true);

        // Fetch historical data (last 50 candles, 5-minute interval)
        const historicalData = await priceService.getHistoricalData('BTCUSDT', '5m', 50);
        setPriceData(historicalData);

        // Set initial price
        if (historicalData.length > 0) {
          const lastPrice = historicalData[historicalData.length - 1].price;
          const firstPrice = historicalData[0].price;
          setCurrentPrice(lastPrice);
          setPriceChange({
            value: lastPrice - firstPrice,
            percent: ((lastPrice - firstPrice) / firstPrice) * 100
          });

          // Calculate indicators
          const prices = historicalData.map(d => d.price);
          const bands = priceService.calculateBollingerBands(prices, 20, 2);
          setUpperBand(bands.upper);
          setLowerBand(bands.lower);
          setSma(bands.middle);
          setAdx(priceService.calculateADX(prices));
        }

        setLoading(false);

        // Subscribe to real-time updates via WebSocket
        unsubscribe = priceService.subscribeToPrice('btcusdt', (newPrice) => {
          setCurrentPrice(newPrice);

          setPriceData((prev) => {
            if (prev.length === 0) return prev;

            // Update the last candle with new price
            const updatedData = [...prev];
            const lastCandle = updatedData[updatedData.length - 1];
            lastCandle.price = newPrice;

            // Calculate new indicators
            const prices = updatedData.map(d => d.price);
            const bands = priceService.calculateBollingerBands(prices, 20, 2);
            setUpperBand(bands.upper);
            setLowerBand(bands.lower);
            setSma(bands.middle);
            setAdx(priceService.calculateADX(prices));

            // Update price change
            const firstPrice = prev[0].price;
            setPriceChange({
              value: newPrice - firstPrice,
              percent: ((newPrice - firstPrice) / firstPrice) * 100
            });

            return updatedData;
          });
        });

      } catch (error) {
        console.error('Error initializing price data:', error);
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup WebSocket on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const isRangeBound = adx < 25;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading real-time BTC price data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-lg">BTC/USDT</h2>
          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
            5m
          </span>
          <span className="text-xs text-green-600 px-2 py-0.5 bg-green-50 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center justify-end gap-1 text-sm ${priceChange.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange.value >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>
              {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} ({priceChange.percent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
          <LineChart data={priceData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['dataMin - 500', 'dataMax + 500']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
            />

            {/* Bollinger Bands */}
            <ReferenceLine
              y={upperBand}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{ value: 'Upper', fontSize: 10, fill: '#ef4444', position: 'right' }}
            />
            <ReferenceLine
              y={sma}
              stroke="#6b7280"
              strokeDasharray="3 3"
              label={{ value: 'SMA', fontSize: 10, fill: '#6b7280', position: 'right' }}
            />
            <ReferenceLine
              y={lowerBand}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: 'Lower', fontSize: 10, fill: '#10b981', position: 'right' }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Market Status */}
      <div className={`mt-4 flex items-center justify-between p-3 rounded-lg ${
        isRangeBound ? 'bg-green-50' : 'bg-orange-50'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isRangeBound ? 'bg-green-500' : 'bg-orange-500'
          }`} />
          <span className={`text-sm ${isRangeBound ? 'text-green-700' : 'text-orange-700'}`}>
            Market Status: {isRangeBound ? 'Range-Bound' : 'Trending'}
          </span>
        </div>
        <span className={`text-xs ${isRangeBound ? 'text-green-600' : 'text-orange-600'}`}>
          ADX: {adx.toFixed(1)} ({isRangeBound ? 'Trading Active' : 'Trading Paused'})
        </span>
      </div>
    </div>
  );
}
