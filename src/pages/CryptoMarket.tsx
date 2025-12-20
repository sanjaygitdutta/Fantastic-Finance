import { useLivePrices } from '../context/LivePriceContext';
import { Activity, Globe, Newspaper, ArrowRight, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import {
    CryptoChartWidget,
    FearAndGreedWidget,
    CryptoConverterWidget,
    BitcoinDerivativesWidget,
    LongShortRatioWidget
} from '../components/CryptoMarketWidgets';
import { TVWidget } from '../components/TVWidget';

export default function CryptoMarket() {
    const { prices } = useLivePrices();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-in slide-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SEO
                    title="Live Crypto Market | Real-time Bitcoin & Altcoin Data"
                    description="Track live cryptocurrency prices and trends with professional TradingView integration. Real-time data for BTC, ETH, and more."
                />

                {/* Header Section */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-4">
                            <Globe className="w-10 h-10 text-orange-200" />
                            Crypto Command Center
                        </h1>
                        <p className="text-orange-50 text-lg max-w-2xl">Institutional-grade real-time crypto analytics, heatmaps, and advanced charting.</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Charts & Quotes (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Real-time Crypto Quotes Table */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[500px] flex flex-col">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                    Live Global Crypto Exchange Data
                                </h2>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Live Stream</span>
                            </div>
                            <div className="flex-1">
                                <TVWidget
                                    height="100%"
                                    scriptHTML={{
                                        src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                                        innerHTML: JSON.stringify({
                                            width: "100%",
                                            height: "100%",
                                            symbolsGroups: [
                                                {
                                                    name: "Top Assets",
                                                    symbols: [
                                                        { name: "BINANCE:BTCUSDT", displayName: "Bitcoin" },
                                                        { name: "BINANCE:ETHUSDT", displayName: "Ethereum" },
                                                        { name: "BINANCE:SOLUSDT", displayName: "Solana" },
                                                        { name: "BINANCE:BNBUSDT", displayName: "BNB" },
                                                        { name: "BINANCE:XRPUSDT", displayName: "XRP" }
                                                    ]
                                                },
                                                {
                                                    name: "Ecosystems",
                                                    symbols: [
                                                        { name: "BINANCE:ADAUSDT", displayName: "Cardano" },
                                                        { name: "BINANCE:AVAXUSDT", displayName: "Avalanche" },
                                                        { name: "BINANCE:DOTUSDT", displayName: "Polkadot" },
                                                        { name: "BINANCE:LINKUSDT", displayName: "Chainlink" },
                                                        { name: "BINANCE:MATICUSDT", displayName: "Polygon" }
                                                    ]
                                                }
                                            ],
                                            showSymbolLogo: true,
                                            colorTheme: "light",
                                            isTransparent: false,
                                            locale: "en"
                                        })
                                    }}
                                />
                            </div>
                        </div>

                        {/* Crypto Mid Ad */}
                        <AdSlot slot="crypto-mid-banner" format="horizontal" />

                        {/* Professional Charting */}
                        <CryptoChartWidget />

                        {/* Bitcoin Derivatives */}
                        <BitcoinDerivativesWidget />

                    </div>

                    {/* Right Column: Tools & Sentiment (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Sentiment Analysis */}
                        <LongShortRatioWidget />

                        {/* Fear & Greed */}
                        <FearAndGreedWidget />

                        <AdSlot slot="crypto-sidebar-1" format="rectangle" />

                        {/* Calculator */}
                        <CryptoConverterWidget />

                        <AdSlot slot="crypto-sidebar-2" format="rectangle" />

                        {/* Market News */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                            <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-indigo-600" />
                                Institutional News
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { title: "Bitcoin Consolidation Pattern Signals Upside", time: "1h ago", source: "MarketEdge" },
                                    { title: "Solana Ecosystem TVL Hits 2-Year High", time: "3h ago", source: "CryptoFlow" },
                                    { title: "Global Regulatory Shift Towards Digital Assets", time: "5h ago", source: "FinInsights" },
                                ].map((news, i) => (
                                    <div key={i} className="group cursor-pointer border-l-2 border-slate-100 hover:border-blue-500 pl-4 transition-all">
                                        <h4 className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                            {news.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] uppercase font-bold text-slate-400">
                                            <span>{news.source}</span>
                                            <span>•</span>
                                            <span>{news.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 bg-slate-50 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-100">
                                Global News Hub <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Information Modal Footer */}
                <div className="mt-12 p-8 bg-slate-800 rounded-[2.5rem] text-white/80 shadow-inner">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-sm italic mb-4">
                            "Transparency and Speed are the core pillars of modern finance. Our platform ensures you have the edge with sub-second data synchronization."
                        </p>
                        <div className="h-px bg-white/10 mb-4"></div>
                        <p className="text-xs uppercase tracking-[0.2em]">Data Federated from Exchange Hot-Streams & TradingView</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
