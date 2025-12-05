import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus, Info, DollarSign } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

interface BSInputs {
    marketPrice: number | string;
    stockPrice: number | string;
    strikePrice: number | string;
    daysToExpiration: number | string;
    riskFreeRate: number | string;
    volatility: number | string;
    optionType: 'call' | 'put';
}

interface BSResult {
    theoreticalPrice: number;
    priceDifference: number;
    percentageDifference: number;
    valuation: 'undervalued' | 'overvalued' | 'fair';
    recommendation: string;
}

export default function BlackScholesCalculator() {
    const { logEvent } = useAnalytics();
    const [inputs, setInputs] = useState<BSInputs>({
        marketPrice: 10.00,
        stockPrice: 100,
        strikePrice: 100,
        daysToExpiration: 30,
        riskFreeRate: 5,
        volatility: 20,
        optionType: 'call'
    });

    const [result, setResult] = useState<BSResult | null>(null);
    const [showTooltip, setShowTooltip] = useState<string | null>(null);

    // Cumulative Normal Distribution Function (approximation)
    const cumulativeNormalDistribution = (x: number): number => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - probability : probability;
    };

    // Black-Scholes Formula
    const calculateBlackScholes = () => {
        const S = Number(inputs.stockPrice);
        const K = Number(inputs.strikePrice);
        const T = Number(inputs.daysToExpiration) / 365; // Convert days to years
        const r = Number(inputs.riskFreeRate) / 100; // Convert percentage to decimal
        const sigma = Number(inputs.volatility) / 100; // Convert percentage to decimal

        // Validate inputs
        if (isNaN(S) || isNaN(K) || isNaN(T) || isNaN(sigma) || S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
            return;
        }

        // Calculate d1 and d2
        const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);

        // Calculate option price
        let theoreticalPrice: number;
        if (inputs.optionType === 'call') {
            theoreticalPrice = S * cumulativeNormalDistribution(d1) - K * Math.exp(-r * T) * cumulativeNormalDistribution(d2);
        } else {
            theoreticalPrice = K * Math.exp(-r * T) * cumulativeNormalDistribution(-d2) - S * cumulativeNormalDistribution(-d1);
        }

        // Calculate differences
        const priceDifference = Number(inputs.marketPrice) - theoreticalPrice;
        const percentageDifference = (priceDifference / theoreticalPrice) * 100;

        // Determine valuation
        let valuation: 'undervalued' | 'overvalued' | 'fair';
        let recommendation: string;

        if (Math.abs(percentageDifference) < 2) {
            valuation = 'fair';
            recommendation = 'HOLD - Option is fairly priced according to Black-Scholes model';
        } else if (priceDifference < 0) {
            valuation = 'undervalued';
            recommendation = 'BUY - Option is trading below theoretical fair value';
        } else {
            valuation = 'overvalued';
            recommendation = 'SELL/AVOID - Option is trading above theoretical fair value';
        }

        setResult({
            theoreticalPrice,
            priceDifference,
            percentageDifference,
            valuation,
            recommendation
        });
    };

    const handleInputChange = (field: keyof BSInputs, value: number | string) => {
        setInputs(prev => ({
            ...prev,
            [field]: typeof value === 'string' ? value : value
        }));
    };

    const getValuationColor = () => {
        if (!result) return 'blue';
        switch (result.valuation) {
            case 'undervalued': return 'green';
            case 'overvalued': return 'red';
            case 'fair': return 'blue';
        }
    };

    const getValuationIcon = () => {
        if (!result) return <Minus className="w-6 h-6" />;
        switch (result.valuation) {
            case 'undervalued': return <TrendingDown className="w-6 h-6" />;
            case 'overvalued': return <TrendingUp className="w-6 h-6" />;
            case 'fair': return <Minus className="w-6 h-6" />;
        }
    };

    const tooltips = {
        marketPrice: 'The actual price you see in the market for this option',
        stockPrice: 'Current market price of the underlying stock/asset',
        strikePrice: 'The price at which you can exercise the option',
        daysToExpiration: 'Number of days until the option expires',
        riskFreeRate: 'Risk-free interest rate (e.g., Treasury bill rate) - typically 4-6%',
        volatility: 'Expected price fluctuation of the underlying asset (20-30% is typical)'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Black-Scholes Options Valuation</h1>
                        <p className="text-blue-100 mt-1">Determine if options are undervalued or overvalued</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-sm text-blue-50">
                        This calculator uses the Black-Scholes model to compute theoretical option prices.
                        Compare market prices with theoretical values to identify trading opportunities.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Input Parameters
                    </h2>

                    <div className="space-y-5">
                        {/* Option Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Option Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleInputChange('optionType', 'call')}
                                    className={`px-4 py-3 rounded-lg font-medium transition ${inputs.optionType === 'call'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    Call Option
                                </button>
                                <button
                                    onClick={() => handleInputChange('optionType', 'put')}
                                    className={`px-4 py-3 rounded-lg font-medium transition ${inputs.optionType === 'put'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    Put Option
                                </button>
                            </div>
                        </div>

                        {/* Market Price */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                Market Price (₹)
                                <button
                                    onMouseEnter={() => setShowTooltip('marketPrice')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    className="relative"
                                >
                                    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                                    {showTooltip === 'marketPrice' && (
                                        <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                            {tooltips.marketPrice}
                                        </div>
                                    )}
                                </button>
                            </label>
                            <input
                                type="number"
                                value={inputs.marketPrice}
                                onChange={(e) => handleInputChange('marketPrice', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                step="0.01"
                            />
                        </div>

                        {/* Stock Price */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                Current Stock Price (₹)
                                <button
                                    onMouseEnter={() => setShowTooltip('stockPrice')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    className="relative"
                                >
                                    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                                    {showTooltip === 'stockPrice' && (
                                        <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                            {tooltips.stockPrice}
                                        </div>
                                    )}
                                </button>
                            </label>
                            <input
                                type="number"
                                value={inputs.stockPrice}
                                onChange={(e) => handleInputChange('stockPrice', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                step="0.01"
                            />
                        </div>

                        {/* Strike Price */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                Strike Price (₹)
                                <button
                                    onMouseEnter={() => setShowTooltip('strikePrice')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    className="relative"
                                >
                                    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                                    {showTooltip === 'strikePrice' && (
                                        <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                            {tooltips.strikePrice}
                                        </div>
                                    )}
                                </button>
                            </label>
                            <input
                                type="number"
                                value={inputs.strikePrice}
                                onChange={(e) => handleInputChange('strikePrice', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                step="0.01"
                            />
                        </div>

                        {/* Days to Expiration */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                Days to Expiration
                                <button
                                    onMouseEnter={() => setShowTooltip('daysToExpiration')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    className="relative"
                                >
                                    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                                    {showTooltip === 'daysToExpiration' && (
                                        <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                            {tooltips.daysToExpiration}
                                        </div>
                                    )}
                                </button>
                            </label>
                            <input
                                type="number"
                                value={inputs.daysToExpiration}
                                onChange={(e) => handleInputChange('daysToExpiration', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                step="1"
                                min="1"
                            />
                        </div>

                        {/* Risk-Free Rate */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                Risk-Free Rate (%)
                                <button
                                    onMouseEnter={() => setShowTooltip('riskFreeRate')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    className="relative"
                                >
                                    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600" />
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
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                step="0.1"
                            />
                        </div>

                        {/* Volatility */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                Implied Volatility (%)
                                <button
                                    onMouseEnter={() => setShowTooltip('volatility')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    className="relative"
                                >
                                    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                                    {showTooltip === 'volatility' && (
                                        <div className="absolute left-6 top-0 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-xl">
                                            {tooltips.volatility}
                                        </div>
                                    )}
                                </button>
                            </label>
                            <input
                                type="number"
                                value={inputs.volatility}
                                onChange={(e) => handleInputChange('volatility', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                step="0.1"
                            />
                        </div>
                        {/* Calculate Button */}
                        <button
                            onClick={calculateBlackScholes}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg"
                        >
                            <Calculator className="w-5 h-5" />
                            Calculate Value
                        </button>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                    {result && (
                        <>
                            {/* Valuation Status Card */}
                            <div className={`bg-gradient-to-br from-${getValuationColor()}-500 to-${getValuationColor()}-700 rounded-xl p-6 text-white shadow-xl`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Valuation Status</h3>
                                    {getValuationIcon()}
                                </div>
                                <div className="text-3xl font-bold mb-2 uppercase">
                                    {result.valuation}
                                </div>
                                <p className="text-sm opacity-90">
                                    {result.recommendation}
                                </p>
                            </div>

                            {/* Price Comparison */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Price Analysis</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Market Price</span>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{Number(inputs.marketPrice).toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theoretical Fair Value</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">₹{result.theoreticalPrice.toFixed(2)}</span>
                                    </div>

                                    <div className={`flex justify-between items-center p-4 rounded-lg ${result.valuation === 'undervalued'
                                        ? 'bg-green-50 dark:bg-green-900/20'
                                        : result.valuation === 'overvalued'
                                            ? 'bg-red-50 dark:bg-red-900/20'
                                            : 'bg-slate-50 dark:bg-slate-700'
                                        }`}>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Price Difference</span>
                                        <span className={`text-xl font-bold ${result.valuation === 'undervalued'
                                            ? 'text-green-600 dark:text-green-400'
                                            : result.valuation === 'overvalued'
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-slate-900 dark:text-white'
                                            }`}>
                                            {result.priceDifference > 0 ? '+' : ''}₹{result.priceDifference.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className={`flex justify-between items-center p-4 rounded-lg ${result.valuation === 'undervalued'
                                        ? 'bg-green-50 dark:bg-green-900/20'
                                        : result.valuation === 'overvalued'
                                            ? 'bg-red-50 dark:bg-red-900/20'
                                            : 'bg-slate-50 dark:bg-slate-700'
                                        }`}>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Percentage Difference</span>
                                        <span className={`text-xl font-bold ${result.valuation === 'undervalued'
                                            ? 'text-green-600 dark:text-green-400'
                                            : result.valuation === 'overvalued'
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-slate-900 dark:text-white'
                                            }`}>
                                            {result.percentageDifference > 0 ? '+' : ''}{result.percentageDifference.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Information Box */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg p-4">
                                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">About Black-Scholes Model</h4>
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                    The Black-Scholes model assumes constant volatility, no dividends, European-style options,
                                    and efficient markets. Real market conditions may vary. Use this as a guide, not absolute truth.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
