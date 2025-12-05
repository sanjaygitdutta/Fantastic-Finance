// Black-Scholes Option Pricing & Greeks Calculations

/**
 * Calculate cumulative distribution function for standard normal distribution
 */
function normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
}

/**
 * Calculate probability density function for standard normal distribution
 */
function normalPDF(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate d1 for Black-Scholes formula
 */
function calculateD1(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number
): number {
    return (
        (Math.log(spotPrice / strikePrice) +
            (riskFreeRate + (volatility * volatility) / 2) * timeToExpiry) /
        (volatility * Math.sqrt(timeToExpiry))
    );
}

/**
 * Calculate d2 for Black-Scholes formula
 */
function calculateD2(d1: number, volatility: number, timeToExpiry: number): number {
    return d1 - volatility * Math.sqrt(timeToExpiry);
}

/**
 * Calculate Delta - Rate of change of option price with respect to underlying price
 * Call Delta: 0 to 1, Put Delta: -1 to 0
 */
export function calculateDelta(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number,
    optionType: 'call' | 'put'
): number {
    const d1 = calculateD1(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);

    if (optionType === 'call') {
        return normalCDF(d1);
    } else {
        return normalCDF(d1) - 1;
    }
}

/**
 * Calculate Gamma - Rate of change of Delta with respect to underlying price
 * Always positive for both calls and puts
 */
export function calculateGamma(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number
): number {
    const d1 = calculateD1(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
    return normalPDF(d1) / (spotPrice * volatility * Math.sqrt(timeToExpiry));
}

/**
 * Calculate Theta - Rate of change of option price with respect to time
 * Usually negative (time decay)
 */
export function calculateTheta(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number,
    optionType: 'call' | 'put'
): number {
    const d1 = calculateD1(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
    const d2 = calculateD2(d1, volatility, timeToExpiry);

    const term1 = -(spotPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry));

    if (optionType === 'call') {
        const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
        return (term1 - term2) / 365; // Convert to daily theta
    } else {
        const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
        return (term1 + term2) / 365; // Convert to daily theta
    }
}

/**
 * Calculate Vega - Rate of change of option price with respect to volatility
 * Always positive for both calls and puts
 */
export function calculateVega(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number
): number {
    const d1 = calculateD1(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
    return (spotPrice * normalPDF(d1) * Math.sqrt(timeToExpiry)) / 100; // Divide by 100 for 1% change
}

/**
 * Calculate Black-Scholes option price
 */
export function calculateOptionPrice(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number,
    optionType: 'call' | 'put'
): number {
    const d1 = calculateD1(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
    const d2 = calculateD2(d1, volatility, timeToExpiry);

    if (optionType === 'call') {
        return (
            spotPrice * normalCDF(d1) -
            strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2)
        );
    } else {
        return (
            strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) -
            spotPrice * normalCDF(-d1)
        );
    }
}

/**
 * Calculate Implied Volatility using Newton-Raphson method
 */
export function calculateImpliedVolatility(
    optionPrice: number,
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    optionType: 'call' | 'put',
    maxIterations: number = 100,
    tolerance: number = 0.0001
): number {
    let volatility = 0.3; // Initial guess (30%)

    for (let i = 0; i < maxIterations; i++) {
        const price = calculateOptionPrice(
            spotPrice,
            strikePrice,
            timeToExpiry,
            riskFreeRate,
            volatility,
            optionType
        );

        const diff = price - optionPrice;

        if (Math.abs(diff) < tolerance) {
            return volatility;
        }

        const vega = calculateVega(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) * 100;

        if (vega === 0) {
            break;
        }

        volatility = volatility - diff / vega;

        // Keep volatility in reasonable bounds
        if (volatility < 0.01) volatility = 0.01;
        if (volatility > 3) volatility = 3;
    }

    return volatility;
}

/**
 * Calculate time to expiry in years from expiry date
 */
export function calculateTimeToExpiry(expiryDate: string): number {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.max(diffDays / 365, 0.001); // Minimum 0.001 years to avoid division by zero
}

/**
 * Determine if option is ITM, ATM, or OTM
 */
export function getMoneyness(
    spotPrice: number,
    strikePrice: number,
    optionType: 'call' | 'put'
): 'ITM' | 'ATM' | 'OTM' {
    const diff = Math.abs(spotPrice - strikePrice);
    const threshold = spotPrice * 0.005; // 0.5% threshold for ATM

    if (diff < threshold) {
        return 'ATM';
    }

    if (optionType === 'call') {
        return spotPrice > strikePrice ? 'ITM' : 'OTM';
    } else {
        return spotPrice < strikePrice ? 'ITM' : 'OTM';
    }
}
