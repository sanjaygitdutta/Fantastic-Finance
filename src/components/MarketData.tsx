import { memo } from 'react';
import { Globe, Activity, BarChart3, Zap, TrendingUp, Landmark, Layers } from 'lucide-react';
import { useLivePrices } from '../context/LivePriceContext';
import { TickerTapeWidget, GlobalIndicesWidget, TechnicalAnalysisWidget, AdvancedChartWidget } from './TradingViewWidgets';
import { TVWidget } from './TVWidget';
import AdSlot from './AdSlot';

// Helper for local TV widgets if needed
const LocalTVWidget = memo(({ symbolsGroups, height = "450px" }: { symbolsGroups: any[], height?: string }) => {
    return (
        <TVWidget
            height={height}
            scriptHTML={{
                src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
                innerHTML: JSON.stringify({
                    width: "100%",
                    height: "100%",
                    symbolsGroups,
                    showSymbolLogo: true,
                    colorTheme: "light",
                    isTransparent: false,
                    locale: "en"
                })
            }}
        />
    );
});

export default memo(function MarketData() {
    const { usingLiveApi } = useLivePrices();

    return (
        <div className="space-y-6 pb-12 animate-in slide-up">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 filter blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-4">
                            <Globe className="w-10 h-10 text-blue-300" />
                            Live Market Edge
                        </h1>
                        <p className="text-blue-100 text-lg max-w-xl">Professional real-time insights across Global Indices, Equities, Commodities, and Crypto.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-inner">
                        <p className="text-xs text-blue-200 uppercase tracking-widest font-bold mb-1">Market Connectivity</p>
                        <p className="text-xl font-black flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
                            LIVE CONNECTED
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <TickerTapeWidget />
            </div>

            {/* Market Top Ad */}
            <AdSlot slot="market-top-banner" format="horizontal" />

            {!usingLiveApi && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-amber-100 rounded-xl">
                        <Zap className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="font-bold text-amber-900 leading-tight">Enhanced Real-time Protection</p>
                        <p className="text-sm text-amber-800">Direct exchange feeds are active. Some local calculated values may use optimized polling.</p>
                    </div>
                </div>
            )}

            {/* Main Indices Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-indigo-600" />
                                Global Market Pulse
                            </h2>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-Time Quotes</span>
                        </div>
                        <div className="flex-1">
                            <GlobalIndicesWidget />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-emerald-600" />
                                NIFTY 50 Analysis
                            </h2>
                        </div>
                        <div className="flex-1">
                            <TechnicalAnalysisWidget symbol="NSE:NIFTY" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Tier: Commodities & Forex */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[500px] flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                            Commodities & Bullion
                        </h2>
                    </div>
                    <div className="flex-1">
                        <LocalTVWidget
                            symbolsGroups={[
                                {
                                    name: "Commodities",
                                    symbols: [
                                        { name: "COMEX:GC1!", displayName: "Gold" },
                                        { name: "NYMEX:CL1!", displayName: "Crude Oil" },
                                        { name: "COMEX:SI1!", displayName: "Silver" },
                                        { name: "NYMEX:NG1!", displayName: "Natural Gas" },
                                        { name: "MCX:GOLD1!", displayName: "Gold MCX" },
                                        { name: "MCX:CRUDEOIL1!", displayName: "Crude MCX" }
                                    ]
                                }
                            ]}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[500px] flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            <Landmark className="w-6 h-6 text-blue-600" />
                            NSE Sectoral Heatmap
                        </h2>
                    </div>
                    <div className="flex-1">
                        <TechnicalAnalysisWidget symbol="NSE:BANKNIFTY" />
                    </div>
                </div>
            </div>

            {/* Third Tier: Advanced Charts & Crypto */}
            <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            <Layers className="w-6 h-6 text-purple-600" />
                            Professional Charting Station
                        </h2>
                    </div>
                    <div className="h-[600px]">
                        <AdvancedChartWidget symbol="NSE:NIFTY" />
                    </div>
                </div>
            </div>
        </div>
    );
});
