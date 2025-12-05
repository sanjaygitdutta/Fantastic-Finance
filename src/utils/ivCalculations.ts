/**
 * IV Analysis Calculations
 * Provides IV Rank, IV Percentile, and statistical analysis for options
 */

export interface IVDataPoint {
    date: string;
    iv: number;
}

export interface IVRankResult {
    current: number;
    ivRank: number; // 0-100, where current IV stands in 52-week range
    ivPercentile: number; // 0-100, % of days current IV was lower
    high52Week: number;
    low52Week: number;
    mean52Week: number;
    interpretation: string;
}

export interface StrikeIVData {
    strike: number;
    callIV: number;
    putIV: number;
    ivSkew: number; // put IV - call IV
    moneyness: 'ITM' | 'ATM' | 'OTM';
}

/**
 * Calculate IV Rank (where current IV stands in 52-week high-low range)
 * IV Rank = (Current IV - 52-week Low) / (52-week High - 52-week Low) * 100
 */
export function calculateIVRank(historicalData: IVDataPoint[], currentIV: number): IVRankResult {
    if (historicalData.length === 0) {
        return {
            current: currentIV,
            ivRank: 50,
            ivPercentile: 50,
            high52Week: currentIV,
            low52Week: currentIV,
            mean52Week: currentIV,
            interpretation: 'Insufficient historical data'
        };
    }

    const ivValues = historicalData.map(d => d.iv);
    const high52Week = Math.max(...ivValues);
    const low52Week = Math.min(...ivValues);
    const mean52Week = ivValues.reduce((a, b) => a + b, 0) / ivValues.length;

    // IV Rank: where current IV sits in the range (0-100)
    const ivRank = ((currentIV - low52Week) / (high52Week - low52Week)) * 100;

    // IV Percentile: % of days where IV was below current level
    const daysBelow = ivValues.filter(iv => iv < currentIV).length;
    const ivPercentile = (daysBelow / ivValues.length) * 100;

    // Interpretation
    let interpretation = '';
    if (ivRank >= 75) {
        interpretation = 'Very High - Consider selling premium';
    } else if (ivRank >= 50) {
        interpretation = 'Elevated - Favorable for premium selling';
    } else if (ivRank >= 25) {
        interpretation = 'Moderate - Neutral conditions';
    } else {
        interpretation = 'Low - Consider buying options';
    }

    return {
        current: currentIV,
        ivRank: Math.round(ivRank * 10) / 10,
        ivPercentile: Math.round(ivPercentile * 10) / 10,
        high52Week,
        low52Week,
        mean52Week,
        interpretation
    };
}

/**
 * Calculate IV Skew (difference between put and call IV)
 * Positive skew indicates puts are more expensive (fear/hedging)
 */
export function calculateIVSkew(strikeData: StrikeIVData[]): {
    avgSkew: number;
    maxSkew: number;
    minSkew: number;
    interpretation: string;
} {
    if (strikeData.length === 0) {
        return { avgSkew: 0, maxSkew: 0, minSkew: 0, interpretation: 'No data available' };
    }

    const skews = strikeData.map(d => d.ivSkew);
    const avgSkew = skews.reduce((a, b) => a + b, 0) / skews.length;
    const maxSkew = Math.max(...skews);
    const minSkew = Math.min(...skews);

    let interpretation = '';
    if (avgSkew > 0.05) {
        interpretation = 'Put skew present - Market shows fear/hedging demand';
    } else if (avgSkew < -0.05) {
        interpretation = 'Call skew present - Bullish sentiment';
    } else {
        interpretation = 'Balanced - No significant skew';
    }

    return {
        avgSkew: Math.round(avgSkew * 1000) / 1000,
        maxSkew: Math.round(maxSkew * 1000) / 1000,
        minSkew: Math.round(minSkew * 1000) / 1000,
        interpretation
    };
}

/**
 * Analyze IV by moneyness categories
 */
export function analyzeIVByMoneyness(strikeData: StrikeIVData[]): {
    itm: { avgCallIV: number; avgPutIV: number };
    atm: { avgCallIV: number; avgPutIV: number };
    otm: { avgCallIV: number; avgPutIV: number };
} {
    const itmStrikes = strikeData.filter(d => d.moneyness === 'ITM');
    const atmStrikes = strikeData.filter(d => d.moneyness === 'ATM');
    const otmStrikes = strikeData.filter(d => d.moneyness === 'OTM');

    const calcAvg = (strikes: StrikeIVData[], type: 'call' | 'put') => {
        if (strikes.length === 0) return 0;
        const sum = strikes.reduce((a, b) => a + (type === 'call' ? b.callIV : b.putIV), 0);
        return Math.round((sum / strikes.length) * 1000) / 1000;
    };

    return {
        itm: { avgCallIV: calcAvg(itmStrikes, 'call'), avgPutIV: calcAvg(itmStrikes, 'put') },
        atm: { avgCallIV: calcAvg(atmStrikes, 'call'), avgPutIV: calcAvg(atmStrikes, 'put') },
        otm: { avgCallIV: calcAvg(otmStrikes, 'call'), avgPutIV: calcAvg(otmStrikes, 'put') }
    };
}
