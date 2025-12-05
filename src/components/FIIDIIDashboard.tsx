import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, BarChart2 } from 'lucide-react';

export default function FIIDIIDashboard() {
    const [view, setView] = useState<'cash' | 'derivatives'>('cash');

    // Mock Data for FII/DII Activity
    const activityData = {
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        fii: {
            buy: 12450.50,
            sell: 14200.80,
            net: -1750.30,
        },
        dii: {
            buy: 9800.20,
            sell: 8500.10,
            net: 1300.10,
        }
    };

    // Mock Data for FII Derivatives (Index Futures & Options)
    const derivativesData = {
        futures: {
            longContracts: 145230,
            shortContracts: 158450,
            longValue: 12540.50,
            shortValue: 13890.20,
            netValue: -1349.70
        },
        callOptions: {
            longContracts: 280500,
            shortContracts: 195200,
            longValue: 2650.40,
            shortValue: 1850.30,
            netValue: 800.10
        },
        putOptions: {
            longContracts: 169700,
            shortContracts: 184900,
            longValue: 1600.40,
            shortValue: 1249.90,
            netValue: 350.50
        }
    };

    const formatCurrency = (val: number) => {
        return `₹ ${Math.abs(val).toLocaleString('en-IN')} Cr`;
    };

    const formatContracts = (val: number) => {
        return val.toLocaleString('en-IN');
    };

    const calculatePercentage = (val: number, total: number) => {
        return ((val / total) * 100).toFixed(1);
    };

    const renderProgressBar = (long: number, short: number) => {
        const total = long + short;
        const longPct = (long / total) * 100;
        return (
            <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden flex mt-2">
                <div style={{ width: `${longPct}%` }} className="h-full bg-green-500"></div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" /> FII / DII Activity
                </h3>
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                        onClick={() => setView('cash')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition ${view === 'cash'
                            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        Cash
                    </button>
                    <button
                        onClick={() => setView('derivatives')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition ${view === 'derivatives'
                            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        F&O
                    </button>
                </div>
            </div>

            {view === 'cash' ? (
                <div className="grid grid-cols-2 gap-4">
                    {/* FII Stats */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-slate-700 dark:text-slate-200">FII Cash</span>
                            <span className="text-xs text-slate-400">(Foreign)</span>
                        </div>
                        <div className={`text-lg font-bold ${activityData.fii.net >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                            {activityData.fii.net >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {formatCurrency(activityData.fii.net)}
                        </div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                            <span>Buy: {formatCurrency(activityData.fii.buy)}</span>
                            <span>Sell: {formatCurrency(activityData.fii.sell)}</span>
                        </div>
                    </div>

                    {/* DII Stats */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-slate-700 dark:text-slate-200">DII Cash</span>
                            <span className="text-xs text-slate-400">(Domestic)</span>
                        </div>
                        <div className={`text-lg font-bold ${activityData.dii.net >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                            {activityData.dii.net >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {formatCurrency(activityData.dii.net)}
                        </div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                            <span>Buy: {formatCurrency(activityData.dii.buy)}</span>
                            <span>Sell: {formatCurrency(activityData.dii.sell)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Index Futures */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-purple-500" /> Index Futures
                            </h4>
                            <span className={`text-sm font-bold ${derivativesData.futures.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {derivativesData.futures.netValue >= 0 ? '+' : ''}{formatCurrency(derivativesData.futures.netValue)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Long Contracts</div>
                                <div className="font-bold text-green-600">{formatContracts(derivativesData.futures.longContracts)}</div>
                                <div className="text-xs text-slate-400">{calculatePercentage(derivativesData.futures.longContracts, derivativesData.futures.longContracts + derivativesData.futures.shortContracts)}%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Short Contracts</div>
                                <div className="font-bold text-red-600">{formatContracts(derivativesData.futures.shortContracts)}</div>
                                <div className="text-xs text-slate-400">{calculatePercentage(derivativesData.futures.shortContracts, derivativesData.futures.longContracts + derivativesData.futures.shortContracts)}%</div>
                            </div>
                        </div>
                        {renderProgressBar(derivativesData.futures.longContracts, derivativesData.futures.shortContracts)}
                    </div>

                    {/* Call Options */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" /> Call Options
                            </h4>
                            <span className={`text-sm font-bold ${derivativesData.callOptions.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {derivativesData.callOptions.netValue >= 0 ? '+' : ''}{formatCurrency(derivativesData.callOptions.netValue)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Long Contracts</div>
                                <div className="font-bold text-green-600">{formatContracts(derivativesData.callOptions.longContracts)}</div>
                                <div className="text-xs text-slate-400">{calculatePercentage(derivativesData.callOptions.longContracts, derivativesData.callOptions.longContracts + derivativesData.callOptions.shortContracts)}%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Short Contracts</div>
                                <div className="font-bold text-red-600">{formatContracts(derivativesData.callOptions.shortContracts)}</div>
                                <div className="text-xs text-slate-400">{calculatePercentage(derivativesData.callOptions.shortContracts, derivativesData.callOptions.longContracts + derivativesData.callOptions.shortContracts)}%</div>
                            </div>
                        </div>
                        {renderProgressBar(derivativesData.callOptions.longContracts, derivativesData.callOptions.shortContracts)}
                    </div>

                    {/* Put Options */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-500" /> Put Options
                            </h4>
                            <span className={`text-sm font-bold ${derivativesData.putOptions.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {derivativesData.putOptions.netValue >= 0 ? '+' : ''}{formatCurrency(derivativesData.putOptions.netValue)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Long Contracts</div>
                                <div className="font-bold text-green-600">{formatContracts(derivativesData.putOptions.longContracts)}</div>
                                <div className="text-xs text-slate-400">{calculatePercentage(derivativesData.putOptions.longContracts, derivativesData.putOptions.longContracts + derivativesData.putOptions.shortContracts)}%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Short Contracts</div>
                                <div className="font-bold text-red-600">{formatContracts(derivativesData.putOptions.shortContracts)}</div>
                                <div className="text-xs text-slate-400">{calculatePercentage(derivativesData.putOptions.shortContracts, derivativesData.putOptions.longContracts + derivativesData.putOptions.shortContracts)}%</div>
                            </div>
                        </div>
                        {renderProgressBar(derivativesData.putOptions.longContracts, derivativesData.putOptions.shortContracts)}
                    </div>
                </div>
            )}

            <div className="mt-4 text-xs text-center text-slate-400">
                *Provisional data from NSE/BSE
            </div>
        </div>
    );
}
