import { useLivePrices } from '../context/LivePriceContext';
import { TrendingUp, TrendingDown, Globe, Zap, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import {
    USMarketStatus,
    AIInsightWidget,
    EconomicCalendarWidget,
    SectorHeatmapWidget,
    MostActiveOptionsWidget,
    VIXGauge,
    BondYieldMonitor,
    FedRateMonitor
} from '../components/USMarketWidgets';

export default function WallStreet() {
    const { prices, lastUpdated } = useLivePrices();

    const indices = [
        { key: 'NASDAQ', name: 'NASDAQ Composite', subtitle: 'Tech Heavy' },
        { key: 'DOW JONES', name: 'Dow Jones Industrial', subtitle: 'Blue Chips' },
        { key: 'S&P 500', name: 'S&P 500', subtitle: 'Broad Market' },
    ];

    const techTitans = [
        { key: 'AAPL', name: 'Apple Inc.' },
        { key: 'MSFT', name: 'Microsoft Corp.' },
        { key: 'GOOGL', name: 'Alphabet Inc.' },
        { key: 'AMZN', name: 'Amazon.com' },
        { key: 'TSLA', name: 'Tesla Inc.' },
        { key: 'META', name: 'Meta Platforms' },
        { key: 'NVDA', name: 'NVIDIA Corp.' },
    ];

    const PriceCard = ({ item, type }: { item: any, type: 'index' | 'stock' }) => {
        const data = prices[item.key];
        if (!data) return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            </div>
        );

        const isPositive = data.change >= 0;

        return (
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 p-6 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${isPositive ? 'from-green-50 to-transparent' : 'from-red-50 to-transparent'} rounded-bl-full -mr-4 -mt-4 opacity-50`}></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                        {type === 'index' && <p className="text-xs text-slate-500 font-medium">{item.subtitle}</p>}
                        {type === 'stock' && <p className="text-xs text-slate-500 font-medium">{item.key}</p>}
                    </div>
                    <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">
                        {data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center gap-2 mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{isPositive ? '+' : ''}{data.change.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                            {Math.abs(data.changePercent).toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO
                title="Wall Street Dashboard | Fantastic Finance"
                description="Live quotes for US Indices (NASDAQ, Dow Jones, S&P 500) and Tech Titans (Apple, Microsoft, Tesla, NVIDIA)."
            />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-900">Wall Street</h1>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                            <Clock className="w-3 h-3" /> Updated: {lastUpdated?.toLocaleTimeString()}
                        </span>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <p className="hidden md:block">Real-time data for major indices and technology leaders.</p>
                    </div>
                </div>

                {/* Market Status Widget */}
                <div className="w-full md:w-auto min-w-[300px]">
                    <USMarketStatus />
                </div>
            </div>

            {/* AI Insight Section */}
            <section className="mb-10">
                <AIInsightWidget />
            </section>

            {/* Major Indices & VIX */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Major Indices & Macro
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {indices.map(idx => (
                        <PriceCard key={idx.key} item={idx} type="index" />
                    ))}
                    {/* VIX as a card */}
                    <div className="lg:col-span-1">
                        <VIXGauge />
                    </div>
                </div>
            </section>

            {/* Main Content Grid: Heatmap + Yields on Left, Sidebars on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Left Column (2 cols wide) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tech Titans */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Tech Titans
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {techTitans.map(stock => (
                                <PriceCard key={stock.key} item={stock} type="stock" />
                            ))}
                        </div>
                    </section>

                    {/* Heatmap */}
                    <section>
                        <SectorHeatmapWidget />
                    </section>
                </div>

                {/* Right Column (1 col wide) */}
                <div className="space-y-8">
                    {/* Most Active */}
                    <MostActiveOptionsWidget />

                    {/* Bond Yields */}
                    <BondYieldMonitor />

                    {/* Fed Rate */}
                    <FedRateMonitor />

                    {/* Economic Calendar */}
                    <EconomicCalendarWidget />
                </div>
            </div>

            <div className="mt-12 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
                Data provided by Twelve Data & TradingView. Quotes may be delayed by up to 15 minutes depending on exchange rules for free tier access.
            </div>
        </div>
    );
}
