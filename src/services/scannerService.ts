import { getOptionChain } from './optionChainService';

export interface ScannerResult {
    symbol: string;
    strike: number;
    type: 'Call' | 'Put';
    ltp: number;
    priceChange: number; // % change
    oi: number;
    oiChange: number; // % change
    volume: number;
    activityType: 'Long Buildup' | 'Short Buildup' | 'Short Covering' | 'Long Unwinding' | 'Neutral';
    signalStrength: 'High' | 'Medium' | 'Low';
}

const SYMBOLS = [
    { code: 'NSE_INDEX|Nifty 50', label: 'NIFTY' },
    { code: 'NSE_INDEX|Nifty Bank', label: 'BANKNIFTY' },
    { code: 'NSE_INDEX|Nifty Fin Service', label: 'FINNIFTY' }
];

/**
 * Scan for unusual options activity across major indices
 */
export async function scanOptionsActivity(): Promise<ScannerResult[]> {
    const results: ScannerResult[] = [];

    // Fetch data for all symbols in parallel
    const promises = SYMBOLS.map(async (sym) => {
        try {
            // Get nearest expiry data
            // We need to fetch available expiries first to get the nearest one
            const { getAvailableExpiries } = await import('./optionChainService');
            const expiries = await getAvailableExpiries(sym.code);

            if (!expiries || expiries.length === 0) return;

            const nearestExpiry = expiries[0]; // Expiries are sorted, first is nearest
            const chainData = await getOptionChain(sym.code, nearestExpiry);

            if (!chainData || !chainData.strikes) return;

            const strikes = chainData.strikes;
            const spotPrice = chainData.spot_price;

            // Filter for relevant strikes (ATM +/- 10%) to avoid deep OTM noise
            const relevantStrikes = strikes.filter((s: any) => {
                const diff = Math.abs(s.strike_price - spotPrice) / spotPrice;
                return diff <= 0.05; // 5% range
            });

            relevantStrikes.forEach((s: any) => {
                // Analyze Calls
                if (s.call_options) {
                    const res = analyzeOption(sym.label, s.strike_price, 'Call', s.call_options);
                    if (res) results.push(res);
                }
                // Analyze Puts
                if (s.put_options) {
                    const res = analyzeOption(sym.label, s.strike_price, 'Put', s.put_options);
                    if (res) results.push(res);
                }
            });

        } catch (error) {
            console.error(`Error scanning ${sym.label}:`, error);
        }
    });

    await Promise.all(promises);

    // Sort by signal strength (volume * oi change magnitude)
    return results.sort((a, b) => {
        const scoreA = a.volume * Math.abs(a.oiChange);
        const scoreB = b.volume * Math.abs(b.oiChange);
        return scoreB - scoreA;
    });
}

function analyzeOption(symbol: string, strike: number, type: 'Call' | 'Put', data: any): ScannerResult | null {
    const volume = data.volume || 0;
    const oi = data.oi || 0;
    const oiChange = data.oi_change || 0; // Absolute change
    const ltp = data.last_price || 0;

    // Thresholds (MVP)
    const MIN_VOLUME = 50000; // Minimum volume to be significant
    const MIN_OI_CHANGE = 10000; // Minimum OI change to be significant

    if (volume < MIN_VOLUME || Math.abs(oiChange) < MIN_OI_CHANGE) return null;

    const oiChangePercent = (oiChange / (oi - oiChange)) * 100; // Approx % change

    // Determine Activity Type
    let activityType: ScannerResult['activityType'] = 'Neutral';

    if (oiChange > 0) {
        // OI Added
        if (type === 'Call') activityType = 'Short Buildup'; // Resistance
        else activityType = 'Long Buildup'; // Support (Short Puts)
    } else {
        // OI Removed
        if (type === 'Call') activityType = 'Short Covering'; // Resistance breaking
        else activityType = 'Long Unwinding'; // Support breaking
    }

    // Determine Strength
    let signalStrength: 'High' | 'Medium' | 'Low' = 'Low';
    if (Math.abs(oiChangePercent) > 20 && volume > MIN_VOLUME * 2) signalStrength = 'High';
    else if (Math.abs(oiChangePercent) > 10) signalStrength = 'Medium';

    return {
        symbol,
        strike,
        type,
        ltp,
        priceChange: 0, // Placeholder
        oi,
        oiChange: oiChangePercent,
        volume,
        activityType,
        signalStrength
    };
}
