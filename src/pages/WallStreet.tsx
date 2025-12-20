import { Globe, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { useLivePrices } from '../context/LivePriceContext';
import {
    USMarketStatus,
    AIInsightWidget,
    EconomicCalendarWidget,
    SectorHeatmapWidget,
    MostActiveOptionsWidget,
    VIXGauge,
    BondYieldMonitor,
    FedRateMonitor,
    USIndicesMarketWidget,
    TechTitansMarketWidget,
    USAdvancedChartWidget
} from '../components/USMarketWidgets';

export default function WallStreet() {
    const { lastUpdated } = useLivePrices();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SEO
                title="Wall Street Dashboard | Fantastic Finance"
                description="Live real-time quotes for US Indices (NASDAQ, Dow Jones, S&P 500) and Tech Titans (Apple, Microsoft, Tesla, NVIDIA)."
            />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
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
                        <p className="hidden md:block">Real-time professional data for US Markets.</p>
                    </div>
                </div>

                {/* Market Status Widget */}
                <div className="w-full md:w-auto min-w-[300px]">
                    <USMarketStatus />
                </div>
            </div>

            {/* AI Insight Section */}
            <AIInsightWidget />

            {/* WallStreet Middle Ad */}
            <AdSlot slot="wallstreet-middle-banner" format="horizontal" />

            {/* Main Market Overview Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <USIndicesMarketWidget />
                <TechTitansMarketWidget />
            </div>

            {/* Advanced Charting Station */}
            <USAdvancedChartWidget />

            {/* Analysis & Secondary Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Heatmap & Options */}
                <div className="lg:col-span-2 space-y-8">
                    <SectorHeatmapWidget />
                    <MostActiveOptionsWidget />
                </div>

                {/* Right: Macro Indicators */}
                <div className="space-y-8">
                    <VIXGauge />
                    <AdSlot slot="wallstreet-sidebar-1" format="rectangle" />
                    <BondYieldMonitor />
                    <FedRateMonitor />
                    <AdSlot slot="wallstreet-sidebar-2" format="rectangle" />
                    <EconomicCalendarWidget />
                </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
                Data provided by Twelve Data & TradingView. All TradingView widgets feature direct real-time or near-real-time exchange feeds.
            </div>
        </div>
    );
}
