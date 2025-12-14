import { useState } from 'react';
import { Filter, Search, TrendingUp, TrendingDown, Activity, ArrowRight, Zap, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StrategyOpportunity {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    ivRank: number;
    pcr: number;
    trend: 'Bullish' | 'Bearish' | 'Neutral';
    recommendedStrategy: string;
    reason: string;
    probability: number;
    maxProfit: string;
    risk: 'Low' | 'Medium' | 'High';
}

const mockOpportunities: StrategyOpportunity[] = [
    {
        id: '1',
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        price: 2980,
        change: 1.5,
        ivRank: 85,
        pcr: 1.2,
        trend: 'Bullish',
        recommendedStrategy: 'Bull Put Spread',
        reason: 'High IV suggests selling premium. Strong bullish momentum.',
        probability: 72,
        maxProfit: '₹12,500',
        risk: 'Medium'
    },
    {
        id: '2',
        symbol: 'INFY',
        name: 'Infosys',
        price: 1650,
        change: -0.2,
        ivRank: 92,
        pcr: 0.8,
        trend: 'Neutral',
        recommendedStrategy: 'Iron Condor',
        reason: 'Extremely high IV Rank (92). Stock is range-bound.',
        probability: 68,
        maxProfit: '₹18,000',
        risk: 'Medium'
    },
    {
        id: '3',
        symbol: 'HDFCBANK',
        name: 'HDFC Bank',
        price: 1450,
        change: -1.8,
        ivRank: 25,
        pcr: 0.5,
        trend: 'Bearish',
        recommendedStrategy: 'Long Put',
        reason: 'Low IV makes buying options cheap. Breakdown confirmed.',
        probability: 65,
        maxProfit: 'Unlimited',
        risk: 'High'
    },
    {
        id: '4',
        symbol: 'TATASTEEL',
        name: 'Tata Steel',
        price: 155,
        change: 2.1,
        ivRank: 45,
        pcr: 1.5,
        trend: 'Bullish',
        recommendedStrategy: 'Bull Call Spread',
        reason: 'Moderate IV. Good risk/reward for directional play.',
        probability: 60,
        maxProfit: '₹8,500',
        risk: 'Low'
    },
    {
        id: '5',
        symbol: 'SBIN',
        name: 'State Bank of India',
        price: 780,
        change: 0.5,
        ivRank: 15,
        pcr: 0.9,
        trend: 'Neutral',
        recommendedStrategy: 'Calendar Spread',
        reason: 'Low IV environment perfectly suited for calendars.',
        probability: 62,
        maxProfit: '₹6,000',
        risk: 'Low'
    }
];

export default function StrategyScreener() {
    const [filter, setFilter] = useState<'All' | 'Bullish' | 'Bearish' | 'Neutral'>('All');
    const [ivFilter, setIvFilter] = useState<'All' | 'High' | 'Low'>('All');

    const filteredOpps = mockOpportunities.filter(opp => {
        if (filter !== 'All' && opp.trend !== filter) return false;
        if (ivFilter === 'High' && opp.ivRank < 50) return false;
        if (ivFilter === 'Low' && opp.ivRank >= 50) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 rounded-3xl text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    Strategy Screener
                </h1>
                <p className="text-violet-100">AI-powered scanner finding high-probability option setups</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium mr-4">
                    <Filter className="w-4 h-4" /> Filters:
                </div>

                <div className="flex gap-2">
                    {['All', 'Bullish', 'Bearish', 'Neutral'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIvFilter('All')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${ivFilter === 'All' ? 'bg-slate-100 text-slate-700' : 'text-slate-500'}`}
                    >
                        Any IV
                    </button>
                    <button
                        onClick={() => setIvFilter('High')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${ivFilter === 'High' ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}
                    >
                        High IV (Sell)
                    </button>
                    <button
                        onClick={() => setIvFilter('Low')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${ivFilter === 'Low' ? 'bg-blue-100 text-blue-700' : 'text-slate-500'}`}
                    >
                        Low IV (Buy)
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpps.map(opp => (
                    <div key={opp.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        {opp.symbol}
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${opp.trend === 'Bullish' ? 'bg-green-100 text-green-700' :
                                            opp.trend === 'Bearish' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {opp.trend}
                                        </span>
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{opp.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-white">₹{opp.price}</p>
                                    <p className={`text-xs font-medium ${opp.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {opp.change >= 0 ? '+' : ''}{opp.change}%
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">IV Rank</p>
                                    <div className="flex items-center gap-2">
                                        <Activity className={`w-4 h-4 ${opp.ivRank > 50 ? 'text-orange-500' : 'text-blue-500'}`} />
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{opp.ivRank}</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">PCR</p>
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4 text-purple-500" />
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{opp.pcr}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-slate-800 dark:text-white">Recommended: {opp.recommendedStrategy}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {opp.reason}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-slate-500">Prob. of Profit</p>
                                    <p className="font-bold text-green-600">{opp.probability}%</p>
                                </div>
                                <Link
                                    to="/strategy"
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium text-sm hover:opacity-90 transition"
                                >
                                    Analyze <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className={`h-1.5 w-full ${opp.risk === 'Low' ? 'bg-green-500' :
                            opp.risk === 'Medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
