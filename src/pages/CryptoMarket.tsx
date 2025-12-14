import { useLivePrices } from '../context/LivePriceContext';
import { TrendingUp, TrendingDown, Bitcoin, Activity, Clock, Zap, Globe, Newspaper, ArrowRight, Wallet } from 'lucide-react';
import SEO from '../components/SEO';
import {
    CryptoChartWidget,
    FearAndGreedWidget,
    LongShortRatioWidget,
    CryptoConverterWidget,
    BitcoinDerivativesWidget
} from '../components/CryptoMarketWidgets';

export default function CryptoMarket() {
    const { prices, lastUpdated } = useLivePrices();

    // Extended list of Cryptos
    const cryptos = [
        { key: 'BTC', name: 'Bitcoin', symbol: 'BTC/USD', color: 'text-orange-600', bg: 'bg-orange-100', icon: Bitcoin },
        { key: 'ETH', name: 'Ethereum', symbol: 'ETH/USD', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Activity },
        { key: 'SOL', name: 'Solana', symbol: 'SOL/USD', color: 'text-purple-600', bg: 'bg-purple-100', icon: Zap },
        { key: 'XRP', name: 'XRP', symbol: 'XRP/USD', color: 'text-blue-600', bg: 'bg-blue-100', icon: Globe },
        { key: 'ADA', name: 'Cardano', symbol: 'ADA/USD', color: 'text-blue-500', bg: 'bg-blue-50', icon: Wallet },
        { key: 'DOGE', name: 'Dogecoin', symbol: 'DOGE/USD', color: 'text-yellow-500', bg: 'bg-yellow-100', icon: Wallet },
        { key: 'DOT', name: 'Polkadot', symbol: 'DOT/USD', color: 'text-pink-600', bg: 'bg-pink-100', icon: Wallet },
        { key: 'UNI', name: 'Uniswap', symbol: 'UNI/USD', color: 'text-pink-500', bg: 'bg-pink-50', icon: Wallet },
        { key: 'LINK', name: 'Chainlink', symbol: 'LINK/USD', color: 'text-blue-700', bg: 'bg-blue-100', icon: Globe },
        { key: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH/USD', color: 'text-green-600', bg: 'bg-green-100', icon: Bitcoin },
    ];

    // Calculate Market Overview (Top Gainers/Losers)
    const marketMovers = [...cryptos].map(c => ({
        ...c,
        data: prices[c.key] || { price: 0, change: 0, changePercent: 0 }
    })).sort((a, b) => b.data.changePercent - a.data.changePercent);

    const topGainers = marketMovers.slice(0, 3);
    const topLosers = [...marketMovers].reverse().slice(0, 3);

    const PriceCard = ({ item }: { item: any }) => {
        const data = prices[item.key];

        // Skeleton
        if (!data) return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            </div>
        );

        const isPositive = data.change >= 0;
        const Icon = item.icon;

        return (
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 p-6 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.bg}`}>
                            <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                {item.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">{item.symbol}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm">{Math.abs(data.changePercent).toFixed(2)}%</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                        ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SEO
                    title="Live Crypto Market | Fantastic Finance"
                    description="Real-time cryptocurrency prices for Bitcoin, Ethereum, XRP, ADA, and more. Track the crypto market 24/7."
                />

                {/* Header */}
                <div className="mb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Crypto Market
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <p>Global Market Data</p>
                            <span className="flex items-center gap-1 bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 shadow-sm">
                                <Clock className="w-3 h-3" />
                                Updated: {lastUpdated?.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: All Assets & Tools (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Full Asset List Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                Market Watch
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cryptos.map(crypto => (
                                    <PriceCard key={crypto.key} item={crypto} />
                                ))}
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Advanced Analysis</h2>
                            <CryptoChartWidget />
                        </div>

                        {/* Bitcoin Derivatives */}
                        <BitcoinDerivativesWidget />

                    </div>

                    {/* Right Column: Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Market Movers */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Top Movers</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Top Gainers</p>
                                    {topGainers.map((coin) => (
                                        <div key={coin.key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-700">{coin.name}</span>
                                                <span className="text-xs text-slate-400">{coin.key}</span>
                                            </div>
                                            <span className="text-green-600 font-medium">+{coin.data.changePercent.toFixed(2)}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Top Losers</p>
                                    {topLosers.map((coin) => (
                                        <div key={coin.key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-700">{coin.name}</span>
                                                <span className="text-xs text-slate-400">{coin.key}</span>
                                            </div>
                                            <span className="text-red-500 font-medium">{coin.data.changePercent.toFixed(2)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fear & Greed */}
                        <FearAndGreedWidget />

                        {/* Converter */}
                        <CryptoConverterWidget />

                        {/* News Section (Mock) */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-purple-600" />
                                Latest News
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: "Bitcoin Hits New Yearly High", time: "2h ago", source: "CoinDesk" },
                                    { title: "SEC Approves New Crypto ETF", time: "4h ago", source: "Bloomberg" },
                                    { title: "Ethereum Upgrade Successful", time: "6h ago", source: "Decrypt" },
                                ].map((news, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <h4 className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {news.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                            <span>{news.source}</span>
                                            <span>•</span>
                                            <span>{news.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                                Read More <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-sm text-slate-500 mb-2">
                        Disclaimer: Cryptocurrency investments are subject to market risks. The data provided here is for informational purposes only.
                    </p>
                    <p className="text-xs text-slate-400">
                        Data provided by Twelve Data & TradingView.
                    </p>
                </div>
            </div>
        </div>
    );
}
