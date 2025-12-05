import { useEffect, useRef, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Zap, Globe } from 'lucide-react';
import { DisplayAd } from './AdSense';

// Advanced Chart Widget - Full featured TradingView chart
function AdvancedChartWidget({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            interval: "D",
            timezone: "Asia/Kolkata",
            theme: "light",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            details: true,
            hotlist: true,
            calendar: true,
            studies: [
                "STD;SMA",
                "STD;MACD"
            ],
            support_host: "https://www.tradingview.com"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);
    }, [symbol]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "800px", width: "100%" }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

// Multi-Chart Widget - Multiple charts in one view
function MultiChartWidget({ symbols }: { symbols: string[] }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            feedMode: "all_symbols",
            colorTheme: "light",
            isTransparent: false,
            displayMode: "regular",
            width: "100%",
            height: "100%",
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);
    }, [symbols]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "500px", width: "100%" }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default function AdvancedCharts() {
    const [activeCategory, setActiveCategory] = useState<'forex' | 'stocks' | 'indices' | 'futures' | 'crypto'>('forex');
    const [selectedSymbol, setSelectedSymbol] = useState('FX:EURUSD');

    const categories = [
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
            id: 'stocks' as const,
            name: 'Stocks',
            icon: TrendingUp,
            symbols: [
                { symbol: 'NASDAQ:AAPL', name: 'Apple' },
                { symbol: 'NASDAQ:TSLA', name: 'Tesla' },
                { symbol: 'NASDAQ:MSFT', name: 'Microsoft' },
                { symbol: 'NASDAQ:GOOGL', name: 'Google' },
                { symbol: 'NSE:RELIANCE', name: 'Reliance' },
                { symbol: 'NSE:TCS', name: 'TCS' }
            ]
        },
        {
            id: 'indices' as const,
            name: 'Indices',
            icon: BarChart3,
            symbols: [
                { symbol: 'FOREXCOM:SPXUSD', name: 'S&P 500' },
                { symbol: 'FOREXCOM:NSXUSD', name: 'NASDAQ 100' },
                { symbol: 'NSE:NIFTY', name: 'NIFTY 50' },
                { symbol: 'INDEX:DEU40', name: 'DAX' },
                { symbol: 'INDEX:NKY', name: 'Nikkei 225' },
                { symbol: 'INDEX:FTSE', name: 'FTSE 100' }
            ]
        },
        {
            id: 'futures' as const,
            name: 'Futures',
            icon: Zap,
            symbols: [
                { symbol: 'CME_MINI:ES1!', name: 'S&P 500 Futures' },
                { symbol: 'CME_MINI:NQ1!', name: 'NASDAQ Futures' },
                { symbol: 'COMEX:GC1!', name: 'Gold Futures' },
                { symbol: 'NYMEX:CL1!', name: 'Crude Oil Futures' },
                { symbol: 'CBOT:ZW1!', name: 'Wheat Futures' },
                { symbol: 'COMEX:SI1!', name: 'Silver Futures' }
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
                { symbol: 'BINANCE:XRPUSDT', name: 'XRP' },
                { symbol: 'BINANCE:SOLUSDT', name: 'Solana' },
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
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8" />
                            Advanced Charts
                        </h1>
                        <p className="text-green-100">Professional-grade interactive charting for all asset classes</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-xs text-green-100 mb-1">Powered by</p>
                        <p className="text-lg font-bold">TradingView</p>
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
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-green-300'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* Symbol Selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-3">Select {currentCategory?.name} Instrument</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {currentCategory?.symbols.map(sym => (
                        <button
                            key={sym.symbol}
                            onClick={() => setSelectedSymbol(sym.symbol)}
                            className={`p-3 rounded-lg border-2 transition text-center ${selectedSymbol === sym.symbol
                                ? 'border-green-500 bg-green-50 shadow-md'
                                : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                                }`}
                        >
                            <p className="font-bold text-sm text-slate-800">{sym.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{sym.symbol.split(':')[1] || sym.symbol}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">
                            {currentCategory?.symbols.find(s => s.symbol === selectedSymbol)?.name || 'Chart'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                {selectedSymbol}
                            </span>
                            <a
                                href={`https://www.tradingview.com/chart/?symbol=${selectedSymbol}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                                Open in TradingView →
                            </a>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <AdvancedChartWidget symbol={selectedSymbol} />
                </div>
            </div>

            {/* Market Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">Market Timeline</h2>
                    <p className="text-sm text-slate-600 mt-1">Latest market events and updates</p>
                </div>
                <div className="p-4">
                    <MultiChartWidget symbols={currentCategory?.symbols.map(s => s.symbol) || []} />
                </div>
            </div>

            {/* Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                    <strong>Professional Charting Tools:</strong> Full suite of technical indicators, drawing tools, and timeframes. Click "Open in TradingView" for advanced features like alerts, backtesting, and custom indicators.
                </p>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567893" className="mt-6" />
        </div>
    );
}
