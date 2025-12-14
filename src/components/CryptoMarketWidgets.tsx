import { useEffect, useRef, memo, useState } from 'react';
import { Activity, ArrowRight, Gauge, Layers, TrendingUp, DollarSign } from 'lucide-react';
import { useLivePrices } from '../context/LivePriceContext';

// --- Helper: TV Widget ---
const TVWidget = ({ scriptHTML, height = "400px" }: { scriptHTML: any, height?: string }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        Object.entries(scriptHTML).forEach(([key, value]) => {
            // @ts-ignore
            script[key] = value;
        });
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

// --- 1. Crypto Advanced Chart ---
export const CryptoChartWidget = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">BTC/USD Professional Chart</h3>
            </div>
            <TVWidget
                height="600px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
                    innerHTML: JSON.stringify({
                        "autosize": true,
                        "symbol": "COINBASE:BTCUSD",
                        "interval": "5",
                        "timezone": "Etc/UTC",
                        "theme": "light",
                        "style": "1",
                        "locale": "en",
                        "enable_publishing": false,
                        "hide_top_toolbar": false,
                        "allow_symbol_change": true,
                    })
                }}
            />
        </div>
    );
});

// --- 2. Fear & Greed Index (Simulated) ---
export const FearAndGreedWidget = memo(() => {
    const { prices } = useLivePrices();
    const btc = prices['BTC'];

    // Default to "Greed" (65)
    let score = 65;
    let label = "Greed";

    if (btc) {
        if (btc.changePercent > 5) { score = 85; label = "Extreme Greed"; }
        else if (btc.changePercent > 2) { score = 75; label = "Greed"; }
        else if (btc.changePercent < -5) { score = 15; label = "Extreme Fear"; }
        else if (btc.changePercent < -2) { score = 35; label = "Fear"; }
        else { score = 50; label = "Neutral"; }
    }

    const getColor = (s: number) => {
        if (s >= 75) return 'text-green-600';
        if (s >= 55) return 'text-green-500';
        if (s <= 25) return 'text-red-600';
        if (s <= 45) return 'text-orange-500';
        return 'text-yellow-500';
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-800">Fear & Greed Index</h3>
            </div>

            <div className="relative w-40 h-20 overflow-hidden mb-2">
                {/* Semi-Circle Gauge */}
                <div className="absolute w-40 h-40 rounded-full border-[12px] border-slate-200 border-t-transparent border-l-transparent -rotate-45" style={{
                    borderBottomColor: score > 50 ? '#22c55e' : '#ef4444',
                    borderRightColor: score > 50 ? '#22c55e' : '#ef4444',
                    transform: `rotate(${(score / 100) * 180 - 135}deg)`,
                    transition: 'transform 1s ease-out'
                }}></div>
            </div>

            <div className={`text-4xl font-bold ${getColor(score)} mb-1`}>{score}</div>
            <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">{label}</div>
            <p className="text-xs text-slate-400 mt-4">Proxy based on volatility</p>
        </div>
    );
});


// --- 3. Long/Short Ratio (Sentiment) ---
export const LongShortRatioWidget = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Market Sentiment</h3>
            </div>
            <TVWidget
                height="300px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
                    innerHTML: JSON.stringify({
                        "interval": "1m",
                        "width": "100%",
                        "isTransparent": true,
                        "height": "100%",
                        "symbol": "COINBASE:BTCUSD",
                        "showIntervalTabs": true,
                        "locale": "en",
                        "colorTheme": "light"
                    })
                }}
            />
        </div>
    );
});


// --- 4. Crypto Converter ---
export const CryptoConverterWidget = memo(() => {
    const { prices } = useLivePrices();
    const [amount, setAmount] = useState<string>("1");
    const [crypto, setCrypto] = useState<string>("BTC");
    const [converted, setConverted] = useState<string>("0.00");

    const btcPrice = prices['BTC']?.price || 65000;
    const ethPrice = prices['ETH']?.price || 3500;
    const solPrice = prices['SOL']?.price || 150;
    const xrpPrice = prices['XRP']?.price || 0.60;
    const adaPrice = prices['ADA']?.price || 0.45;
    // ... we could map all, but for now just top ones + user asked ones

    useEffect(() => {
        const val = parseFloat(amount);
        if (isNaN(val)) return;

        let rate = 0;
        if (crypto === 'BTC') rate = btcPrice;
        else if (crypto === 'ETH') rate = ethPrice;
        else if (crypto === 'SOL') rate = solPrice;
        else if (crypto === 'XRP') rate = xrpPrice;
        else if (crypto === 'ADA') rate = adaPrice;
        // Fallback or more cases
        else rate = btcPrice; // default

        setConverted((val * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }));
    }, [amount, crypto, btcPrice, ethPrice, solPrice, xrpPrice, adaPrice]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-slate-800">Crypto Calculator</h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <select
                    value={crypto}
                    onChange={(e) => setCrypto(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="XRP">XRP</option>
                    <option value="ADA">ADA</option>
                </select>
            </div>

            <div className="flex justify-center mb-4">
                <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
                <div className="text-xs text-slate-500 mb-1">Estimated Value (USD)</div>
                <div className="text-2xl font-bold text-green-600">${converted}</div>
            </div>
        </div>
    );
});


// --- 5. Bitcoin Derivatives Data ---
export const BitcoinDerivativesWidget = memo(() => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-800">Bitcoin Futures & Trends</h3>
            </div>
            <TVWidget
                height="400px"
                scriptHTML={{
                    src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                    innerHTML: JSON.stringify({
                        "width": "100%",
                        "height": "100%",
                        "symbolsGroups": [
                            {
                                "name": "Futures",
                                "originalName": "Futures",
                                "symbols": [
                                    { "name": "CME_MINI:BTC1!", "displayName": "BTC Futures (CME)" },
                                    { "name": "BINANCE:BTCUSDT.P", "displayName": "BTCperp (Binance)" },
                                    { "name": "CME_MINI:ETH1!", "displayName": "ETH Futures (CME)" },
                                    { "name": "BINANCE:ETHUSDT.P", "displayName": "ETHperp (Binance)" }
                                ]
                            }
                        ],
                        "showSymbolLogo": true,
                        "colorTheme": "light",
                        "isTransparent": true,
                        "locale": "en"
                    })
                }}
            />
        </div>
    );
});
