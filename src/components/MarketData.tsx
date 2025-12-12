import { memo } from 'react';
import { Globe, TrendingUp, Activity, BarChart3, Zap, DollarSign } from 'lucide-react';
import { useLivePrices } from '../context/LivePriceContext';
import LiveMarketTicker from './LiveMarketTicker';
import LivePriceGrid from './LivePriceGrid';

// Main Market Data Component
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

            {/* Live Market Ticker */}
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
                <div className="p-4">
                    <LivePriceGrid
                        symbols={['NASDAQ', 'DOW JONES', 'S&P 500', 'DAX', 'FTSE', 'NIFTY 50', 'BANKNIFTY', 'SENSEX']}
                        columns={4}
                    />
                </div>
            </div>

            {/* Indian Indices & Top Stocks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-green-50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                            Indian Indices
                        </h2>
                    </div>
                    <div className="p-4">
                        <LivePriceGrid symbols={['NIFTY 50', 'BANKNIFTY', 'SENSEX']} columns={2} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            Popular Stocks
                        </h2>
                    </div>
                    <div className="p-4">
                        <LivePriceGrid symbols={['RELIANCE', 'TCS', 'HDFCBANK', 'INFY']} columns={2} />
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
                    <LivePriceGrid symbols={['GOLD', 'SILVER', 'CRUDEOIL']} columns={3} />
                </div>
            </div>

            {/* Cryptocurrencies */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-purple-600" />
                        Cryptocurrencies
                    </h2>
                </div>
                <div className="p-4">
                    <LivePriceGrid symbols={['BTC', 'ETH', 'SOL']} columns={3} />
                </div>
            </div>
        </div>
    );
});
