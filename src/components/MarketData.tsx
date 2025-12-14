import { useEffect, useRef, memo } from 'react';
import { Globe, TrendingUp, TrendingDown, Activity, BarChart3, Zap, DollarSign } from 'lucide-react';
import GiftNiftySimulation from './GiftNiftySimulation';
import { useLivePrices } from '../context/LivePriceContext';

// Market Ticker Widget
import LiveMarketTicker from './LiveMarketTicker';
import LiveIndicesWidget from './LiveIndicesWidget';
import LiveGlobalIndicesWidget from './LiveGlobalIndicesWidget';
import { CryptoChartWidget } from './CryptoMarketWidgets';


// World Indices Widget
const WorldIndicesWidget = memo(function WorldIndicesWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            symbolsGroups: [
                {
                    name: "Indices",
                    originalName: "Indices",
                    symbols: [
                        { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
                        { name: "FOREXCOM:NSXUSD", displayName: "NASDAQ 100" },
                        { name: "FOREXCOM:DJI", displayName: "Dow Jones" },
                        { name: "INDEX:NKY", displayName: "Nikkei 225" },
                        { name: "INDEX:DEU40", displayName: "DAX" },
                        { name: "INDEX:FTSE", displayName: "FTSE 100" },
                        { name: "HSI:HSI", displayName: "Hang Seng" },
                        { name: "BSE:SENSEX", displayName: "SENSEX" },
                        { name: "NSE:NIFTY", displayName: "NIFTY 50" },
                        { name: "NSE:BANKNIFTY", displayName: "BANK NIFTY" }
                    ]
                }
            ],
            showSymbolLogo: true,
            colorTheme: "light",
            isTransparent: false,
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "500px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

// Top Stocks (Most Active, Gainers, Losers) - Screener Widget
const TopStocksWidget = memo(function TopStocksWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            defaultColumn: "overview",
            defaultScreen: "top_gainers",
            market: "america",
            showToolbar: true,
            colorTheme: "light",
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "600px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});



// Indices Futures Widget - Using Market Quotes for guaranteed real-time updates
const IndicesFuturesWidget = memo(function IndicesFuturesWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            symbolsGroups: [
                {
                    name: "Indices Futures",
                    originalName: "Indices Futures",
                    symbols: [
                        { name: "CME_MINI:ES1!", displayName: "S&P 500 Futures" },
                        { name: "CME_MINI:NQ1!", displayName: "NASDAQ 100 Futures" },
                        { name: "CBOT:YM1!", displayName: "Dow Jones Futures" },
                        { name: "CME:VX1!", displayName: "VIX Futures" },
                        { name: "EUREX:FDAX1!", displayName: "DAX Futures" },
                        { name: "CME:NIY1!", displayName: "Nikkei 225 Futures" }
                    ]
                }
            ],
            showSymbolLogo: true,
            colorTheme: "light",
            isTransparent: false,
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "450px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

// Commodities Widget - Using Market Quotes for guaranteed real-time updates
const CommoditiesWidget = memo(function CommoditiesWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            symbolsGroups: [
                {
                    name: "Commodities",
                    originalName: "Commodities",
                    symbols: [
                        { name: "COMEX:GC1!", displayName: "Gold" },
                        { name: "NYMEX:CL1!", displayName: "Crude Oil WTI" },
                        { name: "COMEX:SI1!", displayName: "Silver" },
                        { name: "NYMEX:NG1!", displayName: "Natural Gas" },
                        { name: "CBOT:ZS1!", displayName: "Soybeans" },
                        { name: "CBOT:ZW1!", displayName: "Wheat" },
                        { name: "COMEX:HG1!", displayName: "Copper" },
                        { name: "NYMEX:RB1!", displayName: "Gasoline" }
                    ]
                }
            ],
            showSymbolLogo: true,
            colorTheme: "light",
            isTransparent: false,
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "450px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

// Forex Widget
const ForexWidget = memo(function ForexWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY", "INR"],
            isTransparent: false,
            colorTheme: "light",
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "450px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

// Crypto Widget
const CryptoWidget = memo(function CryptoWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            symbolsGroups: [
                {
                    name: "Crypto",
                    originalName: "Cryptocurrencies",
                    symbols: [
                        { name: "BINANCE:BTCUSDT", displayName: "Bitcoin" },
                        { name: "BINANCE:ETHUSDT", displayName: "Ethereum" },
                        { name: "BINANCE:BNBUSDT", displayName: "BNB" },
                        { name: "BINANCE:XRPUSDT", displayName: "XRP" },
                        { name: "BINANCE:ADAUSDT", displayName: "Cardano" },
                        { name: "BINANCE:SOLUSDT", displayName: "Solana" }
                    ]
                }
            ],
            showSymbolLogo: true,
            colorTheme: "light",
            isTransparent: false,
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "400px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

// Bonds/Rates Widget
const BondsWidget = memo(function BondsWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "100%",
            symbolsGroups: [
                {
                    name: "Bonds",
                    originalName: "Bonds & Rates",
                    symbols: [
                        { name: "CBOT:ZB1!", displayName: "US 30Y T-Bond" },
                        { name: "CBOT:ZN1!", displayName: "US 10Y T-Note" },
                        { name: "CBOT:ZF1!", displayName: "US 5Y T-Note" },
                        { name: "EUREX:FGBL1!", displayName: "Euro Bund" },
                        { name: "TVC:US10Y", displayName: "US 10Y Yield" },
                        { name: "TVC:US02Y", displayName: "US 2Y Yield" }
                    ]
                }
            ],
            showSymbolLogo: true,
            colorTheme: "light",
            isTransparent: false,
            locale: "en"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height: "400px" }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

export default memo(function MarketData() {
    const { usingLiveApi } = useLivePrices();
    return (
        <div className="space-y-6 pb-12">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Globe className="w-8 h-8" />
                            World Financial Markets
                        </h1>
                        <p className="text-blue-100">Comprehensive real-time data across global markets</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-xs text-blue-100 mb-1">Market Status</p>
                        <p className="text-lg font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                        </p>
                    </div>
                </div>
            </div>

            {!usingLiveApi && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <div>
                            <p className="font-bold text-yellow-800">Simulation Mode Active</p>
                            <p className="text-sm text-yellow-700">You are viewing simulated market data. Log in with Upstox for real-time live feeds.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Market Ticker */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Live Market Ticker
                    </h3>
                </div>
                <LiveMarketTicker />
            </div>

            {/* World Indices */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        World Indices
                    </h2>
                </div>
                <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {/* <WorldIndicesWidget /> */}
                        <LiveGlobalIndicesWidget />
                    </div>
                    <div className="lg:col-span-1">
                        <GiftNiftySimulation />
                    </div>
                </div>
            </div>

            {/* Indian Indices */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-green-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                        Indian Indices - Main & Sectoral
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">Real-time NSE/BSE indices including sectoral performance</p>
                </div>
                <div className="p-4">
                    <LiveIndicesWidget />
                </div>
            </div>

            {/* Two Column Layout - Top Movers & Indices Futures */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Stocks (Most Active, Gainers, Losers) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            Top Stocks - Most Active & Movers
                        </h2>
                    </div>
                    <div className="p-4">
                        <TopStocksWidget />
                    </div>
                </div>

                {/* Indices Futures */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-purple-600" />
                            Indices Futures
                        </h2>
                    </div>
                    <div className="p-4">
                        <IndicesFuturesWidget />
                    </div>
                </div>
            </div>

            {/* Commodities */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                        Real-Time Commodities
                    </h2>
                </div>
                <div className="p-4">
                    <CommoditiesWidget />
                </div>
            </div>

            {/* Forex Cross Rates */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingDown className="w-6 h-6 text-orange-600" />
                        Forex Cross Rates
                    </h2>
                </div>
                <div className="p-4">
                    <ForexWidget />
                </div>
            </div>

            {/* Two Column Layout - Crypto & Bonds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cryptocurrencies */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-600" />
                            Bitcoin Advanced Analysis
                        </h2>
                    </div>
                    {/* Use the Advanced Chart Widget instead of the simple list */}
                    <div className="p-4 h-[500px]">
                        <CryptoChartWidget />
                    </div>
                </div>

                {/* Bonds & Rates */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-red-600" />
                            Bonds & Rates
                        </h2>
                    </div>
                    <div className="p-4">
                        <BondsWidget />
                    </div>
                </div>
            </div>

            {/* Attribution */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <p className="text-xs text-blue-800">
                    <strong>Powered by TradingView</strong><br />
                    Real-time data from global exchanges including NSE, BSE, NYSE, NASDAQ, CME, and more. All quotes and widgets update automatically during market hours.
                </p>
            </div>
        </div>
    );
});
