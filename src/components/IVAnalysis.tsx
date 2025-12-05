import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, AlertCircle, Database } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { getOptionChain, getAvailableExpiries } from '../services/optionChainService';
import { getHistoricalIV, saveIVSnapshot } from '../services/ivDataService';
import {
    calculateIVRank,
    calculateIVSkew,
    analyzeIVByMoneyness,
    IVDataPoint,
    StrikeIVData
} from '../utils/ivCalculations';
import { getMoneyness } from '../utils/greeksCalculations';
import { DisplayAd } from './AdSense';

export default function IVAnalysis() {
    const [symbol, setSymbol] = useState('NSE_INDEX|Nifty 50');
    const [expiry, setExpiry] = useState('');
    const [expiries, setExpiries] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [spotPrice, setSpotPrice] = useState(19500);
    const [customStrike, setCustomStrike] = useState<string>('');
    const [selectedStrikeData, setSelectedStrikeData] = useState<StrikeIVData | null>(null);

    // IV Analysis Data
    const [historicalIV, setHistoricalIV] = useState<IVDataPoint[]>([]);
    const [isSimulated, setIsSimulated] = useState(true);
    const [ivRankData, setIVRankData] = useState<any>(null);
    const [strikeIVData, setStrikeIVData] = useState<StrikeIVData[]>([]);
    const [ivSkewData, setIVSkewData] = useState<any>(null);
    const [moneynessIV, setMoneynessIV] = useState<any>(null);

    const symbols = [
        { label: 'NIFTY', value: 'NSE_INDEX|Nifty 50' },
        { label: 'BANKNIFTY', value: 'NSE_INDEX|Nifty Bank' },
        { label: 'FINNIFTY', value: 'NSE_INDEX|Nifty Fin Service' }
    ];

    // Fetch expiries
    useEffect(() => {
        const fetchExpiries = async () => {
            try {
                const availableExpiries = await getAvailableExpiries(symbol);
                setExpiries(availableExpiries);
                if (availableExpiries.length > 0 && !expiry) {
                    setExpiry(availableExpiries[0]);
                }
            } catch (error) {
                console.error('Error fetching expiries:', error);
            }
        };
        fetchExpiries();
    }, [symbol]);

    // Handle custom strike input
    const handleStrikeAnalysis = () => {
        const strike = Number(customStrike);
        if (isNaN(strike) || strike <= 0) {
            window.alert('Please enter a valid strike price');
            return;
        }

        // Find exact match or closest strike
        let closestStrike: StrikeIVData;

        if (strikeIVData.length > 0) {
            closestStrike = strikeIVData.reduce((prev, curr) => {
                return Math.abs(curr.strike - strike) < Math.abs(prev.strike - strike) ? curr : prev;
            });
        } else {
            // Create estimated data if no data loaded yet
            const moneyness = getMoneyness(spotPrice, strike, 'call');
            const baseIV = 0.25;
            const skew = strike > spotPrice ? 0.03 : -0.01; // OTM puts have higher IV

            closestStrike = {
                strike: strike,
                callIV: baseIV,
                putIV: baseIV + skew,
                ivSkew: skew,
                moneyness: moneyness
            };
        }

        setSelectedStrikeData(closestStrike);
    };

    // Fetch IV data
    const fetchIVData = async () => {
        if (!expiry) return;
        setLoading(true);
        try {
            const chainData = await getOptionChain(symbol, expiry);
            if (chainData && chainData.spot_price) {
                setSpotPrice(chainData.spot_price);

                // Process strike IV data
                const strikes = chainData.strikes || [];
                const strikeData: StrikeIVData[] = strikes.map((s: any) => ({
                    strike: s.strike_price,
                    callIV: s.call_options?.iv || 0.30,
                    putIV: s.put_options?.iv || 0.30,
                    ivSkew: (s.put_options?.iv || 0.30) - (s.call_options?.iv || 0.30),
                    moneyness: getMoneyness(chainData.spot_price, s.strike_price, 'call')
                }));
                setStrikeIVData(strikeData);

                // Calculate average current IV from ATM strikes
                const atmStrikes = strikeData.filter(s => s.moneyness === 'ATM');
                const currentIV = atmStrikes.length > 0
                    ? atmStrikes.reduce((sum, s) => sum + (s.callIV + s.putIV) / 2, 0) / atmStrikes.length
                    : 0.30;

                // Save snapshot for historical tracking
                saveIVSnapshot(symbol, expiry, currentIV);

                // Get historical IV data
                const { data: histData, isSimulated: simulated } = await getHistoricalIV(symbol, expiry, currentIV);
                setHistoricalIV(histData);
                setIsSimulated(simulated);

                // Calculate IV Rank & Percentile
                const rankResult = calculateIVRank(histData, currentIV);
                setIVRankData(rankResult);

                // Calculate IV Skew
                const skewResult = calculateIVSkew(strikeData);
                setIVSkewData(skewResult);

                // Analyze IV by moneyness
                const moneynessResult = analyzeIVByMoneyness(strikeData);
                setMoneynessIV(moneynessResult);
            }
        } catch (error) {
            console.error('Error fetching IV data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIVData();
    }, [symbol, expiry]);

    const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">IV Analysis</h1>
                        {isSimulated && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                <Database className="w-3 h-3" />
                                Simulated Data
                            </span>
                        )}
                    </div>
                    <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        {symbols.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <select value={expiry} onChange={(e) => setExpiry(e.target.value)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" disabled={expiries.length === 0}>
                        {expiries.map((exp) => <option key={exp} value={exp}>{new Date(exp).toLocaleDateString()}</option>)}
                    </select>
                </div>

                {/* Manual Spot Price Update */}
                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            Current Spot Price (Manual Update)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={spotPrice || ''}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val > 0 || e.target.value === '') {
                                        setSpotPrice(val);
                                    }
                                }}
                                placeholder="e.g., 22000"
                                className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                step="0.5"
                                min="0.01"
                            />
                            <button
                                onClick={() => fetchIVData()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                            >
                                Update
                            </button>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                            💡 Enter real-time price manually for accurate calculations
                        </p>
                    </div>
                </div>
            </div>

            {/* Manual Strike Input */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Analyze Specific Strike</h2>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <input
                            type="number"
                            value={customStrike}
                            onChange={(e) => setCustomStrike(e.target.value)}
                            placeholder="Enter strike price (e.g., 22000)"
                            className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            step="50"
                        />
                    </div>
                    <button
                        onClick={handleStrikeAnalysis}
                        disabled={!customStrike}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition font-medium"
                    >
                        Analyze Strike
                    </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Current Spot: ₹{spotPrice.toLocaleString()} • {strikeIVData.length > 0 ? 'Enter any strike to see IV analysis' : 'Estimated IV values (load data for accurate results)'}
                </p>
            </div>

            {/* Selected Strike Analysis */}
            {selectedStrikeData && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-sm border-2 border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Strike ₹{selectedStrikeData.strike} Analysis</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedStrikeData.moneyness === 'ITM' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            selectedStrikeData.moneyness === 'ATM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                            {selectedStrikeData.moneyness}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Call IV</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPercent(selectedStrikeData.callIV)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Call Option IV</div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Put IV</div>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatPercent(selectedStrikeData.putIV)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Put Option IV</div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">IV Skew</div>
                            <div className={`text-2xl font-bold ${selectedStrikeData.ivSkew > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {selectedStrikeData.ivSkew > 0 ? '+' : ''}{(selectedStrikeData.ivSkew * 100).toFixed(2)}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {selectedStrikeData.ivSkew > 0 ? 'Puts more expensive' : 'Calls more expensive'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="text-sm text-blue-900 dark:text-blue-300">
                            <strong>Strike Analysis:</strong> This {selectedStrikeData.strike} strike is <strong>{selectedStrikeData.moneyness}</strong> with respect to spot price ₹{spotPrice.toLocaleString()}.
                            {selectedStrikeData.ivSkew > 0.02 ? ' Significant put bias suggests bearish sentiment.' : selectedStrikeData.ivSkew < -0.02 ? ' Significant call bias suggests bullish sentiment.' : ' Balanced IV suggests neutral sentiment.'}
                        </div>
                    </div>
                </div>
            )}

            {/* IV Rank & Percentile Cards */}
            {ivRankData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">IV Rank (52-Week)</div>
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{ivRankData.ivRank}%</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${ivRankData.ivRank}%` }}></div>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{ivRankData.interpretation}</div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">IV Percentile</div>
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{ivRankData.ivPercentile}%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                            {ivRankData.ivPercentile}% of days had lower IV
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <div className="text-slate-500">52W High</div>
                                <div className="font-semibold">{formatPercent(ivRankData.high52Week)}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">52W Low</div>
                                <div className="font-semibold">{formatPercent(ivRankData.low52Week)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Current IV</div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{formatPercent(ivRankData.current)}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">ATM Implied Volatility</div>
                        <div className="text-xs">
                            <div className="text-slate-500">52W Mean</div>
                            <div className="font-semibold">{formatPercent(ivRankData.mean52Week)}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Historical IV Chart */}
            {historicalIV.length > 0 && ivRankData && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">52-Week IV History</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalIV}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    formatter={(value: number) => [(value * 100).toFixed(2) + '%', 'IV']}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <ReferenceLine y={ivRankData.mean52Week} stroke="#6366f1" strokeDasharray="5 5" label="Mean" />
                                <ReferenceLine y={ivRankData.current} stroke="#3b82f6" strokeWidth={2} label="Current" />
                                <Line type="monotone" dataKey="iv" stroke="#6366f1" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* IV Skew & By-Strike Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* IV Skew */}
                {ivSkewData && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">IV Skew</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Average Skew</div>
                                <div className={`text-2xl font-bold ${ivSkewData.avgSkew > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {(ivSkewData.avgSkew * 100).toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{ivSkewData.interpretation}</div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <div className="text-xs text-slate-500">Max Skew</div>
                                    <div className="font-semibold">{(ivSkewData.maxSkew * 100).toFixed(2)}%</div>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <div className="text-xs text-slate-500">Min Skew</div>
                                    <div className="font-semibold">{(ivSkewData.minSkew * 100).toFixed(2)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* IV by Moneyness */}
                {moneynessIV && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-teal-600" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">IV by Moneyness</h2>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'ITM', Call: moneynessIV.itm.avgCallIV * 100, Put: moneynessIV.itm.avgPutIV * 100 },
                                    { name: 'ATM', Call: moneynessIV.atm.avgCallIV * 100, Put: moneynessIV.atm.avgPutIV * 100 },
                                    { name: 'OTM', Call: moneynessIV.otm.avgCallIV * 100, Put: moneynessIV.otm.avgPutIV * 100 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'IV %', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                    <Legend />
                                    <Bar dataKey="Call" fill="#10b981" />
                                    <Bar dataKey="Put" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Strike-by-Strike IV Table */}
            {strikeIVData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Strike-by-Strike IV</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">Strike</th>
                                    <th className="px-4 py-3 text-left">Moneyness</th>
                                    <th className="px-4 py-3 text-right">Call IV</th>
                                    <th className="px-4 py-3 text-right">Put IV</th>
                                    <th className="px-4 py-3 text-right">Skew</th>
                                </tr>
                            </thead>
                            <tbody>
                                {strikeIVData.slice(0, 15).map((strike, idx) => (
                                    <tr key={idx} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-2 font-semibold">₹{strike.strike}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${strike.moneyness === 'ITM' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                strike.moneyness === 'ATM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
                                                }`}>
                                                {strike.moneyness}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-right">{formatPercent(strike.callIV)}</td>
                                        <td className="px-4 py-2 text-right">{formatPercent(strike.putIV)}</td>
                                        <td className={`px-4 py-2 text-right font-semibold ${strike.ivSkew > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {strike.ivSkew > 0 ? '+' : ''}{(strike.ivSkew * 100).toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-600 dark:text-slate-400">Loading IV data...</div>
                </div>
            )}

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567895" className="mt-6" />
        </div>
    );
}
