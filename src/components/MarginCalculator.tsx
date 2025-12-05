import { DollarSign, Calculator, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';

interface MarginInputs {
    instrumentType: 'futures' | 'options';
    optionType?: 'call' | 'put';
    tradeType: 'buy' | 'sell';
    quantity: number | string;
    price: number | string;
    lotSize: number | string;
    strikePrice?: number | string;
    underlying?: number | string;
    volatility?: number | string;
    daysToExpiry?: number | string;
}

interface MarginResult {
    spanMargin: number;
    exposureMargin: number;
    premiumAmount: number;
    totalMargin: number;
    marginPerLot: number;
    intradayMargin: number;
}

export default function MarginCalculator() {
    const [inputs, setInputs] = useState<MarginInputs>({
        instrumentType: 'futures',
        optionType: 'call',
        tradeType: 'buy',
        quantity: 1,
        price: 22000,
        lotSize: 50,
        strikePrice: 22000,
        underlying: 22000,
        volatility: 20,
        daysToExpiry: 30
    });

    const [result, setResult] = useState<MarginResult | null>(null);

    const calculateMargin = () => {
        const qty = Number(inputs.quantity);
        const price = Number(inputs.price);
        const lot = Number(inputs.lotSize);

        if (isNaN(qty) || isNaN(price) || isNaN(lot) || qty <= 0 || price <= 0 || lot <= 0) {
            return;
        }

        const contractValue = price * lot * qty;

        if (inputs.instrumentType === 'futures') {
            // Futures Margin Calculation
            const spanMargin = contractValue * 0.10; // ~10% SPAN margin
            const exposureMargin = contractValue * 0.05; // ~5% Exposure margin
            const totalMargin = spanMargin + exposureMargin;
            const intradayMargin = totalMargin * 0.40; // ~40% of total for intraday

            setResult({
                spanMargin,
                exposureMargin,
                premiumAmount: 0,
                totalMargin,
                marginPerLot: totalMargin / qty,
                intradayMargin
            });
        } else {
            // Options Margin Calculation
            const premium = price * lot * qty;
            const strike = Number(inputs.strikePrice) || 0;
            const underlying = Number(inputs.underlying) || 0;

            if (inputs.tradeType === 'buy') {
                // Buying options - only premium required
                setResult({
                    spanMargin: 0,
                    exposureMargin: 0,
                    premiumAmount: premium,
                    totalMargin: premium,
                    marginPerLot: premium / qty,
                    intradayMargin: premium
                });
            } else {
                // Selling options - SPAN + Exposure - Premium received
                const otmAmount = inputs.optionType === 'call'
                    ? Math.max(0, strike - underlying)
                    : Math.max(0, underlying - strike);

                const spanMargin = Math.max(
                    premium + (underlying * lot * qty * 0.10) - otmAmount,
                    premium + (underlying * lot * qty * 0.05)
                );
                const exposureMargin = underlying * lot * qty * 0.05;
                const totalMargin = spanMargin + exposureMargin - premium;
                const intradayMargin = totalMargin * 0.50;

                setResult({
                    spanMargin,
                    exposureMargin,
                    premiumAmount: premium,
                    totalMargin,
                    marginPerLot: totalMargin / qty,
                    intradayMargin
                });
            }
        }
    };

    const handleInputChange = (field: keyof MarginInputs, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Margin Calculator</h1>
                            <p className="text-indigo-100 mt-1">Calculate margin requirements for F&O positions</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <p className="text-sm text-indigo-50">
                            Estimate SPAN and Exposure margins for futures and options trading.
                            Values are approximate and for educational purposes only.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-indigo-600" />
                            Position Details
                        </h2>

                        <div className="space-y-5">
                            {/* Instrument Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Instrument Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleInputChange('instrumentType', 'futures')}
                                        className={`px-4 py-3 rounded-lg font-medium transition ${inputs.instrumentType === 'futures'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        Futures
                                    </button>
                                    <button
                                        onClick={() => handleInputChange('instrumentType', 'options')}
                                        className={`px-4 py-3 rounded-lg font-medium transition ${inputs.instrumentType === 'options'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        Options
                                    </button>
                                </div>
                            </div>

                            {/* Option Type (only for options) */}
                            {inputs.instrumentType === 'options' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Option Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleInputChange('optionType', 'call')}
                                            className={`px-4 py-3 rounded-lg font-medium transition ${inputs.optionType === 'call'
                                                ? 'bg-green-600 text-white shadow-lg'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                }`}
                                        >
                                            Call
                                        </button>
                                        <button
                                            onClick={() => handleInputChange('optionType', 'put')}
                                            className={`px-4 py-3 rounded-lg font-medium transition ${inputs.optionType === 'put'
                                                ? 'bg-red-600 text-white shadow-lg'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                }`}
                                        >
                                            Put
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Trade Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Trade Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleInputChange('tradeType', 'buy')}
                                        className={`px-4 py-3 rounded-lg font-medium transition ${inputs.tradeType === 'buy'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => handleInputChange('tradeType', 'sell')}
                                        className={`px-4 py-3 rounded-lg font-medium transition ${inputs.tradeType === 'sell'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        Sell
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    {inputs.instrumentType === 'futures' ? 'Futures Price (₹)' : 'Option Premium (₹)'}
                                </label>
                                <input
                                    type="number"
                                    value={inputs.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    step="0.05"
                                />
                            </div>

                            {/* Lot Size */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Lot Size
                                </label>
                                <input
                                    type="number"
                                    value={inputs.lotSize}
                                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    step="1"
                                />
                            </div>

                            {/* Quantity (Number of Lots) */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Quantity (Lots)
                                </label>
                                <input
                                    type="number"
                                    value={inputs.quantity}
                                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    step="1"
                                    min="1"
                                />
                            </div>

                            {/* Additional fields for options */}
                            {inputs.instrumentType === 'options' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Strike Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={inputs.strikePrice}
                                            onChange={(e) => handleInputChange('strikePrice', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            step="50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                            Underlying Price (₹)
                                            <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">• Manual Update</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={inputs.underlying || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (Number(val) > 0 || val === '') {
                                                    handleInputChange('underlying', val);
                                                }
                                            }}
                                            placeholder="e.g., 22000"
                                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            step="0.05"
                                            min="0.01"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            💡 Enter current market price for accurate margin calculation
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Futures price note */}
                            {inputs.instrumentType === 'futures' && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">
                                        💡 <strong>Tip:</strong> Enter the current futures price above for real-time margin calculation
                                    </p>
                                </div>
                            )}

                            {/* Calculate Button */}
                            <button
                                onClick={calculateMargin}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-lg"
                            >
                                <Calculator className="w-5 h-5" />
                                Calculate Margin
                            </button>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        {result && (
                            <>
                                {/* Total Margin Card */}
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Total Margin Required</h3>
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div className="text-4xl font-bold mb-2">
                                        ₹{result.totalMargin.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </div>
                                    <p className="text-sm opacity-90">
                                        For {inputs.quantity} lot(s) of {inputs.instrumentType}
                                    </p>
                                </div>

                                {/* Margin Breakdown */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Margin Breakdown</h3>

                                    <div className="space-y-3">
                                        {inputs.instrumentType === 'options' && inputs.tradeType === 'buy' ? (
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Premium Amount</span>
                                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        ₹{result.premiumAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">SPAN Margin</span>
                                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                            ₹{result.spanMargin.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Exposure Margin</span>
                                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                            ₹{result.exposureMargin.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {inputs.instrumentType === 'options' && result.premiumAmount > 0 && (
                                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Premium Received</span>
                                                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                - ₹{result.premiumAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Intraday Margin (~40%)</span>
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                    ₹{result.intradayMargin.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Margin Per Lot</span>
                                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                    ₹{result.marginPerLot.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">Important Note</h4>
                                            <p className="text-xs text-amber-800 dark:text-amber-200">
                                                These are approximate calculations. Actual margins may vary based on broker policies,
                                                volatility, and exchange requirements. Always verify with your broker before trading.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Reference */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Margin Types</h4>
                                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                                <li><strong>SPAN:</strong> Standard Portfolio Analysis of Risk - core margin requirement</li>
                                                <li><strong>Exposure:</strong> Additional margin for extreme market movements</li>
                                                <li><strong>Intraday:</strong> Reduced margin if position is squared off same day</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
