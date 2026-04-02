/**
 * Price Service - Fetches real-time cryptocurrency prices
 * Using Binance public API (no API key required)
 */

export interface PriceData {
  time: string;
  price: number;
  timestamp: number;
  id: string;
}

export interface CurrentPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

class PriceService {
  private baseUrl = 'https://api.binance.com/api/v3';
  private wsUrl = 'wss://stream.binance.com:9443/ws';
  private ws: WebSocket | null = null;

  /**
   * Fetch current price and 24h stats
   */
  async getCurrentPrice(symbol: string = 'BTCUSDT'): Promise<CurrentPrice> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();

      return {
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        change24h: parseFloat(data.priceChange),
        changePercent24h: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        volume24h: parseFloat(data.volume)
      };
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }

  /**
   * Fetch historical klines (candlestick data)
   * @param symbol - Trading pair (e.g., 'BTCUSDT')
   * @param interval - Candle interval (e.g., '5m', '1h', '1d')
   * @param limit - Number of candles to fetch
   */
  async getHistoricalData(
    symbol: string = 'BTCUSDT',
    interval: string = '5m',
    limit: number = 50
  ): Promise<PriceData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      const data = await response.json();

      return data.map((candle: any) => {
        const timestamp = candle[0];
        const closePrice = parseFloat(candle[4]);
        const time = new Date(timestamp);

        return {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: closePrice,
          timestamp: timestamp,
          id: `candle-${timestamp}`
        };
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time price updates via WebSocket
   * @param symbol - Trading pair (e.g., 'btcusdt')
   * @param callback - Function to call with new price updates
   */
  subscribeToPrice(symbol: string = 'btcusdt', callback: (price: number) => void): () => void {
    const streamName = `${symbol.toLowerCase()}@trade`;

    this.ws = new WebSocket(`${this.wsUrl}/${streamName}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      callback(price);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Return cleanup function
    return () => {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    };
  }

  /**
   * Calculate Bollinger Bands from price data
   */
  calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    if (prices.length < period) {
      return { upper: 0, middle: 0, lower: 0 };
    }

    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((a, b) => a + b, 0) / period;

    const squaredDiffs = recentPrices.map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: sma + (stdDev * standardDeviation),
      middle: sma,
      lower: sma - (stdDev * standardDeviation)
    };
  }

  /**
   * Calculate ADX (Average Directional Index) for trend detection
   * Simplified version - returns mock value for now
   * In production, you'd implement the full ATR/DI calculation
   */
  calculateADX(prices: number[]): number {
    // Simplified: calculate price volatility as proxy
    if (prices.length < 14) return 15;

    const recentPrices = prices.slice(-14);
    const changes = [];
    for (let i = 1; i < recentPrices.length; i++) {
      changes.push(Math.abs(recentPrices[i] - recentPrices[i - 1]));
    }

    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;

    // Normalize to 0-100 scale
    const adx = (avgChange / avgPrice) * 100 * 50;
    return Math.min(100, Math.max(0, adx));
  }
}

export const priceService = new PriceService();
