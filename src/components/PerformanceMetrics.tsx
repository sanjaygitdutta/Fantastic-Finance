import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus, Info, BarChart3 } from 'lucide-react';

interface MetricInputs {
    portfolioReturn: number | string;
    riskFreeRate: number | string;
    standardDeviation: number | string;
    downsideDeviation: number | string;
    targetReturn: number | string;
    maxDrawdown: number | string;
    beta: number | string;
    benchmarkReturn: number | string;
    trackingError: number | string;
    totalGrossProfit: number | string;
    totalGrossLoss: number | string;
    numWinningTrades: number | string;
    totalTrades: number | string;
    averageWin: number | string;
    averageLoss: number | string;
    confidenceLevel: number | string;
}

interface MetricResult {
    name: string;
    value: number | string;
    status: 'good' | 'bad' | 'neutral' | 'caution';
    interpretation: string;
}

export default function PerformanceMetrics() {
    const [inputs, setInputs] = useState<MetricInputs>({
        portfolioReturn: 15,
        riskFreeRate: 5,
        standardDeviation: 20,
        downsideDeviation: 15,
        targetReturn: 8,
        maxDrawdown: 10,
        beta: 1.2,
        benchmarkReturn: 10,
        trackingError: 5,
        totalGrossProfit: 50000,
        totalGrossLoss: 30000,
        numWinningTrades: 60,
        totalTrades: 100,
        averageWin: 833,
        averageLoss: 750,
        confidenceLevel: 95
    });

    const [results, setResults] = useState<MetricResult[]>([]);
    const [showTooltip, setShowTooltip] = useState<string | null>(null);

    const calculateMetrics = () => {
        const metrics: MetricResult[] = [];

        // Parse inputs
        const pReturn = Number(inputs.portfolioReturn);
        const rfRate = Number(inputs.riskFreeRate);
        const stdDev = Number(inputs.standardDeviation);
        const downDev = Number(inputs.downsideDeviation);
        const targetRet = Number(inputs.targetReturn);
        const maxDD = Number(inputs.maxDrawdown);
        const beta = Number(inputs.beta);
        const bmReturn = Number(inputs.benchmarkReturn);
        const trackErr = Number(inputs.trackingError);
        const grossProfit = Number(inputs.totalGrossProfit);
        const grossLoss = Number(inputs.totalGrossLoss);
        const winTrades = Number(inputs.numWinningTrades);
        const totTrades = Number(inputs.totalTrades);
        const avgWin = Number(inputs.averageWin);
        const avgLoss = Number(inputs.averageLoss);

        // 1. Sharpe Ratio
        if (!isNaN(pReturn) && !isNaN(rfRate) && !isNaN(stdDev) && stdDev > 0) {
            const sharpe = (pReturn - rfRate) / stdDev;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (sharpe < 0) {
                status = 'bad';
                interpretation = 'BAD - Returns below risk-free rate';
            } else if (sharpe < 1) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Sub-optimal performance';
            } else if (sharpe < 2) {
                status = 'good';
                interpretation = 'GOOD - Adequate risk-adjusted returns';
            } else if (sharpe < 3) {
                status = 'good';
                interpretation = 'VERY GOOD - Strong risk-adjusted performance';
            } else {
                status = 'good';
                interpretation = 'EXCELLENT - Outstanding risk-adjusted returns';
            }

            metrics.push({ name: 'Sharpe Ratio', value: sharpe.toFixed(2), status, interpretation });
        }

        // 2. Sortino Ratio
        if (!isNaN(pReturn) && !isNaN(targetRet) && !isNaN(downDev) && downDev > 0) {
            const sortino = (pReturn - targetRet) / downDev;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (sortino < 0) {
                status = 'bad';
                interpretation = 'BAD - Losing money';
            } else if (sortino < 1) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Sub-optimal';
            } else if (sortino < 2) {
                status = 'good';
                interpretation = 'GOOD - Solid downside risk management';
            } else if (sortino < 3) {
                status = 'good';
                interpretation = 'VERY GOOD - Excellent downside protection';
            } else {
                status = 'good';
                interpretation = 'EXCELLENT - Superior downside risk control';
            }

            metrics.push({ name: 'Sortino Ratio', value: sortino.toFixed(2), status, interpretation });
        }

        // 3. Calmar Ratio
        if (!isNaN(pReturn) && !isNaN(maxDD) && maxDD > 0) {
            const calmar = pReturn / maxDD;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (calmar < 0) {
                status = 'bad';
                interpretation = 'BAD - Negative returns';
            } else if (calmar < 1) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Returns less than drawdown';
            } else if (calmar < 3) {
                status = 'good';
                interpretation = 'GOOD - Returns exceed drawdown';
            } else {
                status = 'good';
                interpretation = 'EXCELLENT - Profits significantly exceed drawdown';
            }

            metrics.push({ name: 'Calmar Ratio', value: calmar.toFixed(2), status, interpretation });
        }

        // 4. Treynor Ratio
        if (!isNaN(pReturn) && !isNaN(rfRate) && !isNaN(beta) && beta !== 0) {
            const treynor = (pReturn - rfRate) / beta;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (treynor < 0) {
                status = 'bad';
                interpretation = 'BAD - Returns below risk-free rate';
            } else if (treynor < 1) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Modest systematic risk compensation';
            } else {
                status = 'good';
                interpretation = 'GOOD - Positive risk-adjusted returns';
            }

            metrics.push({ name: 'Treynor Ratio', value: treynor.toFixed(2), status, interpretation });
        }

        // 5. Information Ratio
        if (!isNaN(pReturn) && !isNaN(bmReturn) && !isNaN(trackErr) && trackErr > 0) {
            const infoRatio = (pReturn - bmReturn) / trackErr;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (infoRatio < 0) {
                status = 'bad';
                interpretation = 'BAD - Underperforming benchmark';
            } else if (infoRatio < 0.5) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Marginal outperformance';
            } else if (infoRatio < 1) {
                status = 'good';
                interpretation = 'GOOD - Solid benchmark outperformance';
            } else {
                status = 'good';
                interpretation = 'EXCELLENT - Consistent strong outperformance';
            }

            metrics.push({ name: 'Information Ratio', value: infoRatio.toFixed(2), status, interpretation });
        }

        // 6. Gain to Pain Ratio
        if (!isNaN(pReturn) && !isNaN(grossLoss) && grossLoss > 0) {
            const netReturn = pReturn; // Simplified: using portfolio return as net
            const gpr = netReturn / Math.abs(grossLoss / 100); // Normalize
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (gpr < 0) {
                status = 'bad';
                interpretation = 'BAD - Negative net return';
            } else if (gpr < 1) {
                status = 'bad';
                interpretation = 'BAD - Losses exceed gains';
            } else if (gpr < 1.5) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Balanced outcome';
            } else if (gpr < 2) {
                status = 'good';
                interpretation = 'GOOD - Efficient risk-reward';
            } else if (gpr < 3) {
                status = 'good';
                interpretation = 'VERY GOOD - Strong efficiency';
            } else {
                status = 'good';
                interpretation = 'WORLD CLASS - Exceptional performance';
            }

            metrics.push({ name: 'Gain to Pain Ratio', value: gpr.toFixed(2), status, interpretation });
        }

        // 7. Profit Factor
        if (!isNaN(grossProfit) && !isNaN(grossLoss) && grossLoss > 0) {
            const profitFactor = grossProfit / grossLoss;
            let status: 'good' | 'bad' | 'neutral' | 'caution' = 'neutral';
            let interpretation = '';

            if (profitFactor < 1) {
                status = 'bad';
                interpretation = 'BAD - Unprofitable';
            } else if (profitFactor === 1) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Break-even';
            } else if (profitFactor < 1.75) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Marginal profitability';
            } else if (profitFactor < 4) {
                status = 'good';
                interpretation = 'GOOD - Strong profitability';
            } else {
                status = 'caution';
                interpretation = 'CAUTION - Very high, may indicate overfitting';
            }

            metrics.push({ name: 'Profit Factor', value: profitFactor.toFixed(2), status, interpretation });
        }

        // 8. Win Rate
        if (!isNaN(winTrades) && !isNaN(totTrades) && totTrades > 0) {
            const winRate = (winTrades / totTrades) * 100;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (winRate < 40) {
                status = 'bad';
                interpretation = 'BAD - Low win rate (needs high payoff ratio)';
            } else if (winRate < 50) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Below average';
            } else if (winRate < 70) {
                status = 'good';
                interpretation = 'GOOD - Solid win rate';
            } else {
                status = 'good';
                interpretation = 'EXCELLENT - Very high win rate';
            }

            metrics.push({ name: 'Win Rate', value: `${winRate.toFixed(1)}%`, status, interpretation });
        }

        // 9. Payoff Ratio
        if (!isNaN(avgWin) && !isNaN(avgLoss) && avgLoss > 0) {
            const payoffRatio = avgWin / avgLoss;
            let status: 'good' | 'bad' | 'neutral' = 'neutral';
            let interpretation = '';

            if (payoffRatio < 1) {
                status = 'neutral';
                interpretation = 'NEUTRAL - Requires high win rate to be profitable';
            } else if (payoffRatio < 2) {
                status = 'good';
                interpretation = 'GOOD - Decent reward-risk ratio';
            } else {
                status = 'good';
                interpretation = 'EXCELLENT - Strong reward-risk ratio';
            }

            metrics.push({ name: 'Payoff Ratio', value: payoffRatio.toFixed(2), status, interpretation });
        }

        setResults(metrics);
    };

    const handleInputChange = (field: keyof MetricInputs, value: string) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getStatusIcon = (status: 'good' | 'bad' | 'neutral' | 'caution') => {
        switch (status) {
            case 'good': return <TrendingUp className="w-5 h-5" />;
            case 'bad': return <TrendingDown className="w-5 h-5" />;
            case 'neutral': return <Minus className="w-5 h-5" />;
            case 'caution': return <Info className="w-5 h-5" />;
        }
    };

    const tooltips = {
        portfolioReturn: 'The total return of your portfolio over the period (%)',
        riskFreeRate: 'Risk-free interest rate (e.g., Treasury bill rate) - typically 4-6%',
        standardDeviation: 'Total volatility of portfolio returns (%)',
        downsideDeviation: 'Volatility of negative returns only (%)',
        targetReturn: 'Minimum acceptable return (%) for Sortino calculation',
        maxDrawdown: 'Maximum peak-to-trough decline (%)',
        beta: 'Portfolio sensitivity to market movements (1.0 = market)',
        benchmarkReturn: 'Return of the benchmark index (%)',
        trackingError: 'Standard deviation of excess returns vs benchmark (%)',
        totalGrossProfit: 'Sum of all profitable trades ($)',
        totalGrossLoss: 'Sum of all losing trades (absolute value) ($)',
        numWinningTrades: 'Number of trades that were profitable',
        totalTrades: 'Total number of trades executed',
        averageWin: 'Average profit per winning trade ($)',
        averageLoss: 'Average loss per losing trade (absolute value) ($)',
        confidenceLevel: 'Confidence level for VaR calculation (typically 95%)'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Performance Metrics Calculator</h1>
                        <p className="text-purple-100 mt-1">Evaluate your trading strategy with 11+ key financial ratios</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-sm text-purple-50">
                        Analyze risk-adjusted returns, profitability, and consistency using industry-standard metrics.
                        Enter your trading data below and click Calculate to get comprehensive performance insights.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-purple-600" />
                        Input Parameters
                    </h2>

                    <div className="space-y-6">
                        {/* Basic Returns Group */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Basic Returns</h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Portfolio Return (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('portfolioReturn')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'portfolioReturn' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.portfolioReturn}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.portfolioReturn}
                                    onChange={(e) => handleInputChange('portfolioReturn', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Risk-Free Rate (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('riskFreeRate')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'riskFreeRate' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.riskFreeRate}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.riskFreeRate}
                                    onChange={(e) => handleInputChange('riskFreeRate', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Benchmark Return (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('benchmarkReturn')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'benchmarkReturn' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.benchmarkReturn}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.benchmarkReturn}
                                    onChange={(e) => handleInputChange('benchmarkReturn', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        {/* Volatility Group */}
                        <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Volatility Metrics</h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Standard Deviation (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('standardDeviation')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'standardDeviation' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.standardDeviation}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.standardDeviation}
                                    onChange={(e) => handleInputChange('standardDeviation', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Downside Deviation (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('downsideDeviation')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'downsideDeviation' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.downsideDeviation}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.downsideDeviation}
                                    onChange={(e) => handleInputChange('downsideDeviation', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Tracking Error (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('trackingError')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'trackingError' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.trackingError}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.trackingError}
                                    onChange={(e) => handleInputChange('trackingError', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        {/* Risk Metrics Group */}
                        <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Risk & Drawdown</h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Maximum Drawdown (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('maxDrawdown')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'maxDrawdown' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.maxDrawdown}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.maxDrawdown}
                                    onChange={(e) => handleInputChange('maxDrawdown', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Target Return (%)
                                    <button
                                        onMouseEnter={() => setShowTooltip('targetReturn')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'targetReturn' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.targetReturn}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.targetReturn}
                                    onChange={(e) => handleInputChange('targetReturn', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Beta
                                    <button
                                        onMouseEnter={() => setShowTooltip('beta')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'beta' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.beta}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.beta}
                                    onChange={(e) => handleInputChange('beta', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Trade Statistics Group */}
                        <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Trade Statistics</h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Total Gross Profit ($)
                                    <button
                                        onMouseEnter={() => setShowTooltip('totalGrossProfit')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'totalGrossProfit' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.totalGrossProfit}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.totalGrossProfit}
                                    onChange={(e) => handleInputChange('totalGrossProfit', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Total Gross Loss ($)
                                    <button
                                        onMouseEnter={() => setShowTooltip('totalGrossLoss')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'totalGrossLoss' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.totalGrossLoss}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.totalGrossLoss}
                                    onChange={(e) => handleInputChange('totalGrossLoss', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Number of Winning Trades
                                    <button
                                        onMouseEnter={() => setShowTooltip('numWinningTrades')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'numWinningTrades' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.numWinningTrades}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.numWinningTrades}
                                    onChange={(e) => handleInputChange('numWinningTrades', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Total Number of Trades
                                    <button
                                        onMouseEnter={() => setShowTooltip('totalTrades')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'totalTrades' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.totalTrades}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.totalTrades}
                                    onChange={(e) => handleInputChange('totalTrades', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Average Win ($)
                                    <button
                                        onMouseEnter={() => setShowTooltip('averageWin')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'averageWin' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.averageWin}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.averageWin}
                                    onChange={(e) => handleInputChange('averageWin', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    Average Loss ($)
                                    <button
                                        onMouseEnter={() => setShowTooltip('averageLoss')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="relative"
                                    >
                                        <Info className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                                        {showTooltip === 'averageLoss' && (
                                            <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                                {tooltips.averageLoss}
                                            </div>
                                        )}
                                    </button>
                                </label>
                                <input
                                    type="number"
                                    value={inputs.averageLoss}
                                    onChange={(e) => handleInputChange('averageLoss', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={calculateMetrics}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900 transition font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 text-lg"
                        >
                            <Calculator className="w-5 h-5" />
                            Calculate Metrics
                        </button>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="space-y-4">
                    {results.length > 0 ? (
                        results.map((result, index) => {
                            // Define className based on status
                            let bgClass = '';
                            if (result.status === 'good') {
                                bgClass = 'bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800';
                            } else if (result.status === 'bad') {
                                bgClass = 'bg-gradient-to-br from-red-500 to-red-700 dark:from-red-600 dark:to-red-800';
                            } else if (result.status === 'neutral') {
                                bgClass = 'bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800';
                            } else if (result.status === 'caution') {
                                bgClass = 'bg-gradient-to-br from-yellow-500 to-yellow-700 dark:from-yellow-600 dark:to-yellow-800';
                            }

                            return (
                                <div
                                    key={index}
                                    className={`${bgClass} rounded-xl p-6 text-white shadow-xl`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold">{result.name}</h3>
                                        {getStatusIcon(result.status)}
                                    </div>
                                    <div className="text-4xl font-bold mb-2">
                                        {result.value}
                                    </div>
                                    <p className="text-sm opacity-90">
                                        {result.interpretation}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center">
                            <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Results Yet</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Enter your trading data and click "Calculate Metrics" to see your performance analysis
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
