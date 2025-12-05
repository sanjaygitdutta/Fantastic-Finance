/**
 * IV Data Service
 * Handles fetching and managing historical IV data
 * Supports both simulated (demo) and real data sources
 */

import { IVDataPoint } from '../utils/ivCalculations';

// Configuration flag - set to false when real data is available
const USE_SIMULATED_DATA = true;

/**
 * Generate simulated 52-week historical IV data for demonstration
 * This simulates realistic IV patterns with volatility clusters
 */
function generateSimulatedIVHistory(currentIV: number, symbol: string): IVDataPoint[] {
    const data: IVDataPoint[] = [];
    const today = new Date();
    const daysToGenerate = 252; // Trading days in a year

    // Base IV varies by symbol
    const baseIV = symbol.includes('Bank') ? 0.25 : symbol.includes('Fin') ? 0.22 : 0.20;
    const volatility = 0.08; // How much IV fluctuates

    let previousIV = currentIV;

    for (let i = daysToGenerate; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Mean reversion with random walk
        const meanReversion = (baseIV - previousIV) * 0.1;
        const randomWalk = (Math.random() - 0.5) * volatility;
        const newIV = Math.max(0.10, Math.min(0.60, previousIV + meanReversion + randomWalk));

        // Add volatility clusters (periods of high/low IV)
        const clusterEffect = Math.sin(i / 30) * 0.03;
        const finalIV = Math.max(0.10, newIV + clusterEffect);

        data.push({
            date: date.toISOString().split('T')[0],
            iv: Math.round(finalIV * 1000) / 1000
        });

        previousIV = finalIV;
    }

    return data;
}

/**
 * Fetch historical IV data from real API
 * TODO: Implement when real data source is available
 */
async function fetchRealIVHistory(symbol: string, expiry: string): Promise<IVDataPoint[]> {
    // Placeholder for real API integration
    // Example:
    // const response = await fetch(`/api/iv-history?symbol=${symbol}&expiry=${expiry}`);
    // return await response.json();

    throw new Error('Real IV data source not yet configured. Please implement fetchRealIVHistory()');
}

/**
 * Get historical IV data (automatically switches between simulated and real)
 */
export async function getHistoricalIV(
    symbol: string,
    expiry: string,
    currentIV: number
): Promise<{ data: IVDataPoint[]; isSimulated: boolean }> {
    try {
        if (USE_SIMULATED_DATA) {
            // Return simulated data for demo
            return {
                data: generateSimulatedIVHistory(currentIV, symbol),
                isSimulated: true
            };
        } else {
            // Fetch real data when available
            const data = await fetchRealIVHistory(symbol, expiry);
            return {
                data,
                isSimulated: false
            };
        }
    } catch (error) {
        console.error('Error fetching IV history:', error);
        // Fallback to simulated data
        return {
            data: generateSimulatedIVHistory(currentIV, symbol),
            isSimulated: true
        };
    }
}

/**
 * Save IV snapshot to local storage for historical tracking
 * This accumulates real data over time
 */
export function saveIVSnapshot(symbol: string, expiry: string, iv: number): void {
    const key = `iv_history_${symbol}_${expiry}`;
    const stored = localStorage.getItem(key);
    const history: IVDataPoint[] = stored ? JSON.parse(stored) : [];

    const today = new Date().toISOString().split('T')[0];

    // Add today's snapshot if not already present
    if (!history.some(d => d.date === today)) {
        history.push({ date: today, iv });

        // Keep only last 252 trading days
        if (history.length > 252) {
            history.shift();
        }

        localStorage.setItem(key, JSON.stringify(history));
    }
}

/**
 * Get accumulated IV history from local storage
 */
export function getLocalIVHistory(symbol: string, expiry: string): IVDataPoint[] {
    const key = `iv_history_${symbol}_${expiry}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Check if we have enough real data accumulated
 */
export function hasEnoughRealData(symbol: string, expiry: string, minDays: number = 30): boolean {
    const localData = getLocalIVHistory(symbol, expiry);
    return localData.length >= minDays;
}
