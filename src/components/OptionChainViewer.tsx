import { useState, useEffect, useMemo } from 'react';
import { Activity, RefreshCw, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getOptionChain, getAvailableExpiries } from '../services/optionChainService';
import {
    calculateDelta,
    calculateGamma,
    calculateTheta,
    calculateVega,
    calculateTimeToExpiry,
    getMoneyness
} from '../utils/greeksCalculations';
import {
    calculateMaxPain,
    calculatePCR
} from '../utils/optionChainCalculations';
import { usePaperTrading } from '../context/PaperTradingContext';
import PortfolioGreeks from './PortfolioGreeks';
import PositionsBadge from './PositionsBadge';
import { DisplayAd } from './AdSense';

interface OptionData {
    strike: number;
    call: OptionDetail;
    put: OptionDetail;
    moneyness: 'ITM' | 'ATM' | 'OTM';
}

interface OptionDetail {
    ltp: number;
    bid: number;
    ask: number;
    volume: number;
    oi: number;
    oiChange: number;
    iv: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
}

export default function OptionChainViewer() {
    const [symbol, setSymbol] = useState('NSE_INDEX|Nifty 50');
    const [expiry, setExpiry] = useState('');
    const [expiries, setExpiries] = useState<string[]>([]);
    const [spotPrice, setSpotPrice] = useState(19500);
    const [optionData, setOptionData] = useState<OptionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [strikeRange, setStrikeRange] = useState<'all' | '100' | '200' | '300' | '400' | '500'>('500');
    const [maxPain, setMaxPain] = useState(0);
    const [maxPainData, setMaxPainData] = useState<{ strike: number; pain: number }[]>([]);
    const [pcr, setPcr] = useState({ pcrByOI: 0, pcrByVolume: 0, signal: 'neutral', interpretation: '' });
    const [ivPercentile] = useState(42);

    const { portfolio, getPortfolioGreeks, executeTrade } = usePaperTrading();
    const portfolioGreeks = getPortfolioGreeks();

    const symbols = [
        { label: 'NIFTY', value: 'NSE_INDEX|Nifty 50' },
        { label: 'BANKNIFTY', value: 'NSE_INDEX|Nifty Bank' },
        { label: 'FINNIFTY', value: 'NSE_INDEX|Nifty Fin Service' }
    ];

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

    const fetchOptionChain = async () => {
        if (!expiry) return;
        setLoading(true);
        try {
            const chainData = await getOptionChain(symbol, expiry);
            if (chainData && chainData.spot_price) {
                setSpotPrice(chainData.spot_price);
                const processedData: OptionData[] = [];
                const strikes = chainData.strikes || [];
                const riskFreeRate = 0.07;
                const timeToExpiry = calculateTimeToExpiry(expiry);

                strikes.forEach((strikeData: any) => {
                    const strike = strikeData.strike_price;
                    const callData = strikeData.call_options || {};
                    const putData = strikeData.put_options || {};

                    const callDelta = calculateDelta(chainData.spot_price, strike, timeToExpiry, riskFreeRate, callData.iv || 0.30, 'call');
                    const callGamma = calculateGamma(chainData.spot_price, strike, timeToExpiry, riskFreeRate, callData.iv || 0.30);
                    const callTheta = calculateTheta(chainData.spot_price, strike, timeToExpiry, riskFreeRate, callData.iv || 0.30, 'call');
                    const callVega = calculateVega(chainData.spot_price, strike, timeToExpiry, riskFreeRate, callData.iv || 0.30);

                    const putDelta = calculateDelta(chainData.spot_price, strike, timeToExpiry, riskFreeRate, putData.iv || 0.30, 'put');
                    const putGamma = calculateGamma(chainData.spot_price, strike, timeToExpiry, riskFreeRate, putData.iv || 0.30);
                    const putTheta = calculateTheta(chainData.spot_price, strike, timeToExpiry, riskFreeRate, putData.iv || 0.30, 'put');
                    const putVega = calculateVega(chainData.spot_price, strike, timeToExpiry, riskFreeRate, putData.iv || 0.30);

                    processedData.push({
                        strike,
                        call: { ltp: callData.last_price || 0, bid: callData.bid_price || 0, ask: callData.ask_price || 0, volume: callData.volume || 0, oi: callData.oi || 0, oiChange: callData.oi_change || 0, iv: callData.iv || 0, delta: callDelta, gamma: callGamma, theta: callTheta, vega: callVega },
                        put: { ltp: putData.last_price || 0, bid: putData.bid_price || 0, ask: putData.ask_price || 0, volume: putData.volume || 0, oi: putData.oi || 0, oiChange: putData.oi_change || 0, iv: putData.iv || 0, delta: putDelta, gamma: putGamma, theta: putTheta, vega: putVega },
                        moneyness: getMoneyness(chainData.spot_price, strike, 'call')
                    });
                });

                setOptionData(processedData);
                const strikeData = processedData.map(d => ({ strike: d.strike, callOI: d.call.oi, putOI: d.put.oi, callVolume: d.call.volume, putVolume: d.put.volume }));
                const maxPainResult = calculateMaxPain(strikeData);
                setMaxPain(maxPainResult.maxPainStrike);
                setMaxPainData(maxPainResult.painByStrike);
                const pcrResult = calculatePCR(strikeData);
                setPcr(pcrResult);
            }
        } catch (error) {
            console.error('Error fetching option chain:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptionChain();
        let interval: NodeJS.Timeout;
        if (autoRefresh) interval = setInterval(fetchOptionChain, 5000);
        return () => { if (interval) clearInterval(interval); };
    }, [symbol, expiry, autoRefresh]);

    const filteredData = useMemo(() => {
        return optionData.filter((data) => {
            if (strikeRange === 'all') return true;
            const atmStrike = Math.round(spotPrice / 50) * 50;
            const range = Number(strikeRange);
            return Math.abs(data.strike - atmStrike) <= range;
        });
    }, [optionData, strikeRange, spotPrice]);

    const formatNumber = (num: number, decimals: number = 2) => num.toFixed(decimals);
    const getMoneynessColor = (moneyness: string) => {
        switch (moneyness) {
            case 'ITM': return 'bg-green-50 dark:bg-green-900/20';
            case 'ATM': return 'bg-yellow-50 dark:bg-yellow-900/20 font-bold';
            case 'OTM': return 'bg-white dark:bg-slate-800';
            default: return '';
        }
    };
    const getOIChangeColor = (change: number) => {
        if (change > 0) return 'text-green-600 dark:text-green-400';
        if (change < 0) return 'text-red-600 dark:text-red-400';
        return 'text-slate-600 dark:text-slate-400';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Option Chain</h1>
                    </div>
                    <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        {symbols.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <select value={expiry} onChange={(e) => setExpiry(e.target.value)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" disabled={expiries.length === 0}>
                        {expiries.map((exp) => <option key={exp} value={exp}>{new Date(exp).toLocaleDateString()}</option>)}
                    </select>
                    <select value={strikeRange} onChange={(e) => setStrikeRange(e.target.value as any)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        <option value="all">All Strikes</option>
                        <option value="100">ATM ± ₹100</option>
                        <option value="200">ATM ± ₹200</option>
                        <option value="300">ATM ± ₹300</option>
                        <option value="400">ATM ± ₹400</option>
                        <option value="500">ATM ± ₹500</option>
                    </select>
                    <button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${autoRefresh ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                        <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                        Auto Refresh
                    </button>
                    <button onClick={fetchOptionChain} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Spot Price - Manual Input */}
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Spot Price</div>
                        <input
                            type="number"
                            value={spotPrice || ''}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 || e.target.value === '') {
                                    setSpotPrice(val);
                                }
                            }}
                            placeholder="e.g., 19500"
                            className="w-full text-xl font-bold text-blue-700 dark:text-blue-300 bg-transparent border-b-2 border-blue-300 dark:border-blue-600 focus:outline-none focus:border-blue-500 px-1 py-1"
                            step="0.5"
                            min="0.01"
                        />
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Manual Update</div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                        <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Max Pain</div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">₹{maxPain.toLocaleString()}</div>
                    </div>
                    <div className={`p-4 rounded-xl ${pcr.signal === 'bullish' ? 'bg-green-50 dark:bg-green-900/20' : pcr.signal === 'bearish' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-700'}`}>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">PCR (OI)</div>
                        <div className={`text-2xl font-bold ${pcr.signal === 'bullish' ? 'text-green-700 dark:text-green-300' : pcr.signal === 'bearish' ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {pcr.pcrByOI.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1">{pcr.interpretation}</div>
                    </div>
                    {/* ATM Strike - Manual Input */}
                    <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                        <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">ATM Strike</div>
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                            ₹{Math.round(spotPrice / 50) * 50}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Auto-calculated</div>
                    </div>
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20">
                        <div className="text-sm text-teal-600 dark:text-teal-400 mb-1">IV Percentile</div>
                        <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{ivPercentile}%</div>
                        <div className="text-xs mt-1 text-slate-500">Moderate Volatility</div>
                    </div>
                </div>
            </div>

            {maxPainData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Max Pain Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Max Pain Analysis</h2>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Strike: <span className="font-bold text-purple-600">₹{maxPain.toLocaleString()}</span></span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={maxPainData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="strike" stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'Strike Price', position: 'insideBottom', offset: -5 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'Total Pain (₹)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} formatter={(value: number) => [`₹${(value / 1000000).toFixed(2)}M`, 'Pain']} />
                                    <ReferenceLine x={maxPain} stroke="#9333ea" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'Max Pain', position: 'top', fill: '#9333ea', fontSize: 12 }} />
                                    <Line type="monotone" dataKey="pain" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} activeDot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* OI Analysis Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">OI Analysis (ATM ±5)</h2>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredData.slice(Math.max(0, Math.floor(filteredData.length / 2) - 5), Math.min(filteredData.length, Math.floor(filteredData.length / 2) + 5))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="strike" stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                    <Legend />
                                    <Bar dataKey="call.oi" name="Call OI" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="put.oi" name="Put OI" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Portfolio Greeks Summary */}
            {portfolio.holdings.length > 0 && (
                <div className="mb-6">
                    <PortfolioGreeks {...portfolioGreeks} />
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        <tr>
                            <th className="px-2 py-2 text-left">Vol</th>
                            <th className="px-2 py-2 text-left">IV</th>
                            <th className="px-2 py-2 text-left">LTP</th>
                            <th className="px-2 py-2 text-left">Delta</th>
                            <th className="px-2 py-2 text-left">Theta</th>
                            <th className="px-3 py-2 text-center bg-slate-200 dark:bg-slate-600">Price</th>
                            <th className="px-2 py-2 text-right">Theta</th>
                            <th className="px-2 py-2 text-right">Delta</th>
                            <th className="px-2 py-2 text-right">LTP</th>
                            <th className="px-2 py-2 text-right">IV</th>
                            <th className="px-2 py-2 text-right">Vol</th>
                            <th className="px-2 py-2 text-right">ΔOI</th>
                            <th className="px-2 py-2 text-right">OI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const maxOIChange = Math.max(...filteredData.map(d => Math.max(Math.abs(d.call.oiChange), Math.abs(d.put.oiChange))));
                            return filteredData.map((data, idx) => (
                                <OptionChainRow
                                    key={idx}
                                    data={data}
                                    isMaxPain={data.strike === maxPain}
                                    maxOIChange={maxOIChange}
                                    portfolio={portfolio}
                                    symbol={symbol}
                                    executeTrade={executeTrade}
                                    formatNumber={formatNumber}
                                    getMoneynessColor={getMoneynessColor}
                                    getOIChangeColor={getOIChangeColor}
                                />
                            ));
                        })()}
                    </tbody>
                </table>
            </div>
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600 dark:text-slate-400">Loading option chain...</span>
                </div>
            )}
            {
                !loading && filteredData.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No option chain data available</div>
                )
            }

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567894" className="mt-6" />
        </div>
    );
}

const OptionChainRow = ({
    data,
    isMaxPain,
    maxOIChange,
    portfolio,
    symbol,
    executeTrade,
    formatNumber,
    getMoneynessColor,
    getOIChangeColor
}: {
    data: OptionData,
    isMaxPain: boolean,
    maxOIChange: number,
    portfolio: any,
    symbol: string,
    executeTrade: any,
    formatNumber: (num: number, decimals?: number) => string,
    getMoneynessColor: (moneyness: string) => string,
    getOIChangeColor: (change: number) => string
}) => {
    const hasCallBuildup = data.call.oiChange > data.call.oi * 0.1;
    const hasPutBuildup = data.put.oiChange > data.put.oi * 0.1;

    const callOIChangePercent = maxOIChange > 0 ? Math.abs(data.call.oiChange) / maxOIChange * 100 : 0;
    const putOIChangePercent = maxOIChange > 0 ? Math.abs(data.put.oiChange) / maxOIChange * 100 : 0;

    const callPosition = portfolio.holdings.find((h: any) =>
        h.symbol === symbol &&
        h.strikePrice === data.strike &&
        h.optionType === 'CALL'
    );

    const putPosition = portfolio.holdings.find((h: any) =>
        h.symbol === symbol &&
        h.strikePrice === data.strike &&
        h.optionType === 'PUT'
    );

    return (
        <tr className={`border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${isMaxPain ? 'ring-2 ring-purple-500' : ''}`}>
            <td className={`px-2 py-2 ${getMoneynessColor(data.moneyness)}`}>
                <div className="flex items-center gap-1">
                    {(data.call.oi / 1000).toFixed(0)}K
                    {hasCallBuildup && <span className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" title="Long Call Buildup - Bullish">🟢</span>}
                </div>
            </td>
            <td className={`px-2 py-2 relative ${getOIChangeColor(data.call.oiChange)}`}>
                <div
                    className={`absolute inset-y-1 left-0 opacity-20 ${data.call.oiChange > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${callOIChangePercent}%` }}
                ></div>
                <span className="relative z-10">{data.call.oiChange > 0 ? '+' : ''}{(data.call.oiChange / 1000).toFixed(0)}K</span>
            </td>
            <td className="px-2 py-2">{(data.call.volume / 1000).toFixed(0)}K</td>
            <td className="px-2 py-2">{formatNumber(data.call.iv * 100, 1)}%</td>
            <td className={`px-2 py-2 font-semibold relative ${callPosition ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                ₹{formatNumber(data.call.ltp)}
                {callPosition && (
                    <div className="absolute top-0 left-0 -ml-1 z-10">
                        <PositionsBadge
                            quantity={callPosition.quantity}
                            pnl={callPosition.pnl}
                            type={callPosition.quantity > 0 ? 'BUY' : 'SELL'}
                            onClose={() => executeTrade(callPosition.symbol, callPosition.quantity > 0 ? 'SELL' : 'BUY', Math.abs(callPosition.quantity), data.call.ltp)}
                        />
                    </div>
                )}
            </td>
            <td className="px-2 py-2 text-xs">{formatNumber(data.call.delta, 3)}</td>
            <td className="px-2 py-2 text-xs text-red-600">₹{formatNumber(data.call.theta)}</td>
            <td className={`px-3 py-2 text-center font-bold ${getMoneynessColor(data.moneyness)} bg-slate-100 dark:bg-slate-700`}>
                {data.strike}
                {isMaxPain && <span className="ml-1 text-purple-600">★</span>}
            </td>
            <td className="px-2 py-2 text-xs text-red-600 text-right">₹{formatNumber(data.put.theta)}</td>
            <td className="px-2 py-2 text-xs text-right">{formatNumber(data.put.delta, 3)}</td>
            <td className={`px-2 py-2 font-semibold text-right relative ${putPosition ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                ₹{formatNumber(data.put.ltp)}
                {putPosition && (
                    <div className="absolute top-0 right-0 -mr-1 z-10">
                        <PositionsBadge
                            quantity={putPosition.quantity}
                            pnl={putPosition.pnl}
                            type={putPosition.quantity > 0 ? 'BUY' : 'SELL'}
                            onClose={() => executeTrade(putPosition.symbol, putPosition.quantity > 0 ? 'SELL' : 'BUY', Math.abs(putPosition.quantity), data.put.ltp)}
                        />
                    </div>
                )}
            </td>
            <td className="px-2 py-2 text-right">{formatNumber(data.put.iv * 100, 1)}%</td>
            <td className="px-2 py-2 text-right">{(data.put.volume / 1000).toFixed(0)}K</td>
            <td className={`px-2 py-2 text-right relative ${getOIChangeColor(data.put.oiChange)}`}>
                <div
                    className={`absolute inset-y-1 right-0 opacity-20 ${data.put.oiChange > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${putOIChangePercent}%` }}
                ></div>
                <span className="relative z-10">{data.put.oiChange > 0 ? '+' : ''}{(data.put.oiChange / 1000).toFixed(0)}K</span>
            </td>
            <td className={`px-2 py-2 text-right ${getMoneynessColor(data.moneyness)}`}>
                <div className="flex items-center justify-end gap-1">
                    {hasPutBuildup && <span className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" title="Long Put Buildup - Bearish">🔴</span>}
                    {(data.put.oi / 1000).toFixed(0)}K
                </div>
            </td>
        </tr>
    );
};
