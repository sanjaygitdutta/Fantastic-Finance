import { Globe, Activity, LineChart as ChartIcon, RefreshCw } from 'lucide-react';
import AdSlot from './AdSlot';
import { ForexQuotesWidget, AdvancedChartWidget, TechnicalAnalysisWidget } from './TradingViewWidgets';

export default function Currency() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Currency Market</h1>
                        <p className="text-slate-500 dark:text-slate-400">Real-time foreign exchange rates & forex analytics</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Forex Quotes Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <h2 className="font-bold text-slate-900 dark:text-white">Live Forex Rates</h2>
                        </div>
                        <ForexQuotesWidget height="950px" />
                    </div>

                    {/* Advanced Charting Station */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <ChartIcon className="w-5 h-5 text-purple-500" />
                            <h2 className="font-bold text-slate-900 dark:text-white">USD/INR Advanced Chart</h2>
                        </div>
                        <AdvancedChartWidget symbol="FX_IDC:USDINR" height="950px" />
                    </div>
                </div>

                {/* Right: Technical Analysis & Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">Analysis: USD/INR</h2>
                        </div>
                        <TechnicalAnalysisWidget symbol="FX_IDC:USDINR" height="450px" />
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">Analysis: EUR/USD</h2>
                        </div>
                        <TechnicalAnalysisWidget symbol="FX:EURUSD" height="450px" />
                    </div>

                    {/* Info Box */}
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <RefreshCw className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">About Forex</h4>
                                <p className="text-sm text-cyan-800 dark:text-cyan-400">
                                    The Forex market operates 24/5 and is the most liquid market globally. Trading pairs involve a base currency and a quote currency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <AdSlot slot="currency-bottom" format="horizontal" className="mt-8 opacity-80" />
        </div>
    );
}
