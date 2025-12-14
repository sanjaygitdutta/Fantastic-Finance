
const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

export interface TwelveDataPrice {
    symbol: string;
    price: number;
    percent_change?: number; // Note: 'price' endpoint provides price, 'quote' provides change
}

// Map App Symbols to Twelve Data Symbols
export const TWELVE_DATA_MAPPING: Record<string, string> = {
    'NASDAQ': 'IXIC',
    'DOW JONES': 'DJI',
    'S&P 500': 'GSPC',
    'DAX': 'GDAXI',
    'FTSE': 'FTSE',
    'BTC': 'BTC/USD',
    'ETH': 'ETH/USD',
    'SOL': 'SOL/USD',
    'GOLD': 'XAU/USD',
    'SILVER': 'XAG/USD',
    // Extended Crypto
    'XRP': 'XRP/USD',
    'ADA': 'ADA/USD',
    'DOGE': 'DOGE/USD',
    'DOT': 'DOT/USD',
    'UNI': 'UNI/USD',
    'LINK': 'LINK/USD',
    'BCH': 'BCH/USD',
    // US Tech Titans
    'AAPL': 'AAPL',
    'MSFT': 'MSFT',
    'GOOGL': 'GOOGL',
    'AMZN': 'AMZN',
    'TSLA': 'TSLA',
    'META': 'META',
    'NVDA': 'NVDA',
    'VIX': 'VIX'
};

/**
 * Fetches current price for a single symbol
 */
export const getPrice = async (symbol: string): Promise<number | null> => {
    if (!API_KEY) return null;
    try {
        const response = await fetch(`${BASE_URL}/price?symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        if (data.price) {
            return parseFloat(data.price);
        }
        console.warn(`TwelveData error for ${symbol}:`, data);
        return null;
    } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
        return null;
    }
};

/**
 * Fetches batch prices. 
 * Note: Twelve Data Free tier limitation might restrict batch size or frequency.
 * Returns a map of Twelve Data Symbol -> Price
 */
export const getBatchPrices = async (symbols: string[]): Promise<Record<string, number>> => {
    if (!API_KEY || symbols.length === 0) return {};

    try {
        const symbolString = symbols.join(',');
        const response = await fetch(`${BASE_URL}/price?symbol=${symbolString}&apikey=${API_KEY}`);
        const data = await response.json();

        const results: Record<string, number> = {};

        // If single symbol requested, format is { price: "..." }
        if (symbols.length === 1 && data.price) {
            results[symbols[0]] = parseFloat(data.price);
            return results;
        }

        // If multiple, format is { "BTC/USD": { price: "..." }, ... }
        Object.entries(data).forEach(([key, val]: [string, any]) => {
            if (val.price) {
                results[key] = parseFloat(val.price);
            }
        });

        return results;
    } catch (error) {
        console.error('Failed to fetch batch prices:', error);
        return {};
    }
};

/**
 * Fetches detailed quote (includes change %) for batch symbols
 */
export const getBatchQuotes = async (symbols: string[]): Promise<Record<string, { price: number; change: number; changePercent: number }>> => {
    if (!API_KEY || symbols.length === 0) return {};

    try {
        const symbolString = symbols.join(',');
        const response = await fetch(`${BASE_URL}/quote?symbol=${symbolString}&apikey=${API_KEY}`);
        const data = await response.json();

        const results: Record<string, { price: number; change: number; changePercent: number }> = {};

        const processItem = (item: any, symbol: string) => {
            if (item.close && item.previous_close) {
                const price = parseFloat(item.close); // 'close' is current price in quote endpoint if market open, or last close
                // Actually 'close' in quote endpoint is usually the last traded price? 
                // Let's use 'close' or check if there is a 'latest_trading_day' logic. 
                // Documentation says: quote endpoint returns "close", "previous_close", "percent_change", etc.
                const change = parseFloat(item.change);
                const changePercent = parseFloat(item.percent_change);
                results[symbol] = { price, change, changePercent };
            }
        };

        if (symbols.length === 1) {
            if (data.symbol) processItem(data, data.symbol);
        } else {
            Object.entries(data).forEach(([_, val]: [string, any]) => {
                if (val.symbol) processItem(val, val.symbol);
            });
        }

        return results;

    } catch (error) {
        console.error("Failed to fetch batch quotes:", error);
        return {};
    }
};
