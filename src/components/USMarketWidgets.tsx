import { useEffect, useRef, memo, useState } from 'react';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Zap, Calendar, Activity, BarChart2, Globe } from 'lucide-react';
import { useLivePrices } from '../context/LivePriceContext';

// --- 1. US Market Status ---
export const USMarketStatus = memo(() => {
    const [status, setStatus] = useState<string>('CLOSED');
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
            const day = nyTime.getDay();
            const hour = nyTime.getHours();
            const minute = nyTime.getMinutes();

            // Market Hours: 9:30 AM - 4:00 PM EST, Mon-Fri
            const isWeekday = day >= 1 && day <= 5;
            const marketOpen = 9 * 60 + 30; // 9:30 AM in minutes
            const marketClose = 16 * 60; // 4:00 PM in minutes
            const currentTime = hour * 60 + minute;

            if (isWeekday && currentTime >= marketOpen && currentTime < marketClose) {
                setStatus('OPEN');
                const diff = marketClose - currentTime;
                const h = Math.floor(diff / 60);
                const m = diff % 60;
                setTimeLeft(`Closes in ${h}h ${m}m`);
            } else {
                setStatus('CLOSED');
                // Calculate time to next open
                let daysUntilOpen = 0;
                if (day === 5 && currentTime >= marketClose) daysUntilOpen = 3; // Fri after close -> Mon
                else if (day === 6) daysUntilOpen = 2; // Sat -> Mon
                else if (day === 0) daysUntilOpen = 1; // Sun -> Mon
                else if (currentTime >= marketClose) daysUntilOpen = 1; // Weekday after close -> Next day

                if (daysUntilOpen > 0 || currentTime < marketOpen) {
                    setTimeLeft('Opens at 9:30 AM EST');
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const isOpen = status === 'OPEN';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                    <h3 className="text-sm font-bold text-slate-700">NYSE / NASDAQ</h3>
                    <p className={`text-xs font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>{status}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Last Data: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-slate-500 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>EST Time</span>
                </div>
                <p className="text-xs font-medium text-slate-600">{timeLeft}</p>
            </div>
        </div>
    );
});


// --- 2. AI Insight Widget ---
export const AIInsightWidget = memo(() => {
    const { prices } = useLivePrices();
    const [insight, setInsight] = useState("Analyzing market data...");

    useEffect(() => {
        // Simple mock AI logic
        const nasdaq = prices['NASDAQ'];
        const sp500 = prices['S&P 500'];
        const vix = prices['VIX'] || { price: 20, change: 0 }; // Fallback

        if (!nasdaq || !sp500) return;

        let sentiment = "Neutral";
        let text = "";

        if (nasdaq.changePercent > 1 && sp500.changePercent > 0.5) sentiment = "Bullish";
        else if (nasdaq.changePercent < -1 && sp500.changePercent < -0.5) sentiment = "Bearish";

        if (sentiment === "Bullish") {
            text = "Tech sector showing strong momentum. Risk appetite is returning as major indices push higher. Buying pressure observed in growth stocks.";
        } else if (sentiment === "Bearish") {
            text = "Defensive rotation detected. Rising volatility suggests caution. Investors are moving away from risk assets amidst market uncertainty.";
        } else {
            text = "Market is consolidating. Traders are awaiting clearer signals or macro data. Mixed performance across sectors indicates indecision.";
        }

        if (vix.price > 25) text += " High volatility warning (VIX > 25).";

        setInsight(text);
    }, [prices]);

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
                <Zap className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
                <Activity className="w-5 h-5 text-indigo-200" />
                <h3 className="font-bold text-indigo-100 uppercase tracking-wider text-xs">AI Daily Insight</h3>
            </div>
            <p className="text-lg font-medium leading-relaxed relative z-10">
                "{insight}"
            </p>
        </div>
    );
});


// --- 3. TradingView Widgets Helper ---
const TVWidget = ({ scriptHTML, height = "400px" }: { scriptHTML: any, height?: string }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        // Merge properties
        Object.entries(scriptHTML).forEach(([key, value]) => {
            // @ts-ignore
            script[key] = value;
        });
        // If it's src, set src
        if (scriptHTML.src) script.src = scriptHTML.src;
        if (scriptHTML.innerHTML) script.innerHTML = scriptHTML.innerHTML;

        container.current.appendChild(script);
        return () => {
            if (container.current) container.current.innerHTML = '';
        };
    }, []);

    return (
        <div className="tradingview-widget-container" style={{ height }} ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

// --- 4. Economic Calendar ---
export const EconomicCalendarWidget = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Economic Calendar</h3>
            </div>
            <TVWidget
                height="600px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-events.js",
                    innerHTML: JSON.stringify({
                        "colorTheme": "light",
                        "isTransparent": false,
                        "width": "100%",
                        "height": "100%",
                        "locale": "en",
                        "importanceFilter": "-1,0,1",
                        "index": "s&p500" // Filtering logic is tricky in this widget, but generic works
                    })
                }}
            />
        </div>
    );
});


// --- 5. Stock Sector Heatmap ---
export const SectorHeatmapWidget = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-800">S&P 500 Sector Heatmap</h3>
            </div>
            <TVWidget
                height="700px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js",
                    innerHTML: JSON.stringify({
                        "exchanges": [],
                        "dataSource": "SPX500",
                        "grouping": "sector",
                        "blockSize": "market_cap_basic",
                        "blockColor": "change",
                        "locale": "en",
                        "symbolUrl": "",
                        "colorTheme": "light",
                        "hasTopBar": false,
                        "isTransparent": false,
                        "width": "100%",
                        "height": "100%"
                    })
                }}
            />
        </div>
    );
});

// --- 6. Most Active Options (Hot Stocks) ---
export const MostActiveOptionsWidget = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-slate-800">Most Active Options (High Impact)</h3>
            </div>
            <TVWidget
                height="500px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                    innerHTML: JSON.stringify({
                        "width": "100%",
                        "height": "100%",
                        "symbolsGroups": [
                            {
                                "name": "Most Active / Volatile",
                                "originalName": "Most Active / Volatile",
                                "symbols": [
                                    { "name": "NASDAQ:NVDA", "displayName": "NVIDIA" },
                                    { "name": "NASDAQ:TSLA", "displayName": "Tesla" },
                                    { "name": "NASDAQ:AAPL", "displayName": "Apple" },
                                    { "name": "NASDAQ:AMD", "displayName": "AMD" },
                                    { "name": "NASDAQ:AMZN", "displayName": "Amazon" },
                                    { "name": "NASDAQ:META", "displayName": "Meta" },
                                    { "name": "NYSE:GME", "displayName": "GameStop" },
                                    { "name": "NASDAQ:COIN", "displayName": "Coinbase" }
                                ]
                            }
                        ],
                        "showSymbolLogo": true,
                        "colorTheme": "light",
                        "isTransparent": false,
                        "locale": "en"
                    })
                }}
            />
        </div>
    );
});

// --- 7. VIX Gauge ---
export const VIXGauge = memo(() => {
    // VIX Widget using Mini Chart or similar if simple quote isn't enough visual
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-800">Volatility Index (VIX)</h3>
            </div>
            <TVWidget
                height="400px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js",
                    innerHTML: JSON.stringify({
                        "symbol": "CBOE:VIX",
                        "width": "100%",
                        "height": "100%",
                        "locale": "en",
                        "dateRange": "1D",
                        "colorTheme": "light",
                        "isTransparent": false,
                        "autosize": false,
                        "largeChartUrl": ""
                    })
                }}
            />
        </div>
    );
});

// --- 8. Bond Yields ---
export const BondYieldMonitor = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-slate-800">US Treasury Yields (Smart Money)</h3>
            </div>
            <TVWidget
                height="450px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                    innerHTML: JSON.stringify({
                        "width": "100%",
                        "height": "100%",
                        "symbolsGroups": [
                            {
                                "name": "Bonds",
                                "originalName": "Bonds",
                                "symbols": [
                                    { "name": "TVC:US10Y", "displayName": "US 10Y Yield" },
                                    { "name": "TVC:US02Y", "displayName": "US 2Y Yield" },
                                    { "name": "TVC:US30Y", "displayName": "US 30Y Yield" }
                                ]
                            }
                        ],
                        "showSymbolLogo": true,
                        "colorTheme": "light",
                        "isTransparent": false,
                        "locale": "en"
                    })
                }}
            />
        </div>
    );
});

// --- 9. Fed Rate Monitor ---
export const FedRateMonitor = memo(() => {
    // There isn't a direct free "Fed Rate Probability" widget easily linkable without IFrames from CME.
    // We will use a proxy: The "Economic Clendar" covers FOMC, or a generic "Interest Rate" key if available.
    // Alternatively, just a static link or a simpler rate display.
    // Let's use a Mini Chart of the Fed Funds Rate (FRED:FEDFUNDS) as a proxy for the trend.
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Effective Fed Funds Rate</h3>
            </div>
            <TVWidget
                height="400px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js",
                    innerHTML: JSON.stringify({
                        "symbol": "FRED:FEDFUNDS",
                        "width": "100%",
                        "height": "100%",
                        "locale": "en",
                        "dateRange": "12M",
                        "colorTheme": "light",
                        "isTransparent": false,
                        "autosize": false,
                        "largeChartUrl": ""
                    })
                }}
            />
        </div>
    );
});

// --- 10. Real-time US Indices ---
export const USIndicesMarketWidget = memo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Major US Indices</h3>
        </div>
        <TVWidget
            height="500px"
            scriptHTML={{
                src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                innerHTML: JSON.stringify({
                    "width": "100%",
                    "height": "100%",
                    "symbolsGroups": [
                        {
                            "name": "Indices",
                            "originalName": "Indices",
                            "symbols": [
                                { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500" },
                                { "name": "FOREXCOM:NSXUSD", "displayName": "Nasdaq 100" },
                                { "name": "FOREXCOM:DJI", "displayName": "Dow 30" },
                                { "name": "FOREXCOM:RUT", "displayName": "Russell 2000" }
                            ]
                        }
                    ],
                    "showSymbolLogo": true,
                    "colorTheme": "light",
                    "isTransparent": false,
                    "locale": "en"
                })
            }}
        />
    </div>
));

// --- 11. Real-time Tech Titans ---
export const TechTitansMarketWidget = memo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800">Tech Titans</h3>
        </div>
        <TVWidget
            height="650px"
            scriptHTML={{
                src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                innerHTML: JSON.stringify({
                    "width": "100%",
                    "height": "100%",
                    "symbolsGroups": [
                        {
                            "name": "Technology Leaders",
                            "symbols": [
                                { "name": "NASDAQ:AAPL", "displayName": "Apple" },
                                { "name": "NASDAQ:MSFT", "displayName": "Microsoft" },
                                { "name": "NASDAQ:GOOGL", "displayName": "Alphabet" },
                                { "name": "NASDAQ:AMZN", "displayName": "Amazon" },
                                { "name": "NASDAQ:TSLA", "displayName": "Tesla" },
                                { "name": "NASDAQ:META", "displayName": "Meta" },
                                { "name": "NASDAQ:NVDA", "displayName": "NVIDIA" }
                            ]
                        }
                    ],
                    "showSymbolLogo": true,
                    "colorTheme": "light",
                    "isTransparent": false,
                    "locale": "en"
                })
            }}
        />
    </div>
));

// --- 12. US Advanced Chart Station ---
export const USAdvancedChartWidget = memo(({ symbol = "FOREXCOM:SPXUSD", height = "850px" }: { symbol?: string, height?: string }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-800">US Market Advanced Charting</h3>
        </div>
        <TVWidget
            height={height}
            scriptHTML={{
                src: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
                innerHTML: JSON.stringify({
                    "width": "100%",
                    "height": "850",
                    "symbol": symbol,
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "light",
                    "style": "1",
                    "locale": "en",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_us_advanced_chart"
                })
            }}
        />
    </div>
));
