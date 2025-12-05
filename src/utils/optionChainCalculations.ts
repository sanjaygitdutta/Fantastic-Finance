// Max Pain and PCR Calculations for Option Chain

interface OptionStrike {
    strike: number;
    callOI: number;
    putOI: number;
    callVolume: number;
    putVolume: number;
}

/**
 * Calculate Max Pain - The strike price where option writers lose the least amount of money
 * This is where the total value of all options (calls + puts) at expiry is minimized
 */
export function calculateMaxPain(strikes: OptionStrike[]): {
    maxPainStrike: number;
    totalPain: number;
    painByStrike: { strike: number; pain: number }[];
} {
    const painByStrike: { strike: number; pain: number }[] = [];
    let minPain = Infinity;
    let maxPainStrike = 0;

    // For each potential expiry price (each strike)
    strikes.forEach((expiryStrike) => {
        let totalPain = 0;

        // Calculate pain for all options if market expires at this strike
        strikes.forEach((option) => {
            // Call writers pain: max(0, expiryPrice - strike) * OI
            if (expiryStrike.strike > option.strike) {
                totalPain += (expiryStrike.strike - option.strike) * option.callOI;
            }

            // Put writers pain: max(0, strike - expiryPrice) * OI
            if (expiryStrike.strike < option.strike) {
                totalPain += (option.strike - expiryStrike.strike) * option.putOI;
            }
        });

        painByStrike.push({
            strike: expiryStrike.strike,
            pain: totalPain
        });

        if (totalPain < minPain) {
            minPain = totalPain;
            maxPainStrike = expiryStrike.strike;
        }
    });

    return {
        maxPainStrike,
        totalPain: minPain,
        painByStrike
    };
}

/**
 * Calculate Put-Call Ratio (PCR)
 * PCR > 1 = More puts (bearish sentiment)
 * PCR < 1 = More calls (bullish sentiment)
 */
export function calculatePCR(strikes: OptionStrike[]): {
    pcrByOI: number;
    pcrByVolume: number;
    signal: 'bullish' | 'bearish' | 'neutral';
    interpretation: string;
} {
    let totalPutOI = 0;
    let totalCallOI = 0;
    let totalPutVolume = 0;
    let totalCallVolume = 0;

    strikes.forEach((strike) => {
        totalPutOI += strike.putOI;
        totalCallOI += strike.callOI;
        totalPutVolume += strike.putVolume;
        totalCallVolume += strike.callVolume;
    });

    const pcrByOI = totalCallOI > 0 ? totalPutOI / totalCallOI : 0;
    const pcrByVolume = totalCallVolume > 0 ? totalPutVolume / totalCallVolume : 0;

    // Interpretation
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let interpretation = '';

    if (pcrByOI > 1.2) {
        signal = 'bullish';
        interpretation = 'High PCR - Possibly oversold, bullish contrarian signal';
    } else if (pcrByOI < 0.8) {
        signal = 'bearish';
        interpretation = 'Low PCR - Possibly overbought, bearish contrarian signal';
    } else {
        signal = 'neutral';
        interpretation = 'Neutral PCR - Balanced sentiment';
    }

    return {
        pcrByOI,
        pcrByVolume,
        signal,
        interpretation
    };
}

/**
 * Detect buildup in option chain
 * Types: Long Call, Short Call, Long Put, Short Put
 */
export function detectBuildup(
    strike: OptionStrike,
    previousData?: OptionStrike
): {
    callBuildup: 'long' | 'short' | 'none';
    putBuildup: 'long' | 'short' | 'none';
    signals: string[];
} {
    const signals: string[] = [];
    let callBuildup: 'long' | 'short' | 'none' = 'none';
    let putBuildup: 'long' | 'short' | 'none' = 'none';

    if (!previousData) {
        return { callBuildup, putBuildup, signals };
    }

    // Calculate OI changes
    const callOIChange = strike.callOI - previousData.callOI;
    const putOIChange = strike.putOI - previousData.putOI;

    // Volume to OI ratio (high volume with OI increase is stronger signal)
    const callVolumeRatio = strike.callOI > 0 ? strike.callVolume / strike.callOI : 0;
    const putVolumeRatio = strike.putOI > 0 ? strike.putVolume / strike.putOI : 0;

    // Detect Call Buildup
    if (callOIChange > 0 && callVolumeRatio > 0.1) {
        // Simplified: In real scenario, you'd also check price movement
        // Long Call: OI increase + Price increase
        // Short Call: OI increase + Price decrease
        // For now, we'll just detect significant OI increase
        if (callOIChange > previousData.callOI * 0.1) { // 10% increase
            callBuildup = 'long'; // Assume long for significant increase
            signals.push('🟢 Long Call Buildup - Bullish');
        }
    }

    // Detect Put Buildup
    if (putOIChange > 0 && putVolumeRatio > 0.1) {
        if (putOIChange > previousData.putOI * 0.1) { // 10% increase
            putBuildup = 'long'; // Assume long for significant increase
            signals.push('🔴 Long Put Buildup - Bearish');
        }
    }

    // Detect unwinding (OI decrease)
    if (callOIChange < -previousData.callOI * 0.05) {
        signals.push('⚪ Call Unwinding');
    }

    if (putOIChange < -previousData.putOI * 0.05) {
        signals.push('⚪ Put Unwinding');
    }

    return {
        callBuildup,
        putBuildup,
        signals
    };
}

/**
 * Calculate support and resistance levels based on OI
 */
export function calculateSupportResistance(strikes: OptionStrike[]): {
    supportLevels: number[];
    resistanceLevels: number[];
} {
    // Sort strikes by Put OI (descending) for support
    const putOISorted = [...strikes].sort((a, b) => b.putOI - a.putOI);
    const supportLevels = putOISorted.slice(0, 3).map(s => s.strike);

    // Sort strikes by Call OI (descending) for resistance  
    const callOISorted = [...strikes].sort((a, b) => b.callOI - a.callOI);
    const resistanceLevels = callOISorted.slice(0, 3).map(s => s.strike);

    return {
        supportLevels,
        resistanceLevels
    };
}
