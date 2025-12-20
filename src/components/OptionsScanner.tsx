import { useState, useEffect } from 'react';
import { Filter, RefreshCw, ArrowUpRight, ArrowDownRight, Activity, TrendingUp, TrendingDown, Search, Target, Zap, BarChart3, AlertCircle } from 'lucide-react';
import AdSlot from './AdSlot';
import { scanOptionsActivity, ScannerResult } from '../services/scannerService';
import { DisplayAd } from './AdSense';

export default function OptionsScanner() {
    const [results, setResults] = useState<ScannerResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Filters
    const [selectedSymbol, setSelectedSymbol] = useState<string>('ALL');
    const [selectedType, setSelectedType] = useState<'ALL' | 'Call' | 'Put'>('ALL');
    const [minStrength, setMinStrength] = useState<'All' | 'High' | 'Medium'>('All');

    const fetchScanResults = async () => {
        setLoading(true);
        try {
            const data = await scanOptionsActivity();
            setResults(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Scan failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScanResults();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchScanResults, 30000);
        return () => clearInterval(interval);
    }, []);

    // Filter logic
    const filteredResults = results.filter(r => {
        if (selectedSymbol !== 'ALL' && r.symbol !== selectedSymbol) return false;
        if (selectedType !== 'ALL' && r.type !== selectedType) return false;
        if (minStrength === 'High' && r.signalStrength !== 'High') return false;
        if (minStrength === 'Medium' && r.signalStrength === 'Low') return false;
        return true;
    });

    // Stats
    const bullishSignals = filteredResults.filter(r =>
        r.activityType === 'Long Buildup' || r.activityType === 'Short Covering'
    ).length;

    const bearishSignals = filteredResults.filter(r =>
        r.activityType === 'Short Buildup' || r.activityType === 'Long Unwinding'
    ).length;

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'Long Buildup': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'Short Covering': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Short Buildup': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'Long Unwinding': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-indigo-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Options Scanner</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Real-time unusual volume and OI buildup detection
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-500 text-right hidden md:block">
                            Last updated: {lastUpdated?.toLocaleTimeString()}
                        </div>
                        <button
                            onClick={fetchScanResults}
                            disabled={loading}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <select
                        value={selectedSymbol}
                        onChange={(e) => setSelectedSymbol(e.target.value)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                        <option value="ALL">All Indices</option>
                        <option value="NIFTY">NIFTY</option>
                        <option value="BANKNIFTY">BANKNIFTY</option>
                        <option value="FINNIFTY">FINNIFTY</option>
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                        <option value="ALL">All Types</option>
                        <option value="Call">Calls</option>
                        <option value="Put">Puts</option>
                    </select>

                    <select
                        value={minStrength}
                        onChange={(e) => setMinStrength(e.target.value as any)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                        <option value="All">All Strengths</option>
                        <option value="High">High Strength Only</option>
                        <option value="Medium">Medium & High</option>
                    </select>
                </div>
            </div>

            {/* Market Sentiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-green-800 dark:text-green-300">Bullish Signals</div>
                            <div className="text-xs text-green-600 dark:text-green-400">Short Covering & Put Writing</div>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">{bullishSignals}</div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-red-800 dark:text-red-300">Bearish Signals</div>
                            <div className="text-xs text-red-600 dark:text-red-400">Long Unwinding & Call Writing</div>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">{bearishSignals}</div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Symbol</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Strike</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Type</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Activity</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">LTP</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">OI Change</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">Volume</th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">Strength</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                        <td className="px-4 py-3 font-medium">{row.symbol}</td>
                                        <td className="px-4 py-3">{row.strike}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${row.type === 'Call'
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                                }`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getActivityColor(row.activityType)}`}>
                                                {row.activityType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">₹{row.ltp.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className={`flex items-center justify-end gap-1 ${row.oiChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {row.oiChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {Math.abs(row.oiChange).toFixed(1)}%
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                                            {(row.volume / 1000).toFixed(1)}k
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {row.signalStrength === 'High' && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                                    High
                                                </span>
                                            )}
                                            {row.signalStrength === 'Medium' && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    Med
                                                </span>
                                            )}
                                            {row.signalStrength === 'Low' && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400">
                                                    Low
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                        {loading ? 'Scanning market...' : 'No unusual activity detected matching filters'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567896" className="mt-6" />
            {/* AdSense Display Ad */}
            <AdSlot slot="options-scanner-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
