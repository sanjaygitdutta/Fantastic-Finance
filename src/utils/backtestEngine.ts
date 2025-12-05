import { OptionLeg } from '../components/StrategyBuilder';

// Types
export interface DailyData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    iv: number;
}

export interface BacktestResult {
    dates: string[];
    equityCurve: number[];
    underlyingPrice: number[];
    metrics: {
        totalReturn: number;
        cagr: number;
        sharpeRatio: number;
        maxDrawdown: number;
        winRate: number;
        totalTrades: number;
        avgProfit: number;
        avgLoss: number;
    };
    trades: {
        date: string;
        pnl: number;
        type: 'WIN' | 'LOSS';
    }[];
}

// Helper: Generate Gaussian Random Number (Box-Muller transform)
const randn_bm = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// 1. Generate Historical Data (Mock)
export const generateHistoricalData = (
    symbol: string,
    startPrice: number,
    days: number,
    volatility: number = 0.15, // Annualized Volatility
    trend: number = 0.05 // Annualized Drift
): DailyData[] => {
    const data: DailyData[] = [];
    let currentPrice = startPrice;
    const dt = 1 / 252; // Daily time step

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // Geometric Brownian Motion: dS = S * (mu * dt + sigma * dW)
        const drift = (trend - 0.5 * volatility * volatility) * dt;
        const diffusion = volatility * Math.sqrt(dt) * randn_bm();
        const change = Math.exp(drift + diffusion);

        const open = currentPrice;
        const close = currentPrice * change;
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);

        // Randomize IV slightly around the mean
        const dailyIV = volatility * (1 + (Math.random() - 0.5) * 0.2);

        data.push({
            date: date.toISOString().split('T')[0],
            open,
            high,
            low,
            close,
            iv: dailyIV
        });

        currentPrice = close;
    }

    return data;
};

// 2. Simplified Black-Scholes for Option Pricing
const cumulativeDistribution = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014337 * Math.exp(-x * x / 2);
    const prob = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x > 0 ? 1 - prob : prob;
};

export const calculateOptionPrice = (
    spot: number,
    strike: number,
    timeToExpiry: number, // in years
    type: 'CALL' | 'PUT',
    volatility: number,
    riskFreeRate: number = 0.05
): number => {
    if (timeToExpiry <= 0) {
        return type === 'CALL' ? Math.max(0, spot - strike) : Math.max(0, strike - spot);
    }

    const d1 = (Math.log(spot / strike) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

    if (type === 'CALL') {
        return spot * cumulativeDistribution(d1) - strike * Math.exp(-riskFreeRate * timeToExpiry) * cumulativeDistribution(d2);
    } else {
        return strike * Math.exp(-riskFreeRate * timeToExpiry) * cumulativeDistribution(-d2) - spot * cumulativeDistribution(-d1);
    }
};

// 3. Run Backtest Simulation
export const runBacktestSimulation = (
    legs: OptionLeg[],
    initialCapital: number,
    days: number = 90
): BacktestResult => {
    // Determine start price from the first leg (assuming legs are built around current spot)
    const startPrice = legs[0]?.strike || 22000;

    // Generate Market Scenario (Random for now, could be parameterized)
    const marketData = generateHistoricalData('NIFTY', startPrice, days);

    const equityCurve: number[] = [initialCapital];
    const underlyingPrice: number[] = [startPrice];
    const dates: string[] = [marketData[0].date];
    const trades: { date: string; pnl: number; type: 'WIN' | 'LOSS' }[] = [];

    // Simulate holding the strategy
    // For simplicity, we assume the strategy is "re-entered" or held continuously
    // In reality, options expire. Here we simulate the P&L of the *structure* relative to spot movement daily.

    let currentEquity = initialCapital;

    for (let i = 1; i < marketData.length; i++) {
        const today = marketData[i];
        const yesterday = marketData[i - 1];

        // Calculate P&L for the day based on Spot Move and Time Decay
        let dailyPnL = 0;

        // Time to expiry (simulated as constant 30 days rolling for "strategy performance" or decaying if single trade)
        // Let's simulate a single trade held to expiry or close
        const daysToExpiry = Math.max(0, 30 - i); // Assume 30 DTE entry
        const timeToExpiry = daysToExpiry / 252;

        legs.forEach(leg => {
            // Price yesterday
            const priceYesterday = calculateOptionPrice(
                yesterday.close,
                leg.strike,
                (daysToExpiry + 1) / 252,
                leg.type as 'CALL' | 'PUT',
                yesterday.iv
            );

            // Price today
            const priceToday = calculateOptionPrice(
                today.close,
                leg.strike,
                timeToExpiry,
                leg.type as 'CALL' | 'PUT',
                today.iv
            );

            const priceChange = priceToday - priceYesterday;

            // If we BOUGHT the option, price increase is good. If SOLD, it's bad.
            if (leg.action === 'BUY') {
                dailyPnL += priceChange * leg.quantity; // x Lot Size (usually 50 for Nifty, simplified here to 1 or quantity)
            } else {
                dailyPnL -= priceChange * leg.quantity;
            }
        });

        // Scale by Lot Size (e.g., 50 for Nifty)
        dailyPnL *= 50;

        currentEquity += dailyPnL;
        equityCurve.push(currentEquity);
        underlyingPrice.push(today.close);
        dates.push(today.date);

        if (i % 5 === 0 || i === marketData.length - 1) { // Log "trades" or weekly settlements
            trades.push({
                date: today.date,
                pnl: dailyPnL,
                type: dailyPnL > 0 ? 'WIN' : 'LOSS'
            });
        }
    }

    // Calculate Metrics
    const totalReturn = ((currentEquity - initialCapital) / initialCapital) * 100;
    const returns = equityCurve.map((v, i) => i === 0 ? 0 : (v - equityCurve[i - 1]) / equityCurve[i - 1]);
    const avgDailyReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDevReturn = Math.sqrt(returns.map(x => Math.pow(x - avgDailyReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
    const sharpeRatio = stdDevReturn === 0 ? 0 : (avgDailyReturn / stdDevReturn) * Math.sqrt(252);

    let maxDrawdown = 0;
    let peak = -Infinity;
    for (const equity of equityCurve) {
        if (equity > peak) peak = equity;
        const drawdown = (equity - peak) / peak;
        if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    }

    const winningTrades = trades.filter(t => t.type === 'WIN');
    const winRate = (winningTrades.length / trades.length) * 100;

    return {
        dates,
        equityCurve,
        underlyingPrice,
        metrics: {
            totalReturn: parseFloat(totalReturn.toFixed(2)),
            cagr: parseFloat((totalReturn * (365 / days)).toFixed(2)), // Annualized
            sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
            maxDrawdown: parseFloat((maxDrawdown * 100).toFixed(2)),
            winRate: parseFloat(winRate.toFixed(1)),
            totalTrades: trades.length,
            avgProfit: parseFloat((winningTrades.reduce((a, b) => a + b.pnl, 0) / winningTrades.length || 0).toFixed(0)),
            avgLoss: parseFloat((trades.filter(t => t.type === 'LOSS').reduce((a, b) => a + b.pnl, 0) / (trades.length - winningTrades.length) || 0).toFixed(0))
        },
        trades
    };
};
