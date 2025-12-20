import { useState, useEffect, memo, useCallback } from 'react';
import { Activity, RefreshCw, AlertCircle, Zap, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import AdSlot from './AdSlot';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from './Skeleton';
import { useLivePrices } from '../context/LivePriceContext';
import { optionChainService, OptionData } from '../services/optionChainService';

// Declare TradingView global for TypeScript
declare global {
    interface Window {
        TradingView: any;
    }
}

function StraddleChart() {
    const [activeIndex, setActiveIndex] = useState('NIFTY');
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [priceChanges, setPriceChanges] = useState({ call: 0, put: 0, total: 0 });

    // Historical data tracking
    const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '6M' | '1Y'>('1D');
    const [historicalData, setHistoricalData] = useState<Array<{
        timestamp: number;
        price: number;
        callPremium: number;
        putPremium: number;
    }>>([]);
    const [dayStats, setDayStats] = useState({
        open: 0,
        high: 0,
        low: 0,
        prevClose: 0
    });

    // Expiry selection and option data
    const [selectedExpiry, setSelectedExpiry] = useState<string>('');
    const [availableExpiries, setAvailableExpiries] = useState<string[]>([]);
    const [fetchingExpiries, setFetchingExpiries] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(false);

    const indices = [
        { id: 'NIFTY', name: 'NIFTY 50', symbol: 'NSE:NIFTY', color: 'blue' },
        { id: 'BANKNIFTY', name: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY', color: 'green' },
        { id: 'FINNIFTY', name: 'FIN NIFTY', symbol: 'NSE:FINNIFTY', color: 'purple' },
        { id: 'MIDCPNIFTY', name: 'MIDCAP NIFTY', symbol: 'NSE:MIDCPNIFTY', color: 'orange' },
        { id: 'SENSEX', name: 'SENSEX', symbol: 'BSE:SENSEX', color: 'red' }
    ];

    const activeIndexData = indices.find(idx => idx.id === activeIndex);

    const { prices } = useLivePrices();
    const activeSymbol = activeIndexData?.symbol.split(':')[1] || 'NIFTY'; // Extract NIFTY from NSE:NIFTY

    // Map app indices to LivePriceContext symbols
    const contextSymbolMap: Record<string, string> = {
        'NIFTY': 'NIFTY 50',
        'BANKNIFTY': 'BANKNIFTY',
        'FINNIFTY': 'FINNIFTY', // Need to ensure these are in LivePriceContext
        'MIDCPNIFTY': 'MIDCPNIFTY',
        'SENSEX': 'SENSEX'
    };

    const livePriceData = prices[contextSymbolMap[activeIndex]];

    // Dynamic straddle data with state for real-time updates
    const [straddleData, setStraddleData] = useState({
        atmStrike: 19500,
        callPremium: 125.50,
        putPremium: 118.75,
        totalPremium: 244.25,
        change: 12.50,
        changePercent: 5.39,
        impliedVolatility: 18.45,
        expiry: 'Dec 07, 2025'
    });

    // Fetch available expiries when index changes
    useEffect(() => {
        const fetchExpiries = async () => {
            setFetchingExpiries(true);
            const expiries = await optionChainService.getAvailableExpiries(activeIndex);
            setAvailableExpiries(expiries);

            // Auto-select nearest expiry
            if (expiries.length > 0 && !selectedExpiry) {
                setSelectedExpiry(expiries[0]);
            }
            setFetchingExpiries(false);
        };

        fetchExpiries();
    }, [activeIndex]);

    // Fetch real option data from Upstox API
    useEffect(() => {
        const fetchOptionData = async () => {
            if (!livePriceData || !selectedExpiry) return;

            setFetchingOptions(true);
            const currentPrice = livePriceData.price;

            // Fetch real ATM options from Upstox
            const optionData = await optionChainService.getATMOptions(
                activeIndex,
                currentPrice,
                selectedExpiry
            );

            if (optionData) {
                setStraddleData(prev => ({
                    atmStrike: optionData.atmStrike,
                    callPremium: optionData.callPremium,
                    putPremium: optionData.putPremium,
                    totalPremium: optionData.callPremium + optionData.putPremium,
                    change: (optionData.callPremium + optionData.putPremium) - prev.totalPremium,
                    changePercent: prev.totalPremium > 0
                        ? (((optionData.callPremium + optionData.putPremium) - prev.totalPremium) / prev.totalPremium) * 100
                        : 0,
                    impliedVolatility: optionData.iv,
                    expiry: new Date(selectedExpiry).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })
                }));

                setPriceChanges({
                    call: 0,
                    put: 0,
                    total: 0
                });
            }
            setFetchingOptions(false);
        };

        // Fetch immediately
        fetchOptionData();

        // Refresh every 5 seconds to avoid API rate limits
        const interval = setInterval(fetchOptionData, 5000);

        return () => clearInterval(interval);
    }, [livePriceData, activeIndex, selectedExpiry]);

    // Track historical data and calculate stats
    useEffect(() => {
        const newDataPoint = {
            timestamp: Date.now(),
            price: straddleData.totalPremium,
            callPremium: straddleData.callPremium,
            putPremium: straddleData.putPremium
        };

        setHistoricalData(prev => {
            const updated = [...prev, newDataPoint];
            const trimmed = updated.slice(-1000); // Keep last 1000 points

            try {
                localStorage.setItem(`straddle_history_${activeIndex}`, JSON.stringify(trimmed));
            } catch (e) {
                console.warn('Failed to save historical data:', e);
            }

            return trimmed;
        });

        setDayStats(prev => {
            const currentPrice = straddleData.totalPremium;
            return {
                open: prev.open || currentPrice,
                high: Math.max(prev.high, currentPrice),
                low: prev.low === 0 ? currentPrice : Math.min(prev.low, currentPrice),
                prevClose: prev.prevClose || currentPrice
            };
        });
    }, [straddleData.totalPremium, straddleData.callPremium, straddleData.putPremium, activeIndex]);

    // Load historical data from localStorage on index change
    useEffect(() => {
        try {
            const saved = localStorage.getItem(`straddle_history_${activeIndex}`);
            if (saved) {
                setHistoricalData(JSON.parse(saved));
            } else {
                setHistoricalData([]);
            }
        } catch (e) {
            console.warn('Failed to load historical data:', e);
            setHistoricalData([]);
        }

        setDayStats({ open: 0, high: 0, low: 0, prevClose: 0 });
    }, [activeIndex]);

    // Load TradingView script once
    useEffect(() => {
        if (document.getElementById('tv-widget-script')) return;

        const script = document.createElement('script');
        script.id = 'tv-widget-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            setLoading(false);
        };
        document.head.appendChild(script);
    }, []);

    // Initialize/Update Widget
    useEffect(() => {
        if (!window.TradingView || !activeIndexData) return;

        new window.TradingView.widget({
            autosize: true,
            symbol: activeIndexData.symbol,
            interval: '5',
            timezone: 'Asia/Kolkata',
            theme: 'light',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            container_id: 'tradingview_chart',
            studies: ['MASimple@tv-basicstudies'],
            height: 500
        });
    }, [activeIndex, activeIndexData, loading]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    // Export historical data as CSV
    const exportToCSV = useCallback(() => {
        const headers = ['Timestamp', 'Date/Time', 'Total Premium', 'Call Premium', 'Put Premium'];
        const rows = historicalData.map(d => [
            d.timestamp,
            new Date(d.timestamp).toLocaleString(),
            d.price.toFixed(2),
            d.callPremium.toFixed(2),
            d.putPremium.toFixed(2)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeIndex}_straddle_history_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [historicalData, activeIndex]);

    // Prepare chart data with call and put premiums for comparison
    const chartData = historicalData.slice(-100).map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        call: d.callPremium,
        put: d.putPremium,
        total: d.price
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Activity className="w-8 h-8 text-blue-600" />
                                Live Premium Charts
                                <span className="flex items-center gap-2 text-sm font-normal text-green-600 dark:text-green-400">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    LIVE
                                </span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Real-time ATM options premium for Indian indices • Last update: {lastUpdate.toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {indices.map(index => (
                        <button
                            key={index.id}
                            onClick={() => setActiveIndex(index.id)}
                            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${activeIndex === index.id
                                ? `bg-${index.color}-600 text-white shadow-lg`
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {index.name}
                        </button>
                    ))}
                </div>

                {/* Expiry Selector */}
                <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-slate-900 dark:text-white">Select Expiry:</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {fetchingExpiries ? (
                                <div className="text-sm text-slate-500">Loading expiries...</div>
                            ) : availableExpiries.length > 0 ? (
                                <select
                                    value={selectedExpiry}
                                    onChange={(e) => setSelectedExpiry(e.target.value)}
                                    className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {availableExpiries.map((expiry) => (
                                        <option key={expiry} value={expiry}>
                                            {new Date(expiry).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                weekday: 'short'
                                            })}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-sm text-red-500">No expiries available</div>
                            )}
                            {fetchingOptions && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Fetching premiums...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">ATM Strike</p>
                        {loading ? (
                            <Skeleton className="h-8 w-24" />
                        ) : (
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{straddleData.atmStrike}</p>
                        )}
                    </div>

                    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all ${priceChanges.call > 0 ? 'ring-2 ring-green-400' : priceChanges.call < 0 ? 'ring-2 ring-red-400' : ''
                        }`}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Call Premium</p>
                        {loading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                                ₹{straddleData.callPremium.toFixed(2)}
                                {priceChanges.call !== 0 && (
                                    <span className={`text-xs ${priceChanges.call > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {priceChanges.call > 0 ? '▲' : '▼'}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all ${priceChanges.put > 0 ? 'ring-2 ring-green-400' : priceChanges.put < 0 ? 'ring-2 ring-red-400' : ''
                        }`}>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Put Premium</p>
                        {loading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <p className="text-2xl font-bold text-red-600 flex items-center gap-2">
                                ₹{straddleData.putPremium.toFixed(2)}
                                {priceChanges.put !== 0 && (
                                    <span className={`text-xs ${priceChanges.put > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {priceChanges.put > 0 ? '▲' : '▼'}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white transition-all ${priceChanges.total > 0 ? 'ring-2 ring-green-400' : priceChanges.total < 0 ? 'ring-2 ring-red-400' : ''
                        }`}>
                        <p className="text-sm text-blue-100 mb-1">Total Premium</p>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-32 bg-blue-500/50" />
                                <Skeleton className="h-4 w-24 bg-blue-500/50" />
                            </div>
                        ) : (
                            <>
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    ₹{straddleData.totalPremium.toFixed(2)}
                                    {priceChanges.total !== 0 && (
                                        <span className={`text-xs ${priceChanges.total > 0 ? 'text-green-200' : 'text-red-200'}`}>
                                            {priceChanges.total > 0 ? '▲' : '▼'}
                                        </span>
                                    )}
                                </p>
                                <p className={`text-sm mt-1 ${straddleData.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                    {straddleData.change >= 0 ? '+' : ''}{straddleData.change.toFixed(2)} ({straddleData.changePercent.toFixed(2)}%)
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Implied Volatility (IV)</p>
                                {loading ? (
                                    <Skeleton className="h-7 w-20 mt-1" />
                                ) : (
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{straddleData.impliedVolatility.toFixed(2)}%</p>
                                )}
                            </div>
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Next Expiry</p>
                                {loading ? (
                                    <Skeleton className="h-7 w-24 mt-1" />
                                ) : (
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{straddleData.expiry}</p>
                                )}
                            </div>
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                <Activity className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Day Stats Panel - FinanceDeft Style */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">₹{dayStats.open.toFixed(2)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">High</p>
                        <p className="text-lg font-bold text-green-600">₹{dayStats.high.toFixed(2)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Low</p>
                        <p className="text-lg font-bold text-red-600">₹{dayStats.low.toFixed(2)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Prev Close</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">₹{dayStats.prevClose.toFixed(2)}</p>
                    </div>
                </div>

                {/* Historical Chart Section */}
                {historicalData.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Live Call vs Put Premium
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time comparison (Last {chartData.length} updates)</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Call</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Put</span>
                                </div>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#64748b"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        tick={{ fontSize: 12 }}
                                        label={{ value: 'Premium (₹)', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value: number) => `₹${value.toFixed(2)}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="call"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={false}
                                        name="Call Premium"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="put"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={false}
                                        name="Put Premium"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">\
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {activeIndexData?.name} - Intraday Movement
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">5-minute interval chart</p>
                    </div>
                    <div id="tradingview_chart" className="bg-white" style={{ minHeight: '500px' }}></div>
                </div>

                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">📊 What is a Straddle?</h3>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                        A <strong>straddle</strong> is an options strategy where you buy (or sell) both a call and put option at the same strike price (ATM - At The Money).
                        The total premium shown above is the combined cost of both options. Traders use straddles to profit from significant price movements in either direction,
                        especially during high volatility events like earnings, budget announcements, or major economic data releases.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">✅ Long Straddle (Buy)</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Profit when price moves significantly up or down. Risk is limited to premium paid.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">⚠️ Short Straddle (Sell)</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Profit when price stays stable. High risk if price moves sharply. Use stop-losses!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* AdSense Display Ad */}
            <AdSlot slot="straddle-chart-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}

export default memo(StraddleChart);
