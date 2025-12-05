import { useEffect, useRef, useState } from 'react';
import { Activity, TrendingUp, DollarSign, Zap, Globe, BarChart2 } from 'lucide-react';
import { DisplayAd } from './AdSense';

// Technical Analysis Widget
function TechnicalAnalysisWidget({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            interval: "1D",
            width: "100%",
            isTransparent: false,
            height: "100%",
            symbol: symbol,
            showIntervalTabs: true,
            displayMode: "single",
            locale: "en",
            colorTheme: "light"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);
    }, [symbol]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "450px", width: "100%" }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default function TechnicalAnalysis() {
    const [activeCategory, setActiveCategory] = useState<'indices' | 'stocks' | 'forex' | 'commodities' | 'crypto'>('indices');
    const [selectedSymbol, setSelectedSymbol] = useState('NSE:NIFTY');

    const categories = [
        {
            id: 'indices' as const,
            name: 'Indices',
            icon: BarChart2,
            symbols: [
                { symbol: 'NSE:NIFTY', name: 'NIFTY 50' },
                { symbol: 'NSE:BANKNIFTY', name: 'BANK NIFTY' },
                { symbol: 'BSE:SENSEX', name: 'SENSEX' },
                { symbol: 'FOREXCOM:SPXUSD', name: 'S&P 500' },
                { symbol: 'FOREXCOM:NSXUSD', name: 'NASDAQ 100' },
                { symbol: 'INDEX:DEU40', name: 'DAX' }
            ]
        },
        {
            id: 'stocks' as const,
            name: 'Stocks',
            icon: TrendingUp,
            symbols: [
                { symbol: 'NSE:RELIANCE', name: 'Reliance' },
                { symbol: 'NSE:TCS', name: 'TCS' },
                { symbol: 'NSE:INFY', name: 'Infosys' },
                { symbol: 'NSE:HDFCBANK', name: 'HDFC Bank' },
                { symbol: 'NASDAQ:AAPL', name: 'Apple' },
                { symbol: 'NASDAQ:TSLA', name: 'Tesla' }
            ]
        },
        {
            id: 'forex' as const,
            name: 'Forex',
            icon: DollarSign,
            symbols: [
                { symbol: 'FX:EURUSD', name: 'EUR/USD' },
                { symbol: 'FX:GBPUSD', name: 'GBP/USD' },
                { symbol: 'FX:USDJPY', name: 'USD/JPY' },
                { symbol: 'FX_IDC:USDINR', name: 'USD/INR' },
                { symbol: 'FX:AUDUSD', name: 'AUD/USD' },
                { symbol: 'FX:USDCAD', name: 'USD/CAD' }
            ]
        },
        {
            id: 'commodities' as const,
            name: 'Commodities',
            icon: Zap,
            symbols: [
                { symbol: 'MCX:GOLD1!', name: 'Gold' },
                { symbol: 'MCX:SILVER1!', name: 'Silver' },
                { symbol: 'MCX:CRUDEOIL1!', name: 'Crude Oil' },
                { symbol: 'MCX:NATURALGAS1!', name: 'Natural Gas' },
                { symbol: 'MCX:COPPER1!', name: 'Copper' },
                { symbol: 'MCX:ZINC1!', name: 'Zinc' }
            ]
        },
        {
            id: 'crypto' as const,
            name: 'Crypto',
            icon: Globe,
            symbols: [
                { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin' },
                { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum' },
                { symbol: 'BINANCE:BNBUSDT', name: 'BNB' },
                { symbol: 'BINANCE:SOLUSDT', name: 'Solana' },
                { symbol: 'BINANCE:XRPUSDT', name: 'XRP' },
                { symbol: 'BINANCE:ADAUSDT', name: 'Cardano' }
            ]
        }
    ];

    const currentCategory = categories.find(c => c.id === activeCategory);

    const handleCategoryChange = (categoryId: typeof activeCategory) => {
        setActiveCategory(categoryId);
        const newCategory = categories.find(c => c.id === categoryId);
        if (newCategory && newCategory.symbols.length > 0) {
            setSelectedSymbol(newCategory.symbols[0].symbol);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Activity className="w-8 h-8" />
                            Technical Analysis
                        </h1>
                        <p className="text-blue-100">Advanced technical indicators, moving averages, and pivot points</p>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${activeCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Symbol List */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full">
                        <h3 className="font-bold text-slate-800 mb-4">Select Instrument</h3>
                        <div className="space-y-2">
                            {currentCategory?.symbols.map(sym => (
                                <button
                                    key={sym.symbol}
                                    onClick={() => setSelectedSymbol(sym.symbol)}
                                    className={`w-full p-3 rounded-lg border transition text-left flex items-center justify-between ${selectedSymbol === sym.symbol
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                                        : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <span>{sym.name}</span>
                                    {selectedSymbol === sym.symbol && <Activity className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content - Technical Widget */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Technical Summary: {currentCategory?.symbols.find(s => s.symbol === selectedSymbol)?.name}
                                </h2>
                                <p className="text-sm text-slate-500">Real-time moving averages, oscillators, and pivots</p>
                            </div>
                            <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">
                                {selectedSymbol}
                            </span>
                        </div>
                        <div className="p-4 h-[600px]">
                            <TechnicalAnalysisWidget symbol={selectedSymbol} />
                        </div>
                    </div>

                    {/* Explanation Section */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-800 mb-2">Moving Averages</h4>
                            <p className="text-sm text-green-700">
                                Analyzes price trends over specific time periods (SMA, EMA) to identify buy/sell signals based on crossovers.
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <h4 className="font-bold text-purple-800 mb-2">Oscillators</h4>
                            <p className="text-sm text-purple-700">
                                Indicators like RSI, MACD, and Stochastic that help identify overbought or oversold conditions.
                            </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <h4 className="font-bold text-orange-800 mb-2">Pivot Points</h4>
                            <p className="text-sm text-orange-700">
                                Key support and resistance levels calculated from previous period's high, low, and close prices.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567897" className="mt-6" />
        </div>
    );
}
